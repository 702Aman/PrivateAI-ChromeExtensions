# Private AI Assistant

A Chrome browser extension that brings AI assistance directly to your browser using locally-running AI models. Get fast, private responses without sending data to external services.

## 🎯 Purpose

This is a **personal browser extension application** that provides quick access to local AI models via a simple popup interface. It integrates AI capabilities directly into Chrome for seamless assistance.

**Type:** Private (for personal/local use)

## ✨ Features

- **Local AI Processing** - All queries are processed locally on your machine
- **Private & Secure** - No data sent to external services
- **Fast Responses** - Direct communication with localhost AI server
- **Simple UI** - Clean, minimal popup interface
- **Zero External Dependencies** - Works offline after model installation

## 🛠 Prerequisites

Before using this extension, ensure you have:

1. **Chrome/Chromium Browser** (v90+)
2. **Ollama** installed and running locally
   - Download: https://ollama.ai
   - Default endpoint: `http://localhost:11434`

3. **At least one Ollama model** pulled (e.g., `llama3:latest`)
   ```bash
   ollama pull llama3:latest
   ```

## 📦 Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select this folder (`private-ai-chromeextension`)
6. The extension icon will appear in your Chrome toolbar

## 🚀 Usage

1. **Start Ollama** on your machine
   ```bash
   ollama serve
   ```

2. **Click the extension icon** in your Chrome toolbar

3. **Type your question** in the text area

4. **Click "Ask AI"** to get a response

5. **Wait for the response** to appear below

## 📁 Project Structure

```
private-ai-chromeextension/
├── src/
│   ├── popup/               # Popup UI files
│   │   ├── popup.html       # UI structure
│   │   ├── popup.js         # Event handlers & communication
│   │   └── style.css        # Styling
│   │
│   └── background/          # Background service worker
│       └── background.js    # AI API communication
│
├── manifest.json            # Chrome extension manifest (MV3)
├── README.md               # Documentation (this file)
├── .gitignore              # Git ignore patterns
└── LICENSE                 # License information
```

## 🔧 Configuration

### Changing the AI Model

Edit `src/popup/popup.js` and change the model name:

```javascript
model: "llama3:latest"  // Change this to your preferred model
```

Available models can be listed with:
```bash
ollama list
```

### Changing Ollama Server Address

Edit `src/background/background.js` and update the fetch URL:

```javascript
const response = await fetch("http://localhost:11434/api/generate", {
```

## 🐛 Troubleshooting

### "No response from background.js"
- Ensure Ollama is running: `ollama serve`
- Check that the model exists: `ollama list`
- Open DevTools (F12) and check the console for errors

### Connection refused error
- Verify Ollama is accessible at `http://localhost:11434`
- Check firewall settings
- Ensure no other service is blocking port 11434

### Slow responses
- Ollama response time depends on model size and hardware
- Using smaller models (e.g., `neural-chat`) speeds up responses
- Larger models provide better quality but take longer

## 📝 Development

### Debugging

1. Open the extension details page: `chrome://extensions/`
2. Click on your extension
3. Click **"service worker"** to see background logs
4. Click the extension popup and press **F12** for popup logs

### Making Changes

1. Edit files in `src/popup/` or `src/background/`
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test the changes

### Common Development Tasks

- **Change popup styling**: Edit `src/popup/style.css`
- **Update UI elements**: Edit `src/popup/popup.html`
- **Modify behavior**: Edit `src/popup/popup.js` or `src/background/background.js`

## 📋 Manifest Overview

This extension uses **Manifest V3** (MV3), the latest Chrome extension standard:

- **Permissions**: `storage` - for data persistence
- **Host Permissions**: `http://localhost:11434/*` - to access local Ollama
- **Background Worker**: Service worker for API calls
- **UI**: Single popup window

## ⚠️ Limitations & Notes

- Requires an AI server (Ollama) running locally
- Limited to localhost communication (not remote servers)
- Response time depends on model size and system specs
- Does not support streaming responses (complete responses only)

## 🔒 Privacy

All communication happens locally between your browser and the AI server running on your machine. No data leaves your computer.

## 📄 License

This project is released under the **Unlicense** – it is in the public domain. You are free to use, modify, and distribute this software without any restrictions or obligations.

For more information, see [unlicense.org](https://unlicense.org)

## 🤝 Contributing

This is a personal project. For suggestions or issues, feel free to use GitHub Issues.

## 🎓 Learning Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Ollama Documentation](https://github.com/ollama/ollama)
