// Constants
const REQUEST_TIMEOUT = 30000;
const RETRY_ATTEMPTS = 1;

// ========== CONTEXT MENUS ==========
const CONTEXT_MENU_ACTIONS = [
  { id: 'quickai-summarize', title: '📄 Summarize', prompt: 'Summarize the following text concisely:\n\n' },
  { id: 'quickai-explain', title: '💡 Explain', prompt: 'Explain the following text in simple terms:\n\n' },
  { id: 'quickai-rewrite', title: '✏️ Rewrite', prompt: 'Rewrite the following text to be clearer and more professional:\n\n' },
  { id: 'quickai-translate', title: '🌐 Translate', prompt: null }, // prompt built dynamically from settings
  { id: 'quickai-fix-grammar', title: '🔧 Fix Grammar', prompt: 'Fix grammar, spelling, and punctuation in the following text. Return only the corrected text:\n\n' },
];

// Create context menus on install/update
chrome.runtime.onInstalled.addListener(() => {
  // Remove existing menus first
  chrome.contextMenus.removeAll(() => {
    // Parent menu
    chrome.contextMenus.create({
      id: 'quickai-parent',
      title: '🤖 QuickAI',
      contexts: ['selection']
    });

    // Sub-menu items
    CONTEXT_MENU_ACTIONS.forEach(action => {
      chrome.contextMenus.create({
        id: action.id,
        parentId: 'quickai-parent',
        title: action.title,
        contexts: ['selection']
      });
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText;
  if (!selectedText || !selectedText.trim()) return;

  const action = CONTEXT_MENU_ACTIONS.find(a => a.id === info.menuItemId);
  if (!action) return;

  // Tell content script to show loading panel
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'context-menu-action' });
  } catch (e) {
    // Content script not loaded — inject it first
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content/content.js']
      });
      await chrome.tabs.sendMessage(tab.id, { type: 'context-menu-action' });
    } catch (err) {
      console.error('Failed to inject content script:', err);
      return;
    }
  }

  // Build prompt — for translate, build dynamically from saved language setting
  let fullPrompt;
  if (action.id === 'quickai-translate') {
    const config = await chromeStorageGet(['apiConfig']);
    const targetLang = (config.apiConfig && config.apiConfig.translateLanguage) || 'English';
    fullPrompt = `Translate the following text to ${targetLang}. If it's already in ${targetLang}, keep it as-is and mention that it's already in ${targetLang}:\n\n` + selectedText.trim();
  } else {
    fullPrompt = action.prompt + selectedText.trim();
  }

  // Get config and query AI
  try {
    const config = await chromeStorageGet(['apiConfig']);
    const apiConfig = config.apiConfig || { provider: 'gemini' };

    // Stream callback sends chunks to content script
    const streamCallback = (chunk) => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'context-menu-stream',
        chunk: chunk
      }).catch(() => {});
    };

    let result;

    if (apiConfig.provider === 'gemini') {
      if (!apiConfig.geminiApiKey) {
        chrome.tabs.sendMessage(tab.id, { type: 'context-menu-result', error: 'Gemini API key not configured. Open QuickAI settings.' });
        return;
      }
      result = await queryGemini(apiConfig.geminiApiKey, fullPrompt, streamCallback);
    } else if (apiConfig.provider === 'openai') {
      if (!apiConfig.openaiApiKey) {
        chrome.tabs.sendMessage(tab.id, { type: 'context-menu-result', error: 'OpenAI API key not configured. Open QuickAI settings.' });
        return;
      }
      result = await queryOpenAI(apiConfig.openaiApiKey, fullPrompt, streamCallback);
    } else if (apiConfig.provider === 'ollama') {
      result = await queryOllama(
        apiConfig.ollamaEndpoint || 'http://localhost:11434',
        apiConfig.ollamaModel || 'llama3:latest',
        fullPrompt,
        streamCallback
      );
    }

    if (result.success) {
      chrome.tabs.sendMessage(tab.id, { type: 'context-menu-result', data: result.data });
    } else {
      chrome.tabs.sendMessage(tab.id, { type: 'context-menu-result', error: result.error });
    }
  } catch (err) {
    chrome.tabs.sendMessage(tab.id, { type: 'context-menu-result', error: err.message });
  }
});

// Validate message format
function validateMessage(msg) {
  if (!msg.type || msg.type !== "ask-ai") return false;
  if (!msg.prompt || typeof msg.prompt !== 'string') return false;
  return true;
}

// Fetch with timeout
function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

// Get Chrome storage
function chromeStorageGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

