# QuickAI — Right-Click AI Assistant for Chrome

### Use AI without leaving your page. Select text → right-click → done.

> **Stop tab-switching to ChatGPT.** QuickAI brings AI directly into every webpage — summarize articles, rewrite emails, translate text, fix grammar — all from a right-click. Works with Gemini, ChatGPT, or your own local AI. Private by default.

**Version:** 2.1.0 · **Manifest V3** · **Free & Open Source**

## 📸 Screenshots

![QUICKAI-Ui](assets/QuickAI-Recording.gif)

---

## 🔥 Why QuickAI?

| Before (without QuickAI) | After (with QuickAI) |
|---|---|
| Copy text from page | Select text on any page |
| Open new tab → ChatGPT | Right-click → QuickAI |
| Paste text, type prompt | Pick action: Summarize / Rewrite / Translate |
| Wait, copy result | Result appears instantly on the page |
| Switch back to original tab | **You never left.** |

**QuickAI eliminates tab-switching.** AI lives where you work.

---

## ⚡ What You Can Do

### 🖱️ Right-Click AI — The Killer Feature
Select any text on any webpage. Right-click. Pick an action. Done.

| Action | What it does |
|---|---|
| 📄 **Summarize** | Condense selected text into key points |
| 💡 **Explain** | Break down complex text into simple terms |
| ✏️ **Rewrite** | Make text clearer and more professional |
| 🌐 **Translate** | Translate to your preferred language |
| 🔧 **Fix Grammar** | Fix spelling, grammar, and punctuation |

Results appear in a **floating panel** right on the page — draggable, copyable, and beautiful.

### 📄 Summarize Any Page — One Click
Reading a long article? Click the extension → hit **Summarize Page** → get the key points in seconds. QuickAI extracts the page content automatically (filtering out ads, navigation, scripts) and sends it to your AI provider.

### ✏️ Rewrite & Translate — Without Switching Tabs
Select text on any page → click **Rewrite** or **Translate** in the popup. Your AI rewrites or translates instantly. Set your preferred translation language in Settings.

### 💬 Ask Anything — AI Popup
Open the QuickAI popup and ask any question. Responses stream word-by-word. Conversation history auto-saves so you can revisit past answers.

### 🔒 Privacy-First — Your Data, Your Choice
- **Use Local AI (Ollama)** — Everything stays on your machine. Zero data sent anywhere.
- **Use Cloud AI (Gemini / OpenAI)** — API keys stored locally, never logged, never shared.
- **No tracking. No telemetry. No accounts required.**

---

## 🎯 Real Use Cases

| Scenario | How QuickAI Helps |
|---|---|
| Long article or report | **Summarize page** in one click |
| Writing an email | Select draft → **Rewrite** to make it professional |
| Reading foreign language content | Select text → **Translate** without switching tabs |
| Reviewing code comments | **Explain** complex text in simple terms |
| Polishing a document | **Fix Grammar** on selected paragraphs |
| Quick knowledge lookup | Open popup → **Ask AI** anything |
| Research workflow | Save & revisit past questions in **Conversation History** |

---

## ✨ Features at a Glance

### AI & Workflow
- **5 Right-Click AI Actions** — Summarize, Explain, Rewrite, Translate, Fix Grammar
- **Floating Result Panel** — Draggable, resizable, copyable results on any page
- **Quick Action Chips** — Summarize Page, Rewrite Selection, Translate Selection
- **Smart Page Extraction** — Auto-extracts text, filters ads/scripts/nav (up to 8000 chars)
- **Streaming Responses** — Word-by-word display for fast feedback
- **Conversation History** — Auto-saves 50 recent Q&A with timestamps
- **Configurable Translation** — Set your preferred target language

### AI Providers
- **Google Gemini** (Free) — Uses latest `gemini-2.0-flash` model
- **OpenAI ChatGPT** (Paid) — GPT-3.5 Turbo
- **Local Ollama** (Free & 100% Private) — Run any model on your machine

### Design
- **Glassmorphism UI** — Frosted glass panels, animated glow effects
- **Dark & Light Themes** — Switch in settings, persists across sessions
- **Bottom Navigation** — Mobile-style nav bar with History, Home, Settings
- **Smooth Animations** — Slide transitions, staggered fade-ins, hover effects
- **Compact Popup** — 380×560px, optimized for quick access

### Under the Hood
- **Manifest V3** — Latest Chrome extension standard
- **Auto Content Script Injection** — Seamlessly injects when needed
- **Robust Error Handling** — Actionable error messages for every scenario
- **Keyboard Shortcuts** — Enter to send, Shift+Enter for new line
- **Zero External Dependencies** — Works offline with Ollama
- **Ollama Connection Status** — Real-time connection indicator in settings

---

## 🛠 Getting Started

### 1. Install the Extension

1. Clone or download this repository
2. Go to `chrome://extensions/` in your browser
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** → select this folder
5. QuickAI icon appears in your toolbar — you're ready!

### 2. Choose Your AI Provider

Click the QuickAI icon → **Settings** → pick one:

