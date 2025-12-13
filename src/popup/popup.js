// Constants
const MAX_HISTORY = 50;
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Utility: Promise-based Chrome Storage
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

// Validate input
function validateInput(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= 5000;
}

// Save conversation to history
async function saveToHistory(question, response) {
  try {
    const result = await chromeStorageGet(['conversations']);
    const conversations = result.conversations || [];
    
    // Validate data before saving
    if (!response || typeof response !== 'string') return;
    
    conversations.unshift({
      question: question.trim(),
      response: response.trim(),
      timestamp: Date.now()
    });
    
    // Keep only last MAX_HISTORY items
    conversations.splice(MAX_HISTORY);
    await chromeStorageSet({ conversations });
    await loadHistory();
  } catch (err) {
    console.error('Error saving to history:', err);
  }
}

// Load and display history
async function loadHistory() {
  try {
    const result = await chromeStorageGet(['conversations']);
    const conversations = result.conversations || [];
    const historyList = document.getElementById('historyList');
    
    if (conversations.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No conversation history yet</div>';
      return;
    }

    historyList.innerHTML = '';
    conversations.forEach((conv, index) => {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      const timeAgo = getTimeAgo(conv.timestamp);
      const questionShort = conv.question.substring(0, 40) + (conv.question.length > 40 ? '...' : '');
      
      item.innerHTML = `
        <div class="history-item-text">
          <div class="history-item-question" title="${escapeHtml(conv.question)}">Q: ${escapeHtml(questionShort)}</div>
          <div class="history-item-time">${timeAgo}</div>
        </div>
        <button class="history-item-delete" data-index="${index}" title="Delete this conversation">✕</button>
      `;
      
      // Click to reload
      item.querySelector('.history-item-text').addEventListener('click', () => {
        document.getElementById('input').value = conv.question;
        document.getElementById('response').innerHTML = escapeHtml(conv.response);
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
    document.getElementById('historyList').innerHTML = '<div class="history-empty">Error loading history</div>';
  }
}

// Delete history item
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

// Clear all history with confirmation
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

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format time difference
function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Send message to background with timeout
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

  // Validate input
  if (!validateInput(questionInput)) {
    responseDiv.innerHTML = "Please enter a valid question (1-5000 characters)";
    responseDiv.classList.add('error');
    return;
  }

  // Disable button and show loading state
  askBtn.disabled = true;
  responseDiv.innerHTML = "Thinking...";
  responseDiv.classList.remove('error');
  responseDiv.classList.add('loading');
  console.log("Popup: Sending message with prompt:", questionInput);

  try {
    const response = await sendMessageWithTimeout({
      type: "ask-ollama",
      model: "llama3:latest",
      prompt: questionInput.trim(),
      stream: false
    });

    console.log("Popup: Received response:", response);

    if (!response) {
      throw new Error("No response from background worker");
    }

    if (response.ok && response.data) {
      responseDiv.innerHTML = escapeHtml(response.data);
      responseDiv.classList.remove('error', 'loading');
      await saveToHistory(questionInput.trim(), response.data);
      document.getElementById("input").value = '';
    } else {
      throw new Error(response.error || "Unknown error occurred");
    }
  } catch (err) {
    console.error("Popup: Error:", err);
    responseDiv.innerHTML = `❌ ${escapeHtml(err.message)}`;
    responseDiv.classList.add('error');
    responseDiv.classList.remove('loading');
  } finally {
    askBtn.disabled = false;
  }
});

// Clear history button
document.getElementById('clearHistoryBtn').addEventListener('click', clearAllHistory);

// Load history on popup open
loadHistory();