// Query Gemini API with streaming support
async function queryGemini(apiKey, prompt, streamCallback = null) {
  try {
    // Try gemini-2.0-flash (latest model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      
      if (response.status === 400) {
        throw new Error('Invalid request - Check your API key format (should start with AIza...)');
      }
      if (response.status === 401) {
        throw new Error('Invalid/Unauthorized API key. Verify it in Google AI Studio settings.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. Enable Generative Language API in your Google Cloud project.');
      }
      if (response.status === 404) {
        throw new Error('API endpoint not found (404). Your API key may not be valid or Generative Language API is not enabled.');
      }
      if (response.status === 429) {
        throw new Error('Free tier quota exceeded for Gemini API. Please set up billing in Google Cloud Console or wait a few moments.');
      }
      if (response.status === 500) {
        throw new Error('Gemini API server error. Try again later.');
      }
      throw new Error(`HTTP ${response.status}: ${errorBody || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini - no content returned');
    }

    const text = data.candidates[0].content.parts[0].text;
    
    // Stream the response if callback provided
    if (streamCallback) {
      const words = text.split(' ');
      for (const word of words) {
        streamCallback(word + ' ');
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay between words
      }
    }
    
    return { success: true, data: text };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to query Gemini'
    };
  }
}

// Query OpenAI API with streaming support
async function queryOpenAI(apiKey, prompt, streamCallback = null) {
  try {

    const response = await fetchWithTimeout(
      'https://api.openai.com/v1/chat/completions',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded or quota exhausted. Check your OpenAI billing.');
      }
      if (response.status === 500 || response.status === 503) {
        throw new Error('OpenAI server error. Please try again later.');
      }
      throw new Error(`HTTP ${response.status}: ${errorBody || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI - no choices returned');
    }
    
    if (!data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response from OpenAI - no message content');
    }
    
    const text = data.choices[0].message.content;
    
    // Stream the response if callback provided
    if (streamCallback) {
      const words = text.split(' ');
      for (const word of words) {
        streamCallback(word + ' ');
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay between words
      }
    }
    
    return { success: true, data: text };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to query OpenAI'
    };
  }
}

// Query Ollama API with streaming support
async function queryOllama(endpoint, model, prompt, streamCallback = null) {
  try {

    const response = await fetchWithTimeout(
      `${endpoint}/api/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false
        })
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model not found: ${model}. Did you pull it?`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid response from Ollama');
    }

    // Stream the response if callback provided
    if (streamCallback) {
      const words = data.response.split(' ');
      for (const word of words) {
        streamCallback(word + ' ');
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay between words
      }
    }

    return { success: true, data: data.response };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Cannot connect to Ollama. Is it running?'
    };
  }
}

// Main message handler with streaming support
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Handle content script injection requests from popup
  if (msg.type === 'inject-content-script' && msg.tabId) {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      files: ['src/content/content.js']
    }).then(() => sendResponse({ ok: true }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (!validateMessage(msg)) {
    sendResponse({ ok: false, error: 'Invalid message format' });
    return;
  }

  // Handle async operation
  (async () => {
    try {
      const config = await chromeStorageGet(['apiConfig']);
      const apiConfig = config.apiConfig || { provider: 'gemini' };

      let result;
      
      // Stream callback to send chunks to the popup
      const streamCallback = (chunk) => {
        // Use chrome.runtime.sendMessage without tabId for popup communication
        // sender.tab is undefined when message comes from popup
        chrome.runtime.sendMessage({
          type: 'stream-chunk',
          chunk: chunk
        }).catch(() => {});
      };

      if (apiConfig.provider === 'gemini') {
        if (!apiConfig.geminiApiKey) {
          return sendResponse({ ok: false, error: 'Gemini API key not configured. Open settings to add it.' });
        }
        result = await queryGemini(apiConfig.geminiApiKey, msg.prompt, streamCallback);
      } else if (apiConfig.provider === 'openai') {
        if (!apiConfig.openaiApiKey) {
          return sendResponse({ ok: false, error: 'OpenAI API key not configured. Open settings to add it.' });
        }
        result = await queryOpenAI(apiConfig.openaiApiKey, msg.prompt, streamCallback);
      } else if (apiConfig.provider === 'ollama') {
        result = await queryOllama(
          apiConfig.ollamaEndpoint || 'http://localhost:11434',
          apiConfig.ollamaModel || 'llama3:latest',
          msg.prompt,
          streamCallback
        );
      }

      if (result.success) {
        sendResponse({ ok: true, data: result.data, streaming: true });
      } else {
        sendResponse({ ok: false, error: result.error });
      }
    } catch (err) {
      sendResponse({ ok: false, error: err.message });
    }
  })();

  return true; // Keep channel open for async response
});
