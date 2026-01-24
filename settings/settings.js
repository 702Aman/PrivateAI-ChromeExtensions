// Load saved settings
async function loadSettings() {
  try {
    const result = await chromeStorageGet(['apiConfig', 'theme']);
    const config = result.apiConfig || {
      provider: 'gemini',
      geminiApiKey: '',
      openaiApiKey: '',
      ollamaEndpoint: 'http://localhost:11434',
      ollamaModel: 'llama3:latest'
    };

    const theme = result.theme || 'dark';

    // Set theme
    applyTheme(theme);
    updateThemeToggle(theme);

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
  document.getElementById('ollamaInfo').classList.remove('active');
  
  if (provider === 'gemini') {
    document.getElementById('geminiSettings').classList.add('active');
    document.getElementById('geminiInfo').classList.add('active');
  } else if (provider === 'openai') {
    document.getElementById('openaiSettings').classList.add('active');
  } else if (provider === 'ollama') {
    document.getElementById('ollamaSettings').classList.add('active');
    document.getElementById('ollamaInfo').classList.add('active');
    document.getElementById('ollamaStatus').style.display = 'flex';
    checkOllamaConnection();
  }
}

// Apply theme to the page
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    document.body.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
    document.body.classList.remove('light-theme');
  }
}

// Update theme toggle UI
function updateThemeToggle(theme) {
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  
  if (theme === 'light') {
    toggle.classList.add('active');
    icon.textContent = '☀️';
  } else {
    toggle.classList.remove('active');
    icon.textContent = '🌙';
  }
}

// Handle theme toggle
async function toggleTheme() {
  const toggle = document.getElementById('themeToggle');
  const isLight = toggle.classList.contains('active');
  const newTheme = isLight ? 'dark' : 'light';
  
  applyTheme(newTheme);
  updateThemeToggle(newTheme);
  
  // Save theme preference
  await chromeStorageSet({ theme: newTheme });
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // Add event listeners for buttons
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('backBtn').addEventListener('click', goBack);
  document.getElementById('geminiLink').addEventListener('click', openGeminiLink);
  document.getElementById('ollamaLink').addEventListener('click', openOllamaLink);
  document.getElementById('githubLink').addEventListener('click', openGithubLink);
  
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Provider change handler
  document.getElementById('apiProvider').addEventListener('change', (e) => {
    updateProviderSettings(e.target.value);
  });

  // Ollama connection check on endpoint/model changes
  document.getElementById('ollamaEndpoint').addEventListener('change', checkOllamaConnection);
  document.getElementById('ollamaEndpoint').addEventListener('keyup', debounceCheckOllama);
  document.getElementById('ollamaModel').addEventListener('change', checkOllamaConnection);
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

// Open Ollama link
function openOllamaLink() {
  chrome.tabs.create({ url: 'https://ollama.ai' });
}

// Open GitHub link
function openGithubLink() {
  chrome.tabs.create({ url: 'https://github.com/702Aman/PrivateAI-ChromeExtensions' });
}

// Debounce for checking Ollama connection during typing
let ollamaCheckTimeout;
function debounceCheckOllama() {
  clearTimeout(ollamaCheckTimeout);
  ollamaCheckTimeout = setTimeout(checkOllamaConnection, 800);
}

// Check Ollama connection status
async function checkOllamaConnection() {
  const endpoint = document.getElementById('ollamaEndpoint').value.trim();
  const statusEl = document.getElementById('ollamaStatus');

  if (!endpoint) {
    statusEl.textContent = 'Enter endpoint to check';
    statusEl.classList.remove('connected');
    statusEl.classList.add('disconnected');
    return;
  }

  statusEl.textContent = 'Checking connection...';
  statusEl.classList.remove('connected', 'disconnected');

  try {
    const response = await fetch(`${endpoint}/api/tags`, {
      method: 'GET',
      timeout: 5000
    });

    if (response.ok) {
      statusEl.innerHTML = '<div class="ollama-status-dot"></div><span>✅ Connected</span>';
      statusEl.classList.remove('disconnected');
      statusEl.classList.add('connected');
    } else {
      statusEl.innerHTML = '<div class="ollama-status-dot"></div><span>❌ Connection failed</span>';
      statusEl.classList.remove('connected');
      statusEl.classList.add('disconnected');
    }
  } catch (err) {
    statusEl.innerHTML = '<div class="ollama-status-dot"></div><span>❌ Ollama not running</span>';
    statusEl.classList.remove('connected');
    statusEl.classList.add('disconnected');
  }
}

// Go back to popup
function goBack() {
  window.close();
}
