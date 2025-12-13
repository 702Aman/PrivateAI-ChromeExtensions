# Changelog

All notable changes to this project will be documented in this file.

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
- XSS vulnerability in history display
- Missing error feedback during requests
- No timeout handling on stuck requests
- Incomplete input validation
- Inconsistent delete button text

### Technical Details
- `popup.js`: 205 lines (from 145) - Added history, validation, async handling
- `background.js`: 90 lines (from 31) - Added timeout, retry, validation
- `style.css`: Added loading animation, error states, button styling
- README.md: Updated with new features and troubleshooting guides

## [1.0.0] - 2025-12-13

### Initial Release
- Basic AI query functionality with Ollama integration
- Simple popup UI with text input and response display
- Background service worker for API communication
- Manifest V3 configuration
- Dark mode CSS variables
- Project documentation
