# QuickAI - Private AI Assistant

A modern, beautifully designed Chrome extension that brings AI assistance directly to your browser. Features a sleek glassmorphism UI with smooth animations and multi-provider support.

## 🎯 Purpose

QuickAI provides quick access to AI models via an elegant popup interface with a mobile-like two-view design. It integrates AI capabilities directly into Chrome for seamless assistance.

**Type:** Privacy-focused AI assistant browser extension  
**Version:** 2.0.0

## 📸 Screenshots

![QUICKAI-Ui](assets/QuickAI-Recording.gif)

## ✨ Features

### 🎨 New Modern UI (v2.0)
- **Two-View System** - Main AI view + Conversation History view with smooth slide transitions
- **Glassmorphism Design** - Frosted glass panels with backdrop blur effects
- **Animated Glow Effects** - Subtle pulsing glow behind logo and on focus states
- **Bottom Navigation Bar** - Mobile-style navigation with History, Home, and Settings buttons
- **Premium Animations** - Staggered fade-in effects, hover transforms, and smooth transitions
- **Dark Futuristic Theme** - Deep dark background with blue gradient accents
- **Optimized Popup Size** - 380×560px for a mobile-like panel experience

### 🤖 AI Features
- **Multiple AI Providers** - Support for Google Gemini, OpenAI ChatGPT, and Local Ollama
- **Dark & Light Theme UI** - Professional gradient design with full light theme support
- **Local AI Processing** - All queries are processed locally on your machine (with Ollama)
- **Private & Secure** - No data sent to external services (when using Ollama)
- **Conversation History** - Auto-saves up to 50 recent Q&A conversations with timestamps
- **Persistent Storage** - History saved across browser sessions
- **Streaming Responses** - Word-by-word streaming display for better UX
- **Input Validation** - Prevents invalid or oversized requests (1-5000 characters)
- **Request Timeout** - 30-second timeout with helpful feedback

### ⚙️ Technical Features
- **Robust Error Handling** - Clear, actionable error messages for all scenarios
- **Smart Settings** - Provider-specific configuration with validation
- **Zero External Dependencies** - Works offline with local Ollama
- **Ollama Connection Status** - Real-time indicator showing if Ollama is running
- **Theme Persistence** - Your theme preference saved across sessions
- **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line

## 🛠 Prerequisites

Before using this extension, you need **at least one** of the following:

### Option 1: Google Gemini (Free & Easy)
1. **Chromium-based Browser** (v90+) - Chrome, Edge, Brave, Opera, or Vivaldi
2. **Google Account** - Free Gemini API key
   - Get key: https://aistudio.google.com/app/api-keys
   - No billing required for free tier

### Option 2: OpenAI ChatGPT (Paid)
1. **Chromium-based Browser** (v90+) - Chrome, Edge, Brave, Opera, or Vivaldi
2. **OpenAI API Key**
   - Requires billing setup in OpenAI console
   - Pay-as-you-go pricing

### Option 3: Local Ollama (Free & Private)
1. **Chromium-based Browser** (v90+) - Chrome, Edge, Brave, Opera, or Vivaldi
2. **Ollama** installed and running locally
   - Download: https://ollama.ai
   - Default endpoint: `http://localhost:11434`
3. **At least one Ollama model** pulled (e.g., `llama3:latest`)
   ```bash
   ollama pull llama3:latest
   ```
4. **Run Ollama with CORS enabled** (required for browser access):
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```

## 📦 Installation

1. Clone or download this repository
2. Open your browser and go to `chrome://extensions/` (or equivalent in your browser)
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select this folder (`private-ai-chromeextension`)
6. The extension icon will appear in your browser toolbar

## 🚀 Usage

### Initial Setup

1. **Configure Your AI Provider**
   - Click the extension icon → ⚙️ Settings
   - Choose your provider (Gemini, OpenAI, or Ollama)
   - For Gemini/OpenAI: Enter your API key
   - For Ollama: Enter endpoint and model name
   - Click **Save Settings**

2. **Start Your AI Service** (if using Ollama)
   ```bash
   OLLAMA_ORIGINS="*" ollama serve
   ```
   This enables CORS so the browser extension can communicate with Ollama.

