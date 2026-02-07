// ========== THEME MANAGEMENT ==========
async function applyTheme() {
  try {
    const result = await chromeStorageGet(['theme']);
    const theme = result.theme || 'dark';
    
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
    }
  } catch (err) {
    console.error('Error loading theme:', err);
  }
}

// ========== CONSTANTS ==========
const MAX_HISTORY = 50;
const REQUEST_TIMEOUT = 30000;

// ========== VIEW MANAGEMENT ==========
const mainView = document.getElementById('mainView');
const conversationView = document.getElementById('conversationView');
const conversationBtn = document.getElementById('conversationBtn');
const homeBtn = document.getElementById('homeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const backBtn = document.getElementById('backBtn');

let currentView = 'main';

function switchToView(viewName) {
  if (viewName === currentView) return;
  
  // Update nav button states
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
  if (viewName === 'main') {
    mainView.classList.remove('slide-out');
    mainView.classList.add('active');
    conversationView.classList.remove('active');
    homeBtn.classList.add('active');
  } else if (viewName === 'conversation') {
    mainView.classList.add('slide-out');
    mainView.classList.remove('active');
    conversationView.classList.add('active');
    conversationBtn.classList.add('active');
    loadHistory(); // Refresh history when switching to conversation view
  }
  
  currentView = viewName;
}

// Navigation event listeners
conversationBtn.addEventListener('click', () => switchToView('conversation'));
homeBtn.addEventListener('click', () => switchToView('main'));
backBtn.addEventListener('click', () => switchToView('main'));

settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// ========== UTILITY FUNCTIONS ==========
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

function validateInput(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= 5000;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ========== HISTORY MANAGEMENT ==========
async function saveToHistory(question, response) {
  try {
    const result = await chromeStorageGet(['conversations']);
    const conversations = result.conversations || [];
    
    if (!response || typeof response !== 'string') return;
    
    conversations.unshift({
      question: question.trim(),
      response: response.trim(),
      timestamp: Date.now()
    });
    
    conversations.splice(MAX_HISTORY);
    await chromeStorageSet({ conversations });
  } catch (err) {
    console.error('Error saving to history:', err);
  }
}

async function loadHistory() {
  try {
    const result = await chromeStorageGet(['conversations']);
    const conversations = result.conversations || [];
    const historyList = document.getElementById('historyList');
    
    if (conversations.length === 0) {
      historyList.innerHTML = `
        <div class="history-empty">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity="0.3"/>
            </svg>
          </div>
          <p>No conversations yet</p>
          <span class="empty-hint">Start chatting to see history here</span>
        </div>
      `;
      return;
    }

    historyList.innerHTML = '';
    conversations.forEach((conv, index) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      const timeAgo = getTimeAgo(conv.timestamp);
      const questionShort = conv.question.substring(0, 45) + (conv.question.length > 45 ? '...' : '');
      
      item.innerHTML = `
        <div class="history-item-text">
          <div class="history-item-question" title="${escapeHtml(conv.question)}">${escapeHtml(questionShort)}</div>
          <div class="history-item-time">${timeAgo}</div>
        </div>
        <button class="history-item-delete" data-index="${index}" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
          </svg>
        </button>
      `;
      
      // Click to reload conversation
      item.querySelector('.history-item-text').addEventListener('click', () => {
        document.getElementById('input').value = conv.question;
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = escapeHtml(conv.response);
        switchToView('main');
      });
      
      // Delete button
      item.querySelector('.history-item-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteHistoryItem(index);
      });
      
      historyList.appendChild(item);
    });
  } catch (err) {
    console.error('Error loading history:', err);
    document.getElementById('historyList').innerHTML = `
      <div class="history-empty">
        <p>Error loading history</p>
      </div>
    `;
  }
}

async function deleteHistoryItem(index) {
  try {
    const result = await chromeStorageGet(['conversations']);
    const conversations = result.conversations || [];
    conversations.splice(index, 1);
    await chromeStorageSet({ conversations });
    await loadHistory();
  } catch (err) {
    console.error('Error deleting history item:', err);
  }
}

function clearAllHistory() {
  if (confirm('Are you sure you want to delete all conversation history? This cannot be undone.')) {
    chromeStorageSet({ conversations: [] }).then(() => {
      loadHistory();
    }).catch(err => {
      console.error('Error clearing history:', err);
      alert('Failed to clear history. Please try again.');
    });
  }
}

// Clear history button
document.getElementById('clearHistoryBtn').addEventListener('click', clearAllHistory);

// ========== AI MESSAGING ==========
function sendMessageWithTimeout(message, timeout = REQUEST_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms. Ollama may not be running.`));
    }, timeout);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timer);
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

// Ask button click handler
document.getElementById("askBtn").addEventListener("click", async () => {
  const questionInput = document.getElementById("input").value;
  const responseDiv = document.getElementById("response");
  const askBtn = document.getElementById("askBtn");
  const indicator = document.querySelector('.response-indicator');

  if (!validateInput(questionInput)) {
    responseDiv.innerHTML = `<span style="color: #ff6b6b;">Please enter a valid question (1-5000 characters)</span>`;
    responseDiv.classList.add('error');
    return;
  }

  // Disable button and show loading state
  askBtn.disabled = true;
  responseDiv.innerHTML = "";
  responseDiv.classList.remove('error');
  responseDiv.classList.add('loading', 'streaming');
  if (indicator) indicator.style.animation = 'pulse 1s ease-in-out infinite';
  
  console.log("Popup: Sending message with prompt:", questionInput);

  let fullResponse = '';

  // Listen for stream chunks from background
  const messageListener = (request, sender, sendResponse) => {
    if (request.type === 'stream-chunk') {
      fullResponse += request.chunk;
      responseDiv.innerHTML = escapeHtml(fullResponse);
      responseDiv.scrollTop = responseDiv.scrollHeight;
    }
  };
  
  chrome.runtime.onMessage.addListener(messageListener);

  try {
    const response = await sendMessageWithTimeout({
      type: "ask-ai",
      prompt: questionInput.trim(),
      stream: true
    });

    console.log("Popup: Received response:", response);

    if (!response) {
      throw new Error("No response from background worker");
    }

    if (response.ok && response.data) {
      fullResponse = response.data;
      responseDiv.innerHTML = escapeHtml(response.data);
      responseDiv.classList.remove('error', 'loading', 'streaming');
      await saveToHistory(questionInput.trim(), response.data);
      document.getElementById("input").value = '';
    } else {
      throw new Error(response.error || "Unknown error occurred");
    }
  } catch (err) {
    console.error("Popup: Error:", err);
    responseDiv.innerHTML = `<span style="color: #ff6b6b;">❌ ${escapeHtml(err.message)}</span>`;
    responseDiv.classList.add('error');
    responseDiv.classList.remove('loading', 'streaming');
  } finally {
    chrome.runtime.onMessage.removeListener(messageListener);
    askBtn.disabled = false;
    if (indicator) indicator.style.animation = '';
  }
});

// ========== KEYBOARD SHORTCUTS ==========
document.getElementById('input').addEventListener('keydown', (e) => {
  // Submit on Enter (without Shift)
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.getElementById('askBtn').click();
  }
});

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  
  // Set initial view state
  mainView.classList.add('active');
  homeBtn.classList.add('active');
});
