import ContentLoader from './ContentLoader.js';
import NavigationManager from './NavigationManager.js';

/**
 * Main Application Class
 * Mengatur seluruh aplikasi dan mengintegrasikan semua komponen
 */
class App {
  constructor() {
    this.contentLoader = new ContentLoader();
    this.navigationManager = new NavigationManager();
    this.contentContainer = null;
    this.config = this._getConfig();
    this.isInitialized = false;
  }

  /**
   * Initialize aplikasi
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Fundamental Metpen App...');

      // Get content container
      this.contentContainer = document.getElementById('content-container');
      if (!this.contentContainer) {
        throw new Error('Content container not found');
      }

      // Initialize navigation
      this._initializeNavigation();

      // Setup event listeners
      this._setupEventListeners();

      // Preload initial content if enabled
      if (this.config.enablePreload) {
        await this._preloadInitialContent();
      }

      // Handle initial route
      await this._handleInitialRoute();

      this.isInitialized = true;
      console.log('✅ App initialized successfully');

    } catch (error) {
      console.error('❌ Error initializing app:', error);
      this._showErrorMessage();
    }
  }

  /**
   * Get application configuration
   * @private
   */
  _getConfig() {
    return {
      // Mapping section ID ke file path
      contentPaths: {
        // Gambaran Umum
        home: 'content/gambaran-umum/home.html',
        
        // Prolog
        definisi: 'content/prolog/definisi.html',
        teknik: 'content/prolog/teknik.html',
        metode: 'content/prolog/metode.html',
        jenjang: 'content/prolog/jenjang.html',
        
        // Bagian Utama
        abstrak: 'content/bagian-utama/abstrak.html',
        bab1: 'content/bagian-utama/bab1.html',
        bab2: 'content/bagian-utama/bab2.html',
        bab3: 'content/bagian-utama/bab3.html',
        bab4: 'content/bagian-utama/bab4.html',
        bab5: 'content/bagian-utama/bab5.html',
        
        // Referensi
        kesalahan: 'content/referensi/kesalahan.html',
        prinsip: 'content/referensi/prinsip.html'
      },
      
      // Section untuk preload
      preloadSections: ['home'],
      
      // Enable/disable features
      enablePreload: true,
      enableCache: false, // Disabled untuk selalu fetch fresh content
      showLoadingIndicator: true
    };
  }

  /**
   * Initialize navigation system
   * @private
   */
  _initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    this.navigationManager.initialize(navItems);
    
    // Set callback untuk load content saat navigasi
    this.navigationManager.onNavigate(async (sectionId) => {
      await this._loadAndDisplayContent(sectionId);
    });
    
