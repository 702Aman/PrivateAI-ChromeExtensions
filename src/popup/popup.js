document.getElementById("askBtn").addEventListener("click", async () => {
  var question = document.getElementById("input").value;
  var responseDiv = document.getElementById("response");

  if (!question.trim()) {
    responseDiv.innerHTML = "Please enter a question!";
    return;
  }

  responseDiv.innerHTML = "Thinking...";
  console.log("Popup: Sending message with prompt:", question);

  chrome.runtime.sendMessage(
    {
      type: "ask-ollama",
      model: "llama3:latest",  
      prompt: question,
      stream: false
    },
    (response) => {
      console.log("Popup: Received response:", response);
      
      if (!response) {
        responseDiv.innerHTML = "No response from background.js - Check console logs (F12)";
        return;
      }

      if (response.ok) {
        responseDiv.innerHTML = response.data;
      } else {
        responseDiv.innerHTML = "Error: " + response.error;
        console.error("Popup: Error response:", response.error);
      }
    }
  );
});