| Provider | Cost | Privacy | Setup |
|---|---|---|---|
| **Google Gemini** | Free tier | Cloud | Paste API key from [Google AI Studio](https://aistudio.google.com/app/api-keys) |
| **OpenAI ChatGPT** | Pay-as-you-go | Cloud | Paste API key from [OpenAI](https://platform.openai.com/api-keys) |
| **Local Ollama** | Free | 100% Local | Install [Ollama](https://ollama.ai), run `OLLAMA_ORIGINS="*" ollama serve` |

### 3. Start Using AI

**Right-Click AI (fastest way):**
1. Select any text on a webpage
2. Right-click → **🤖 QuickAI** → pick an action
3. Result appears on the page. Done.

**Quick Actions (from popup):**
1. Click the QuickAI icon in your toolbar
2. Hit **Summarize Page**, **Rewrite**, or **Translate**
3. AI processes the page content or your selection instantly

**Ask Anything (from popup):**
1. Click the QuickAI icon → type a question → press Enter
2. Response streams word-by-word in real time

---

## 🔧 Ollama Setup (For Local/Private AI)

```bash
# 1. Install Ollama from https://ollama.ai

# 2. Pull a model
ollama pull llama3:latest

# 3. Start with CORS enabled (required for browser extensions)
OLLAMA_ORIGINS="*" ollama serve
```

Then in QuickAI Settings: set provider to **Ollama**, endpoint `http://localhost:11434`, model `llama3:latest`.

**List available models:** `ollama list`

---

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

---

## 🧑‍💻 Who Is QuickAI For?

| Audience | Why they love QuickAI |
|---|---|
| **Developers** | Explain code, fix errors, rewrite docs — right-click on any page |
| **Writers & Marketers** | Rewrite copy, fix grammar, translate — without leaving the page |
| **Researchers** | Summarize long articles & papers in one click |
| **Students** | Explain complex topics, translate foreign sources |
| **Privacy-conscious users** | Run AI 100% locally with Ollama — zero data leaves your machine |
| **AI power users** | Bring your own Gemini/OpenAI/Ollama key, use any model |

---

## 📁 Project Structure

```
private-ai-chromeextension/
├── src/
│   ├── popup/               # Extension popup UI
│   │   ├── popup.html       # Two-view interface (Main + History)
│   │   ├── popup.js         # Quick actions, streaming, history
│   │   └── style.css        # Glassmorphism styling & animations
│   ├── content/             # Injected into webpages
│   │   └── content.js       # Page extraction, selection, floating panel
│   ├── settings/            # Full-page settings
│   │   ├── settings.html    # Provider config, translation language
│   │   └── settings.js      # Settings logic & Ollama status check
│   └── background/          # Service worker
│       └── background.js    # Context menus, API calls, streaming
├── manifest.json            # Manifest V3 config
├── privacy.html             # Privacy policy
├── CHANGELOG.md             # Version history
└── LICENSE                  # MIT License
```

## 📝 Development

```bash
# Debug background worker
chrome://extensions/ → Click extension → "service worker"

# Debug popup
Click popup → press F12

# After editing source files
chrome://extensions/ → Click refresh icon on QuickAI
```

## ⚠️ Good to Know

- Requires at least one AI provider configured (Gemini is free)
- Context menu actions require text to be selected first
- Doesn't work on `chrome://` internal pages (browser restriction)
- API keys stored locally, never transmitted beyond the provider API
- History & settings are per-browser-profile, not synced across devices
- 30s request timeout · 5000 char input limit · 8000 char page extraction limit

## 🔒 Privacy & Security

**Your data stays yours.** QuickAI has no backend servers, no accounts, no tracking.

- **Local Ollama** → Everything on your machine. Zero external requests. Fully offline.
- **Gemini / OpenAI** → API keys stored locally. HTTPS only. Keys never logged or shared.
- **No telemetry.** No analytics. No data collection. Period.

## 📄 License

MIT License — free to use, modify, and distribute.

## 🤝 Contributing

Suggestions, bug reports, and PRs welcome! Open a [GitHub Issue](https://github.com/702Aman/PrivateAI-ChromeExtensions/issues).

## 📚 Version History

See [CHANGELOG.md](CHANGELOG.md) for full details.

| Version | Highlights |
|---|---|
| **v2.1.0** | Right-click context menu, floating panel, quick actions, page summarization, Gemini 2.0 Flash |
| **v2.0.0** | Complete UI redesign, glassmorphism, two-view system, bottom nav, animations |
| **v1.2.0** | Multi-provider support (Gemini + OpenAI + Ollama), light theme, streaming |
| **v1.1.0** | Conversation history, dark mode, error handling, input validation |
| **v1.0.0** | Initial release — basic Ollama AI popup |

---

<div align="center">

**QuickAI** — AI without breaking your flow.

[Report Bug](https://github.com/702Aman/PrivateAI-ChromeExtensions/issues) · [Request Feature](https://github.com/702Aman/PrivateAI-ChromeExtensions/issues) · [View on GitHub](https://github.com/702Aman/PrivateAI-ChromeExtensions)

</div>