### Asking Questions

1. **Click the QuickAI extension icon** in your browser toolbar
2. **Type your question** in the text area (1-5000 characters)
3. **Press Enter or Click "Ask AI"** button
4. **Wait for the response** to appear in the response panel

### Tips
- Use clear, specific questions for better responses
- Try: "Summarize this page", "Explain quantum computing", etc.
- Shift + Enter to add a new line in the textarea

### Using Conversation History

- **Access History** - Click the "History" button in the bottom navigation bar
- **Smooth Transition** - Panel slides in from the right with animation
- **Reload Conversation** - Click any history item to reload that question and return to main view
- **Timestamps** - See when each conversation was (e.g., "Just now", "5m ago", "2h ago")
- **Delete Item** - Click the trash icon to remove a specific conversation
- **Clear All** - Click the "Clear All" button in the header to delete entire history (with confirmation)
- **Back Button** - Return to main AI view with reverse slide animation
- **Auto-Save** - Every successful response is automatically saved (max 50 conversations)
- **Persistent** - History is saved across browser sessions

### UI Theme & Design

- **Glassmorphism Panels** - Frosted glass effect with backdrop blur
- **Modern Dark Theme** - Deep dark background (#0a0d12) with blue gradient accents
- **Animated Logo Glow** - Subtle pulsing glow effect behind QuickAI logo
- **Gradient Buttons** - Beautiful blue gradient (#4f8cff → #2563eb) with hover lift effect
- **Focus Glow Effects** - Input fields glow on focus
- **Bottom Navigation** - Persistent nav bar with active state indicators
- **Staggered Animations** - Content fades in sequentially on view switch
- **Responsive** - Optimized for popup (380×560px) and full settings page

## 📁 Project Structure

```
private-ai-chromeextension/
├── src/
│   ├── popup/               # Popup UI and logic
│   │   ├── popup.html       # Two-view interface (Main + Conversations)
│   │   ├── popup.js         # View management, transitions & AI communication
│   │   └── style.css        # Glassmorphism styling with animations
│   │
│   ├── settings/            # Settings/Configuration page
│   │   ├── settings.html    # Settings interface
│   │   └── settings.js      # Settings management & validation
│   │
│   └── background/          # Background service worker
│       └── background.js    # Multi-provider AI API communication
│
├── manifest.json            # Chrome extension manifest (MV3)
├── README.md               # Documentation (this file)
├── privacy.html            # Privacy policy page
├── .gitignore              # Git ignore patterns
├── LICENSE                 # License information
└── CHANGELOG.md            # Version history
```

## 🔧 Configuration

### Via Settings Page (Recommended)

1. Click the extension icon → ⚙️ Settings
2. Select your AI provider:
   - **Google Gemini**: Paste your API key from https://aistudio.google.com/app/api-keys
   - **OpenAI**: Paste your API key from https://platform.openai.com/api-keys
   - **Local Ollama**: Enter endpoint and model name
3. Click **Save Settings**

### Ollama Configuration

**List available models:**
```bash
ollama list
```

**Pull a new model:**
```bash
ollama pull llama3:latest
```

**Change default endpoint** (if Ollama runs on different port):
- In Settings page, change "Ollama Endpoint" to your server address
- Default: `http://localhost:11434`

## 🐛 Troubleshooting

### Gemini API Issues

**"Invalid/Unauthorized API key"**
- Get a FREE key: https://aistudio.google.com/app/api-keys
- Ensure you're using the correct API key from Google AI Studio
- Key should start with "AIza..."

**"Access denied (403)"**
- Enable Generative Language API in Google Cloud Console
- Check that billing is set up (even for free tier)

### OpenAI Issues

**"Invalid API key"**
- Get your key: https://platform.openai.com/api-keys
- Ensure you've set up billing in your OpenAI account
- Copy the full API key without extra spaces

**"Quota exceeded (429)"**
- You've exceeded your usage limit
- Check your billing and usage in OpenAI dashboard

### Ollama Issues

**"Cannot connect to Ollama. Is it running?"**
- Start Ollama: `ollama serve`
- Verify: Visit `http://localhost:11434` in your browser
- Check firewall settings
- Ensure no other service is blocking port 11434

**"Model not found. Did you pull it?"**
- List available models: `ollama list`
- Pull the model: `ollama pull llama3:latest`
- Update model name in Settings

**"Request timeout (30 seconds)"**
- Large models take time to respond
- Try smaller models (e.g., `neural-chat`)
- Ensure Ollama isn't busy with other tasks

### General Issues

**"Please enter a valid question (1-5000 characters)"**
- Ensure your input is not empty
- Maximum question length is 5000 characters
- Try a shorter, clearer question

**History not saving**
- Ensure Chrome extension has storage permission
- Check available disk space
- Go to chrome://extensions → Details → Permissions

**Slow responses**
- Response time depends on model size and hardware
- Smaller models respond faster but with less quality
- Larger models provide better responses but take longer
- For Ollama: Try enabling GPU acceleration

**Error clearing history**
- Try refreshing the extension (chrome://extensions → Refresh)
- Close and reopen the popup
- Check DevTools (F12) for specific error messages

**Settings not saving**
- Ensure you clicked **Save Settings** button
- Check the green ✅ success message
- Verify API key format for your provider

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

This extension uses **Manifest V3** (MV3), the latest web extension standard supported by all Chromium browsers:

- **Permissions**: `storage` - for data persistence
- **Host Permissions**: `http://localhost:11434/*` - to access local AI server
- **Background Worker**: Service worker for API calls
- **UI**: Single popup window

## ⚠️ Limitations & Notes

- **Provider Required** - You must configure at least one AI provider (Gemini, OpenAI, or Ollama)
- **No Streaming** - Responses are complete, not streamed character-by-character
- **30-Second Timeout** - Requests exceeding 30 seconds will timeout
- **5000 Character Limit** - Input questions limited to 5000 characters
- **50 History Limit** - Conversation history stores maximum 50 items
- **Response Latency** - Depends on model size and system hardware
- **Single Provider** - One provider configured at a time (can switch in settings)
- **Local Ollama Only** - Ollama connection limited to localhost (for security)
- **API Key Security** - Keys stored locally in browser, never logged or transmitted
- **No Cross-Device Sync** - History and settings per Chrome profile only

## 🔒 Privacy & Security

**With Local Ollama:**
- All communication happens locally between your browser and AI server
- No data leaves your computer
- No requests to external services
- Fully private and offline-capable

**With Gemini/OpenAI:**
- API keys stored locally in Chrome extension storage
- Keys never logged or exposed in console
- Communication encrypted (HTTPS only)
- Your queries sent to provider's API servers
- Review provider's privacy policies for data handling

**General:**
- Conversation history stored locally in browser storage
- No tracking or telemetry
- All data stays on your device

## 📄 License

This project is licensed under the **MIT License**.

## 🤝 Contributing

This is a personal project. For suggestions, improvements, or bug reports, feel free to open GitHub Issues.

## 📚 Version History

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

### Latest Updates (v2.0.0) - Major UI Redesign
- 🎨 **Complete UI Redesign** - Modern glassmorphism design with premium feel
- 📱 **Two-View System** - Separate Main AI and Conversation History views
- ✨ **Smooth Transitions** - Slide animations between views
- 🧭 **Bottom Navigation Bar** - Mobile-style persistent navigation
- 💫 **Animated Effects** - Logo glow, focus states, staggered fade-ins
- 🖼️ **Glassmorphism Panels** - Frosted glass effect with backdrop blur
- 📐 **Optimized Size** - 380×560px popup for better UX
- 🎯 **Enhanced History View** - Full-screen conversation list with better controls
- ⌨️ **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line

### Previous Updates (v1.2.0)
- ✨ Modern dark theme UI with gradient design
- 🌞 Complete Light Theme Support
- 🔄 Support for multiple AI providers (Gemini, OpenAI, Ollama)
- ⚙️ Provider-specific configuration with validation
- 🚀 Streaming response display
- 🔐 Enhanced security with proper input sanitization

## 🎓 Learning Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Google Gemini API](https://ai.google.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Ollama Documentation](https://github.com/ollama/ollama)


