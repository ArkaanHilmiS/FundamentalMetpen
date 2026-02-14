/**
 * Advanced Code Protection System
 * Melindungi kode frontend dari inspeksi dan copy
 * © 2026 Arkaan Hilmi - All Rights Reserved
 */

(function() {
  'use strict';

  const ProtectionSystem = {
    config: {
      enableRightClickBlock: true,
      enableSelectBlock: true,
      enableDevToolsBlock: true,
      enableDevToolsDetection: true,
      enableKeyboardBlock: true,
      enableCopyBlock: true,
      enableDebuggerLoop: false, // Lebih agresif, bisa mengganggu UX
      warningMessage: 'Akses tidak diizinkan!',
      redirectUrl: null // Set URL untuk redirect jika DevTools terdeteksi
    },

    isDevToolsOpen: false,
    checkInterval: null,

    /**
     * Initialize seluruh sistem proteksi
     */
    init() {
      console.log('🔒 Protection System Activated');
      
      if (this.config.enableRightClickBlock) {
        this.disableRightClick();
      }

      if (this.config.enableSelectBlock) {
        this.disableTextSelection();
      }

      if (this.config.enableCopyBlock) {
        this.disableCopy();
      }

      if (this.config.enableKeyboardBlock) {
        this.blockDevToolsShortcuts();
      }

      if (this.config.enableDevToolsDetection) {
        this.detectDevTools();
      }

      if (this.config.enableDebuggerLoop) {
        this.startDebuggerLoop();
      }

      // Additional protections
      this.disableDragDrop();
      this.blockCommonInspectMethods();
      
      // Obfuscate console
      this.obfuscateConsole();
    },

    /**
     * 1. DISABLE RIGHT CLICK
     * Mencegah context menu (klik kanan)
     */
    disableRightClick() {
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        ProtectionSystem.showWarning('Right-click disabled');
        return false;
      }, false);
    },

    /**
     * 2. DISABLE TEXT SELECTION
     * Mencegah select text dengan mouse atau keyboard
     */
    disableTextSelection() {
      // CSS-based blocking
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
        
        /* Allow selection for input fields */
        input, textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
      document.head.appendChild(style);

      // JavaScript-based blocking
      document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          return false;
        }
      }, false);
    },

    /**
     * 3. DISABLE COPY/CUT
     * Mencegah copy dan cut konten
     */
    disableCopy() {
      document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.clipboardData.setData('text/plain', 'Content protection enabled');
        ProtectionSystem.showWarning('Copy disabled');
        return false;
      }, false);

      document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
      }, false);
    },

    /**
     * 4. BLOCK DEVTOOLS SHORTCUTS
     * Memblokir F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U
     */
    blockDevToolsShortcuts() {
      document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          ProtectionSystem.showWarning('DevTools shortcut blocked');
          return false;
        }

        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) {
          e.preventDefault();
          ProtectionSystem.showWarning('Inspect blocked');
          return false;
        }

        // Ctrl+Shift+C (Element selector)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.keyCode === 67)) {
          e.preventDefault();
          return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.keyCode === 74)) {
          e.preventDefault();
          return false;
        }

        // Ctrl+U (View source)
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
          e.preventDefault();
          return false;
        }

        // Ctrl+S (Save page)
        if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
          e.preventDefault();
          return false;
        }

        // Ctrl+Shift+K (Firefox console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.keyCode === 75)) {
          e.preventDefault();
          return false;
        }
      }, false);
    },

    /**
     * 5. DETECT DEVTOOLS TERBUKA
     * Deteksi jika DevTools dibuka dengan berbagai metode
     */
    detectDevTools() {
      // Method 1: Window size detection
      const detectBySizeCheck = () => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          return true;
        }
        return false;
      };

      // Method 2: Console detection via timing
      const detectByTiming = () => {
        const start = performance.now();
        debugger; // eslint-disable-line no-debugger
        const end = performance.now();
        
        return end - start > 100;
      };

      // Method 3: toString detection
      const detectByToString = () => {
        const element = new Image();
        let isOpen = false;
        
        Object.defineProperty(element, 'id', {
          get: function() {
            isOpen = true;
            throw new Error('DevTools detected');
          }
        });

        try {
          console.log(element);
        } catch (e) {
          return true;
        }
        
        return isOpen;
      };

      // Run detection periodically
      this.checkInterval = setInterval(() => {
        const isOpen = detectBySizeCheck();
        
        if (isOpen && !this.isDevToolsOpen) {
          this.isDevToolsOpen = true;
          this.onDevToolsDetected();
        } else if (!isOpen && this.isDevToolsOpen) {
          this.isDevToolsOpen = false;
        }
      }, 1000);

      // Also check on resize
      window.addEventListener('resize', () => {
        if (detectBySizeCheck()) {
          this.onDevToolsDetected();
        }
      });
    },

    /**
     * Callback ketika DevTools terdeteksi
     */
    onDevToolsDetected() {
      console.clear();
      
      if (this.config.redirectUrl) {
        // Redirect ke halaman lain
        window.location.href = this.config.redirectUrl;
      } else {
        // Atau blur/hide konten
        this.blurContent();
        this.showDevToolsWarning();
      }
    },

    /**
     * Blur konten website
     */
    blurContent() {
      document.body.style.filter = 'blur(10px)';
      document.body.style.pointerEvents = 'none';
    },

    /**
     * Show DevTools warning overlay
     */
    showDevToolsWarning() {
      const existingWarning = document.getElementById('devtools-warning');
      if (existingWarning) return;

      const warning = document.createElement('div');
      warning.id = 'devtools-warning';
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        color: #ff4444;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: 'Courier New', monospace;
        text-align: center;
      `;
      
      warning.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 30px;">🚫</div>
        <h1 style="font-size: 48px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 3px;">
          ACCESS DENIED
        </h1>
        <p style="font-size: 24px; margin: 0; opacity: 0.8;">
          Developer Tools Detected
        </p>
        <p style="font-size: 16px; margin: 20px 0 0 0; opacity: 0.6;">
          Close DevTools to continue
        </p>
        <div style="margin-top: 40px; font-size: 14px; opacity: 0.5;">
          ERROR CODE: DT-403
        </div>
      `;
      
      document.body.appendChild(warning);
    },

    /**
     * 6. DISABLE DRAG & DROP
     * Mencegah drag gambar atau elemen
     */
    disableDragDrop() {
      document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
      }, false);

      document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
      }, false);
    },

    /**
     * 7. BLOCK COMMON INSPECT METHODS
     * Block berbagai cara membuka DevTools
     */
    blockCommonInspectMethods() {
      // Disable inspect element via middle click
      document.addEventListener('auxclick', function(e) {
        if (e.button === 1) { // Middle click
          e.preventDefault();
          return false;
        }
      });

      // Override window.open untuk mencegah view-source
      const originalOpen = window.open;
      window.open = function(...args) {
        const url = args[0];
        if (url && url.startsWith('view-source:')) {
          ProtectionSystem.showWarning('View source blocked');
          return null;
        }
        return originalOpen.apply(this, args);
      };
    },

    /**
     * 8. OBFUSCATE CONSOLE
     * Membuat console methods tidak berguna
     */
    obfuscateConsole() {
      // Clear console periodically
      setInterval(() => {
        console.clear();
      }, 2000);

      // Override console methods
      const noop = () => {};
      const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'clear'];
      
      methods.forEach(method => {
        if (console[method]) {
          const original = console[method];
          console[method] = function(...args) {
            // Tampilkan pesan palsu
            if (Math.random() > 0.7) {
              original.call(console, '🔒 Protected content');
            }
          };
        }
      });
    },

    /**
     * 9. DEBUGGER LOOP (AGGRESSIVE)
     * Infinite debugger untuk mengganggu debugging
     * PERHATIAN: Ini akan sangat mengganggu dan bisa di-bypass
     */
    startDebuggerLoop() {
      setInterval(() => {
        debugger; // eslint-disable-line no-debugger
      }, 100);
    },

    /**
     * Show brief warning notification
     */
    showWarning(message) {
      // Skip if already showing
      if (document.querySelector('.protection-toast')) return;

      const toast = document.createElement('div');
      toast.className = 'protection-toast';
      toast.textContent = '🔒 ' + (message || 'Action blocked');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 68, 68, 0.95);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
      `;

      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(toast);

      // Remove after 2 seconds
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ProtectionSystem.init();
    });
  } else {
    ProtectionSystem.init();
  }

  // Export untuk konfigurasi tambahan jika diperlukan
  window.ProtectionSystem = ProtectionSystem;

})();
