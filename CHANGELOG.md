# Changelog

All notable changes to this project will be documented in this file.

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
