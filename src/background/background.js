chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "ask-ollama") {
    console.log("Background: Received message", msg);
    
    (async () => {
      try {
        console.log("Background: Fetching from Ollama...");
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: msg.model,
            prompt: msg.prompt,
            stream: false
          })
        });

        console.log("Background: Response status", response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log("Background: Success", data.response);
        sendResponse({ ok: true, data: data.response });
      } catch (err) {
        console.error("Background: Error", err);
        sendResponse({ ok: false, error: err.message });
      }
    })();
  }
  return true;
});
