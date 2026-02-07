# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-07

### 🎨 Major UI Redesign
- **Two-View System** - Complete redesign with separate Main AI View and Conversation History View
- **Glassmorphism Design** - Frosted glass panels with backdrop blur effects throughout
- **Bottom Navigation Bar** - Mobile-style persistent navigation with History, Home, and Settings buttons
- **Smooth Slide Transitions** - Views slide horizontally with eased cubic-bezier animations
- **Staggered Fade-in Animations** - Content elements animate in sequentially on view switch

### ✨ New Features
- **Animated Logo Glow** - Subtle pulsing glow effect behind QuickAI logo
- **Focus Glow Effects** - Input fields glow with blue gradient on focus
- **Enhanced Button Design** - Gradient buttons with hover lift effect and shine overlay
- **Redesigned History View** - Full-screen conversation list with improved delete controls
- **Response Section Header** - Status indicator with label above response panel
- **Keyboard Badge Styling** - Shift+Enter hint displayed as styled keyboard shortcuts

### 🔧 Technical Changes
- **Optimized Popup Size** - Changed from 360px to 380×560px for better UX
- **CSS Variables Extended** - Added gradient, glow, and transition variables
- **View Management System** - New JavaScript module for handling view transitions
- **Refactored popup.js** - Cleaner code organization with view state management
- **Custom Scrollbar Styling** - Thin, themed scrollbars matching the design

### 🎯 UI Improvements
- Deeper dark background (#0a0d12) for more contrast
- Blue gradient accents (#4f8cff → #2563eb) on interactive elements
- Rounded corners (14-16px) on all panels and buttons
- Subtle border glow on focused/active states
- History items slide right on hover for feedback
- Conversation timestamps with dot indicator

## [1.2.2] - 2026-01-24

### Added
- **Complete Light Theme Support** - Full theme conversion across all UI components
  - Input fields properly styled in light mode with light gray background
  - Textarea elements convert to light theme with proper contrast
  - Settings button responsive to theme toggle
  - All form inputs (text, password, select) properly themed

### Changed
- Updated CSS specificity for light theme selectors to ensure gradient backgrounds are removed
- Enhanced light theme border colors to use CSS variables for consistency
- Improved hover states for light theme buttons

### Fixed
- ✅ **Bug**: Gemini API key input staying dark when switching to light theme
- ✅ **Bug**: Textarea placeholder staying dark in light mode
- ✅ **Bug**: Settings button showing dark background in light theme
- ✅ **Bug**: Input field gradients not being overridden by light theme CSS
- Enhanced CSS override specificity to ensure light theme takes precedence over dark gradients

### Technical Details
- `popup/style.css`: Updated `.prompt-input` light theme rules
- `settings/settings.html`: Improved input/select light theme CSS selectors
- `popup/style.css`: Added `.settings-btn` light theme and hover states
- All light theme overrides now use `!important` flag with explicit background and border colors
- Improved CSS cascade for better theme switching reliability

## [1.2.1] - 2026-01-08

### Added
- **Ollama Connection Status Indicator** - Real-time connection status in settings page
  - Shows ✅ Connected (green) when Ollama is reachable
  - Shows ❌ Disconnected (red) when unreachable
  - Auto-checks when Ollama is selected
  - Debounced checking while user types endpoint (800ms delay)

- **Ollama Setup Guide** - Enhanced info box in settings page
  - Explains how Ollama works
  - Shows terminal command: `OLLAMA_ORIGINS="*" ollama serve`
  - Link to download Ollama
  - Only appears when Ollama provider is selected

- **GitHub Repository Link** - Quick access to source code
  - Added "View on GitHub" link in About section
  - Points to: https://github.com/702Aman/PrivateAI-ChromeExtensions

### Changed
- Updated README with complete Ollama setup instructions including CORS command
- Improved Ollama prerequisites documentation with required terminal command
- Settings page now provides contextual guidance for Ollama users

## [1.2.0] - 2026-01-07

### Added
- **Privacy Policy** - Chrome Store compliance with comprehensive privacy policy
- **Icon Support** - Added AIQUICK.png icon for extension branding
- **Chrome Store Ready** - Updated permissions and removed unnecessary "tabs" permission

### Changed
- Updated extension description to "Privacy-focused AI assistant browser extension"
- Removed "Personal use only" wording for Chrome Store compliance
- Manifest permissions optimized (storage only, no tabs permission)

## [1.1.0] - 2025-12-14

### Added
- **Conversation History** - Auto-save and manage up to 50 recent Q&A conversations
  - Click history items to reload past conversations
  - Delete individual items with ✕ button
  - Clear all history with confirmation dialog
  - Time-ago formatting (now, 2m ago, 1h ago, etc.)

- **Dark Mode Support** - Automatic detection of system theme preference
  - Uses CSS variables for easy theming
  - Smooth transitions between light and dark modes

- **Enhanced Error Handling**
  - Smart error messages based on HTTP status codes
  - Clear guidance on how to fix common issues
  - Detailed error logging for debugging

- **Request Timeout Support**
  - 30-second timeout for all API requests
  - Clear timeout messages with Ollama status hints
  - Retry logic for transient failures

- **Input Validation**
  - Character length validation (1-5000 characters)
  - XSS prevention with HTML escaping
  - Message format validation

- **Improved UI/UX**
  - Button disabled state during requests
  - Loading animation (pulse effect)
  - Error state styling (red border + background)
  - Delete button changed from "clear" to "✕"

### Improved
- Converted to async/await pattern (better than callbacks)
- Promise-based Chrome Storage API wrapper
- Better console logging for debugging
- Response format validation
- Comprehensive error messages

### Fixed
- XSS vulnerability in history display (via HTML escaping)
- Missing error feedback during requests
- No timeout handling on stuck requests
- Incomplete input validation
- Missing button disabled state feedback

### Technical Details
- `popup.js`: 219 lines (from 145) - Added history, validation, async handling, timeout support
- `background.js`: 95 lines (from 31) - Added timeout, retry logic, input validation, smart error messages
- `style.css`: 224+ lines - Added loading animation, error states, button styling, disabled states
- `manifest.json`: Updated to v1.1.0, added description and default_title
- README.md: Updated with new features and troubleshooting guides
- CHANGELOG.md: New file documenting all changes

### Code Statistics
- Total lines: ~541 (popup.js + background.js + styles)
- New functions: 12 (validation, storage utils, error handling, timeouts)
- New CSS animations: 1 (pulse animation for loading)
- New error messages: 8+ (timeout, connection, model not found, validation, etc.)

## [1.0.0] - 2025-12-13

### Initial Release
- Basic AI query functionality with Ollama integration
- Simple popup UI with text input and response display
- Background service worker for API communication
- Manifest V3 configuration
- Dark mode CSS variables
- Project documentation
