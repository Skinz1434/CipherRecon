/**
 * CIPHER-RECON Router
 * Simple client-side routing for tab navigation
 */

(function () {
  'use strict';

  // Tab switching function
  window.switchTab = function (tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });

    // Remove active from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
      tab.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }

    // Mark nav tab as active
    const activeNavTab = Array.from(navTabs).find(
      tab => tab.textContent.toLowerCase().includes(tabName.toLowerCase()) ||
             tab.onclick.toString().includes(tabName),
    );
    if (activeNavTab) {
      activeNavTab.classList.add('active');
    }

    // Update URL hash
    window.location.hash = tabName;
  };

  // Handle hash changes
  window.addEventListener('hashchange', function () {
    const hash = window.location.hash.slice(1);
    if (hash) {
      switchTab(hash);
    }
  });

  // Initialize on load
  window.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash.slice(1);
    if (hash) {
      switchTab(hash);
    }
  });

  // Show About dialog
  window.showAbout = function () {
    const about = `
CIPHER-RECON v2.0.0
Elite Red Team Toolkit

Developed by SkinzAI
Advanced Text Intelligence & Steganography Suite

Features:
• Zero-width character steganography
• Multiple cipher implementations
• Text encoding/decoding tools
• Forensic analysis capabilities
• RESTful API for automation
• CLI for terminal operations

Security Notice:
This tool is for authorized security testing only.
Users are responsible for compliance with all applicable laws.
    `;
    alert(about);
  };

  // Show Help dialog
  window.showHelp = function () {
    const help = `
QUICK START GUIDE

1. STEGANOGRAPHY
   - Encoder: Hide secret messages in normal text
   - Decoder: Extract hidden messages from text

2. CRYPTOGRAPHY
   - Apply various ciphers (ROT13, Caesar, etc.)
   - Encode/decode in multiple formats

3. ANALYSIS
   - Detect hidden content in text
   - Generate statistical analysis

4. TOOLS
   - Transform text in various ways
   - Generate cryptographic hashes

5. API
   - Test API endpoints directly
   - View API documentation

Keyboard Shortcuts:
• Ctrl+Enter: Submit current form
• Esc: Clear current output

For CLI usage: npm run cli -- --help
For API server: npm start
    `;
    alert(help);
  };

  // Add keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Ctrl+Enter to submit
    if (e.ctrlKey && e.key === 'Enter') {
      const activeTab = document.querySelector('.tab-content.active');
      if (activeTab) {
        const button = activeTab.querySelector('.btn-primary');
        if (button) {
          button.click();
        }
      }
    }

    // Escape to clear outputs
    if (e.key === 'Escape') {
      const outputs = document.querySelectorAll('.output.show');
      outputs.forEach(output => {
        output.classList.remove('show');
      });
    }

    // Number keys for quick tab switching (Alt+1, Alt+2, etc.)
    if (e.altKey && e.key >= '1' && e.key <= '5') {
      const tabs = ['steganography', 'cryptography', 'analysis', 'tools', 'api'];
      const index = parseInt(e.key) - 1;
      if (tabs[index]) {
        switchTab(tabs[index]);
      }
    }
  });

  // Add copy functionality to all outputs
  window.addEventListener('DOMContentLoaded', function () {
    // Add copy buttons dynamically
    const addCopyButtons = () => {
      const outputs = document.querySelectorAll('.output');
      outputs.forEach(output => {
        if (!output.querySelector('.copy-btn')) {
          const copyBtn = document.createElement('button');
          copyBtn.className = 'copy-btn';
          copyBtn.textContent = '📋 COPY';
          copyBtn.onclick = () => {
            const text = output.textContent.replace('📋 COPY', '').trim();
            navigator.clipboard.writeText(text).then(() => {
              copyBtn.textContent = '✓ COPIED';
              setTimeout(() => {
                copyBtn.textContent = '📋 COPY';
              }, 2000);
            });
          };
          output.style.position = 'relative';
          output.appendChild(copyBtn);
        }
      });
    };

    // Initial setup
    addCopyButtons();

    // Re-add buttons when outputs are shown
    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  });
})();