    console.log('📍 Navigation initialized');
  }

  /**
   * Setup global event listeners
   * @private
   */
  _setupEventListeners() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigationManager.handlePopState();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this._handleKeyboardShortcuts(e);
    });

    // Handle clear cache button
    const clearCacheBtn = document.getElementById('clear-cache-btn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        this._handleClearCache();
      });
    }

    console.log('🎧 Event listeners attached');
  }

  /**
   * Preload initial content
   * @private
   */
  async _preloadInitialContent() {
    console.log('📦 Preloading content...');
    
    const preloadList = this.config.preloadSections.map(id => ({
      id,
      path: this.config.contentPaths[id]
    })).filter(item => item.path); // Filter out undefined paths

    try {
      await this.contentLoader.preloadContents(preloadList);
      console.log('✅ Content preloaded');
    } catch (error) {
      console.warn('⚠️ Preload failed:', error);
    }
  }

  /**
   * Handle initial routing from URL
   * @private
   */
  async _handleInitialRoute() {
    const hash = window.location.hash.slice(1);
    const initialSection = (hash && this.config.contentPaths[hash]) ? hash : 'home';
    
    await this.navigationManager.navigateTo(initialSection);
  }

  /**
   * Load and display content for a section
   * @private
   */
  async _loadAndDisplayContent(sectionId) {
    const filePath = this.config.contentPaths[sectionId];
    
    if (!filePath) {
      console.error(`No content path for section: ${sectionId}`);
      this._showErrorInContent(`Konten untuk ${sectionId} tidak ditemukan`);
      return;
    }

    // Show loading indicator
    if (this.config.showLoadingIndicator) {
      this._showLoadingIndicator();
    }

    try {
      // Load content
      const content = await this.contentLoader.loadContent(sectionId, filePath);
      
      // Display content
      this._displayContent(content);
      
      console.log(`✅ Content loaded: ${sectionId}`);
    } catch (error) {
      console.error(`Error loading content for ${sectionId}:`, error);
      this._showErrorInContent(`Gagal memuat konten ${sectionId}`);
    }
  }

  /**
   * Display content in container
   * @private
   */
  _displayContent(htmlContent) {
    if (this.contentContainer) {
      // Wrap content in a section element with active class
      this.contentContainer.innerHTML = `
        <section class="section active">
          ${htmlContent}
        </section>
      `;
    }
  }

  /**
   * Show loading indicator
   * @private
   */
  _showLoadingIndicator() {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = `
        <div class="page-header">
          <h2>Loading...</h2>
          <p class="subtitle">Memuat konten...</p>
        </div>
      `;
    }
  }

  /**
   * Show error in content area
   * @private
   */
  _showErrorInContent(message) {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = `
        <section class="section active">
          <div class="page-header">
            <span class="chapter-label">⚠️ Error</span>
            <h2>Konten Tidak Dapat Dimuat</h2>
          </div>
          <div class="warn-box">
            <div class="warn-title">⚠ Peringatan</div>
            <p>${message}</p>
          </div>
        </section>
      `;
    }
  }

  /**
   * Handle keyboard shortcuts
   * @private
   */
  _handleKeyboardShortcuts(e) {
    // ESC - back to home
    if (e.key === 'Escape') {
      this.navigationManager.navigateTo('home');
    }
    
    // Ctrl/Cmd + Home - back to home
    if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
      e.preventDefault();
      this.navigationManager.navigateTo('home');
    }
  }

  /**
   * Show error message to user
   * @private
   */
  _showErrorMessage() {
    const mainContent = document.querySelector('.main');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="warn-box">
          <div class="warn-title">⚠ Terjadi Kesalahan</div>
          <p>Aplikasi tidak dapat dimuat dengan benar. Silakan refresh halaman atau hubungi administrator.</p>
        </div>
      `;
    }
  }

  /**
   * Navigate to section (public method)
   * @param {string} sectionId
   */
  navigateTo(sectionId) {
    if (!this.isInitialized) {
      console.warn('App not initialized yet');
      return;
    }
    this.navigationManager.navigateTo(sectionId);
  }

  /**
   * Get current section
   * @returns {string}
   */
  getCurrentSection() {
    return this.navigationManager.getCurrentSection();
  }

  /**
   * Clear content cache
   * @param {string|null} sectionId
   */
  clearCache(sectionId = null) {
    this.contentLoader.clearCache(sectionId);
    // Update app version untuk force refresh
    window.APP_VERSION = Date.now();
    console.log(`🗑️ Cache cleared${sectionId ? ` for ${sectionId}` : ''}`);
  }

  /**
   * Handle clear cache button click
   * @private
   */
  async _handleClearCache() {
    const statusEl = document.getElementById('cache-status');
    const currentSection = this.getCurrentSection();
    
    try {
      // Show loading status
      if (statusEl) {
        statusEl.textContent = '⏳ Clearing...';
        statusEl.className = 'cache-status active';
      }

      // Clear cache
      this.clearCache();
      
      // Reload current section
      await this.reloadSection(currentSection);
      
      // Show success message
      if (statusEl) {
        statusEl.textContent = '✓ Cache cleared!';
        setTimeout(() => {
          statusEl.className = 'cache-status';
          statusEl.textContent = '';
        }, 2000);
      }
      
      console.log('✅ Cache cleared and content reloaded');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      if (statusEl) {
        statusEl.textContent = '✗ Error';
        statusEl.className = 'cache-status error';
        setTimeout(() => {
          statusEl.className = 'cache-status';
          statusEl.textContent = '';
        }, 2000);
      }
    }
  }

  /**
   * Reload content untuk section tertentu
   * @param {string} sectionId
   */
  async reloadSection(sectionId) {
    this.clearCache(sectionId);
    await this._loadAndDisplayContent(sectionId);
  }
}

// Initialize app when DOM is ready
let appInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
  appInstance = new App();
  await appInstance.initialize();
  
  // Expose to window untuk debugging
  window.app = appInstance;
});

// Export untuk module
export default App;
