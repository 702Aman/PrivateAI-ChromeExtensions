// Load saved settings
async function loadSettings() {
  try {
    const result = await chromeStorageGet(['apiConfig']);
    const config = result.apiConfig || {
      provider: 'gemini',
      geminiApiKey: '',
      openaiApiKey: '',
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'llama3:latest'
    };

    // Set UI values
    document.getElementById('apiProvider').value = config.provider;
    document.getElementById('geminiApiKey').value = config.geminiApiKey || '';
    document.getElementById('openaiApiKey').value = config.openaiApiKey || '';
    document.getElementById('ollamaEndpoint').value = config.ollamaEndpoint || 'http://localhost:11434';
    document.getElementById('ollamaModel').value = config.ollamaModel || 'llama3:latest';

    // Show/hide relevant settings
    updateProviderSettings(config.provider);
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

// Chrome storage helper
function chromeStorageGet(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

function chromeStorageSet(obj) {
  return new Promise((resolve) => {
    chrome.storage.local.set(obj, resolve);
  });
}

// Update UI based on provider selection
function updateProviderSettings(provider) {
  document.getElementById('geminiSettings').classList.remove('active');
  document.getElementById('openaiSettings').classList.remove('active');
  document.getElementById('ollamaSettings').classList.remove('active');
  document.getElementById('geminiInfo').classList.remove('active');
  
  if (provider === 'gemini') {
    document.getElementById('geminiSettings').classList.add('active');
    document.getElementById('geminiInfo').classList.add('active');
  } else if (provider === 'openai') {
    document.getElementById('openaiSettings').classList.add('active');
  } else if (provider === 'ollama') {
    document.getElementById('ollamaSettings').classList.add('active');
  }
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // Add event listeners for buttons
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('backBtn').addEventListener('click', goBack);
  document.getElementById('geminiLink').addEventListener('click', openGeminiLink);
  
  // Provider change handler
  document.getElementById('apiProvider').addEventListener('change', (e) => {
    updateProviderSettings(e.target.value);
  });
});
async function saveSettings() {
  const provider = document.getElementById('apiProvider').value;
  const statusEl = document.getElementById('status');

  try {
    // Validate API key
    if (provider === 'gemini') {
      const apiKey = document.getElementById('geminiApiKey').value.trim();
      if (!apiKey) {
        showStatus('Please enter your Gemini API key', 'error');
        return;
      }
      if (apiKey.length < 20) {
        showStatus('API key appears too short. Please check it.', 'error');
        return;
      }
    } else if (provider === 'openai') {
      const apiKey = document.getElementById('openaiApiKey').value.trim();
      if (!apiKey) {
        showStatus('Please enter your OpenAI API key', 'error');
        return;
      }
    } else if (provider === 'ollama') {
      const endpoint = document.getElementById('ollamaEndpoint').value.trim();
      const model = document.getElementById('ollamaModel').value.trim();
      if (!endpoint || !model) {
        showStatus('Please enter Ollama endpoint and model', 'error');
        return;
      }
    }

    // Save config
    const config = {
      provider: provider,
      geminiApiKey: document.getElementById('geminiApiKey').value,
      openaiApiKey: document.getElementById('openaiApiKey').value,
      ollamaEndpoint: document.getElementById('ollamaEndpoint').value,
      ollamaModel: document.getElementById('ollamaModel').value
    };

    await chromeStorageSet({ apiConfig: config });
    showStatus('✅ Settings saved successfully!', 'success');
    
    // Go back after 1.5 seconds
    setTimeout(() => {
      goBack();
    }, 1500);
  } catch (err) {
    console.error('Error saving settings:', err);
    showStatus('Error saving settings: ' + err.message, 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
  
  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

// Open Gemini API link
function openGeminiLink() {
  chrome.tabs.create({ url: 'https://aistudio.google.com/app/api-keys' });
}

// Go back to popup
function goBack() {
  window.close();
}
