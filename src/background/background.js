// Constants
const REQUEST_TIMEOUT = 30000;
const RETRY_ATTEMPTS = 1;

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
    console.log("Background: Querying Gemini API...");
    console.log("API Key format:", apiKey ? `${apiKey.substring(0, 10)}...` : 'empty');

    // Try gemini-2.0-flash (latest model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    console.log("Endpoint:", url.substring(0, 80) + "...");

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

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log("Error body:", errorBody);
      
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
    console.log("Gemini response received");
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Invalid response structure:", data);
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
    console.error('Gemini error:', err);
    return {
      success: false,
      error: err.message || 'Failed to query Gemini'
    };
  }
}

// Query OpenAI API with streaming support
async function queryOpenAI(apiKey, prompt, streamCallback = null) {
  try {
    console.log("Background: Querying OpenAI API...");

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
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
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
    console.error('OpenAI error:', err);
    return {
      success: false,
      error: err.message || 'Failed to query OpenAI'
    };
  }
}

// Query Ollama API with streaming support
async function queryOllama(endpoint, model, prompt, streamCallback = null) {
  try {
    console.log("Background: Querying Ollama...", { model });

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
    console.error('Ollama error:', err);
    return {
      success: false,
      error: err.message || 'Cannot connect to Ollama. Is it running?'
    };
  }
}

// Main message handler with streaming support
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
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
        chrome.runtime.sendMessage(sender.tab.id, {
          type: 'stream-chunk',
          chunk: chunk
        }).catch(err => {
          console.log('Stream message send error (may be expected if popup closed):', err);
        });
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
      console.error('Error:', err);
      sendResponse({ ok: false, error: err.message });
    }
  })();

  return true; // Keep channel open for async response
});
