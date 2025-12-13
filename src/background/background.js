// Constants
const OLLAMA_ENDPOINT = "http://localhost:11434/api/generate";
const REQUEST_TIMEOUT = 30000; // 30 seconds
const RETRY_ATTEMPTS = 1;

// Validate message format
function validateMessage(msg) {
  if (!msg.type || msg.type !== "ask-ollama") return false;
  if (!msg.model || typeof msg.model !== 'string') return false;
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

// Get error message based on status
function getErrorMessage(err, status) {
  if (err.message === 'Request timeout') {
    return 'Ollama request timed out. Is Ollama running? (http://localhost:11434)';
  }
  if (status === 404) {
    return 'Model not found. Did you pull it? Try: ollama pull llama3:latest';
  }
  if (status === 500) {
    return 'Ollama server error. Check Ollama logs.';
  }
  if (status === 503) {
    return 'Ollama server unavailable. Is it running?';
  }
  if (err.message.includes('Failed to fetch')) {
    return 'Cannot connect to Ollama. Make sure it\'s running on http://localhost:11434';
  }
  return err.message || 'Unknown error';
}

// Query Ollama API with retry logic
async function queryOllama(model, prompt) {
  let lastError;
  let lastStatus;

  for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`Background: Attempt ${attempt + 1}/${RETRY_ATTEMPTS + 1}`);
      console.log("Background: Fetching from Ollama...", { model, promptLength: prompt.length });

      const response = await fetchWithTimeout(
        OLLAMA_ENDPOINT,
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

      lastStatus = response.status;
      console.log("Background: Response status", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response
      if (!data || typeof data.response !== 'string') {
        throw new Error('Invalid response format from Ollama');
      }

      console.log("Background: Success", { responseLength: data.response.length });
      return { ok: true, data: data.response };

    } catch (err) {
      lastError = err;
      console.error(`Background: Error on attempt ${attempt + 1}:`, err.message);

      // Don't retry on timeout or 404
      if (err.message === 'Request timeout' || lastStatus === 404) {
        break;
      }

      // Wait before retry
      if (attempt < RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  const errorMessage = getErrorMessage(lastError, lastStatus);
  console.error("Background: Final error:", errorMessage);
  return { ok: false, error: errorMessage };
}

// Message listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!validateMessage(msg)) {
    sendResponse({ ok: false, error: 'Invalid message format' });
    return false;
  }

  // Call async function
  queryOllama(msg.model, msg.prompt).then(result => {
    sendResponse(result);
  }).catch(err => {
    console.error("Background: Unhandled error:", err);
    sendResponse({ ok: false, error: 'Unexpected error: ' + err.message });
  });

  // Indicate async response
  return true;
});
