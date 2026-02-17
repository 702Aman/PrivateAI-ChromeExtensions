// ========== QuickAI Content Script ==========
// Handles page text extraction, selection reading, and floating result panel

(function () {
  'use strict';

  // Prevent double-injection
  if (window.__quickai_content_loaded) return;
  window.__quickai_content_loaded = true;

  // ========== PAGE TEXT EXTRACTION ==========
  function getPageText() {
    // Clone body to avoid modifying the DOM
    const clone = document.body.cloneNode(true);

    // Remove scripts, styles, nav, footer, ads, hidden elements
    const removeSelectors = 'script, style, noscript, iframe, svg, img, video, audio, canvas, ' +
      'nav, footer, header, aside, [role="navigation"], [role="banner"], [role="complementary"], ' +
      '[aria-hidden="true"], .ad, .ads, .advertisement, [data-ad], #cookie-banner, .cookie-notice';

    clone.querySelectorAll(removeSelectors).forEach(el => el.remove());

    // Get visible text content
    let text = clone.innerText || clone.textContent || '';

    // Clean up whitespace
    text = text
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Limit to ~8000 chars to stay within API limits
    const MAX_CHARS = 8000;
    if (text.length > MAX_CHARS) {
      text = text.substring(0, MAX_CHARS) + '\n\n[...content truncated]';
    }

    return text;
  }

  // ========== SELECTED TEXT ==========
  function getSelectedText() {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : '';
  }

  // ========== FLOATING RESULT PANEL ==========
  let floatingPanel = null;

  function createFloatingPanel() {
    if (floatingPanel) {
      floatingPanel.remove();
    }

    const panel = document.createElement('div');
    panel.id = 'quickai-floating-panel';
    panel.innerHTML = `
      <div id="quickai-panel-header">
        <span id="quickai-panel-title">⚡ QuickAI</span>
        <div id="quickai-panel-actions">
          <button id="quickai-copy-btn" title="Copy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
          <button id="quickai-close-btn" title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="quickai-panel-body">
        <div id="quickai-panel-loading">
          <div class="quickai-spinner"></div>
          <span>Thinking...</span>
        </div>
        <div id="quickai-panel-content" style="display:none;"></div>
      </div>
    `;

    // Inject styles
    if (!document.getElementById('quickai-panel-styles')) {
      const style = document.createElement('style');
      style.id = 'quickai-panel-styles';
      style.textContent = `
        #quickai-floating-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          max-height: 400px;
          background: #13161d;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(59, 130, 246, 0.15);
          z-index: 2147483647;
          font-family: Inter, system-ui, -apple-system, sans-serif;
          color: #e6e8ee;
          overflow: hidden;
          animation: quickai-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          resize: both;
        }

        @keyframes quickai-slide-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes quickai-slide-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.95); }
        }

        #quickai-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(30, 35, 50, 0.8);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          cursor: move;
          user-select: none;
        }

        #quickai-panel-title {
          font-size: 13px;
          font-weight: 600;
          background: linear-gradient(135deg, #4f8cff, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #quickai-panel-actions {
          display: flex;
          gap: 4px;
        }

        #quickai-panel-actions button {
          background: rgba(255,255,255,0.06);
          border: none;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: #9aa1b2;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        #quickai-panel-actions button:hover {
          background: rgba(255,255,255,0.12);
          color: #e6e8ee;
        }

        #quickai-panel-body {
          padding: 16px;
          max-height: 320px;
          overflow-y: auto;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        #quickai-panel-body::-webkit-scrollbar { width: 4px; }
        #quickai-panel-body::-webkit-scrollbar-track { background: transparent; }
        #quickai-panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        #quickai-panel-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #7a8299;
          font-size: 13px;
        }

        .quickai-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: quickai-spin 0.7s linear infinite;
        }

        @keyframes quickai-spin {
          to { transform: rotate(360deg); }
        }

        #quickai-panel-content {
          color: #e6e8ee;
        }

        #quickai-panel-content .quickai-error {
          color: #ff6b6b;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(panel);
    floatingPanel = panel;

    // Close button
    panel.querySelector('#quickai-close-btn').addEventListener('click', () => {
      closeFloatingPanel();
    });

    // Copy button
    panel.querySelector('#quickai-copy-btn').addEventListener('click', () => {
      const content = panel.querySelector('#quickai-panel-content');
      if (content && content.textContent) {
        navigator.clipboard.writeText(content.textContent).then(() => {
          const btn = panel.querySelector('#quickai-copy-btn');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
          setTimeout(() => {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          }, 1500);
        });
      }
    });

    // Make panel draggable
    makeDraggable(panel, panel.querySelector('#quickai-panel-header'));

    return panel;
  }

  function showFloatingResult(text, isError = false) {
    if (!floatingPanel) return;
    const loading = floatingPanel.querySelector('#quickai-panel-loading');
    const content = floatingPanel.querySelector('#quickai-panel-content');
    loading.style.display = 'none';
    content.style.display = 'block';

    if (isError) {
      content.innerHTML = `<span class="quickai-error">❌ ${escapeHtml(text)}</span>`;
    } else {
      content.textContent = text;
    }
  }

  function showFloatingStream(chunk) {
    if (!floatingPanel) return;
    const loading = floatingPanel.querySelector('#quickai-panel-loading');
    const content = floatingPanel.querySelector('#quickai-panel-content');
    loading.style.display = 'none';
    content.style.display = 'block';
    content.textContent += chunk;
    // Auto-scroll
    const body = floatingPanel.querySelector('#quickai-panel-body');
    body.scrollTop = body.scrollHeight;
  }

  function closeFloatingPanel() {
    if (floatingPanel) {
      floatingPanel.style.animation = 'quickai-slide-out 0.2s ease forwards';
      setTimeout(() => {
        if (floatingPanel) {
          floatingPanel.remove();
          floatingPanel = null;
        }
      }, 200);
    }
  }

  function makeDraggable(element, handle) {
    let startX, startY, initialX, initialY;

    handle.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;

      function onMouseMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        element.style.left = initialX + dx + 'px';
        element.style.top = initialY + dy + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== MESSAGE HANDLER ==========
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // Request: get page text
    if (msg.type === 'get-page-text') {
      const text = getPageText();
      sendResponse({ text: text, title: document.title, url: window.location.href });
      return;
    }

    // Request: get selected text
    if (msg.type === 'get-selection') {
      sendResponse({ text: getSelectedText() });
      return;
    }

    // Context menu action — show floating panel with result
    if (msg.type === 'context-menu-action') {
      const panel = createFloatingPanel();
      // Send the AI request from background
      // The background script will send the response via 'context-menu-result'
      return;
    }

    // Receive result from context menu AI query
    if (msg.type === 'context-menu-result') {
      if (!floatingPanel) createFloatingPanel();
      if (msg.error) {
        showFloatingResult(msg.error, true);
      } else {
        showFloatingResult(msg.data);
      }
      return;
    }

    // Receive streaming chunks for context menu
    if (msg.type === 'context-menu-stream') {
      if (!floatingPanel) createFloatingPanel();
      showFloatingStream(msg.chunk);
      return;
    }
  });

})();
