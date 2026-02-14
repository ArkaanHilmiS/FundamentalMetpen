/**
 * NavigationManager Class
 * Mengelola navigasi sidebar - versi simplified untuk dynamic content loading
 */
class NavigationManager {
  constructor() {
    this.currentSection = 'home';
    this.navItems = [];
    this.onNavigateCallback = null;
  }

  /**
   * Initialize navigation
   * @param {NodeList|Array} navItems - Nav item elements
   */
  initialize(navItems) {
    this.navItems = Array.from(navItems);
    
    // Attach click handlers
    this.navItems.forEach((item) => {
      item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        if (sectionId) {
          this.navigateTo(sectionId);
        }
      });
    });
  }

  /**
   * Set callback for navigation events
   * @param {Function} callback - Async function that handles content loading
   */
  onNavigate(callback) {
    this.onNavigateCallback = callback;
  }

  /**
   * Navigate to specific section
   * @param {string} sectionId - Target section ID
   */
  async navigateTo(sectionId) {
    if (!sectionId) {
      console.warn('Invalid section ID');
      return;
    }

    const previousSection = this.currentSection;

    // Update UI immediately
    this._deactivateAllNavItems();
    this._activateNavItem(sectionId);
    
    // Update state
    this.currentSection = sectionId;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL
    this._updateUrlHash(sectionId);

    // Load content via callback
    if (this.onNavigateCallback) {
      try {
        await this.onNavigateCallback(sectionId);
      } catch (error) {
        console.error('Error loading content:', error);
      }
    }

    // Dispatch event
    this._dispatchNavigationEvent(sectionId, previousSection);
  }

  /**
   * Get current active section
   * @returns {string}
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Deactivate all nav items
   * @private
   */
  _deactivateAllNavItems() {
    this.navItems.forEach(item => {
      item.classList.remove('active');
    });
  }

  /**
   * Activate corresponding nav item
   * @private
   */
  _activateNavItem(sectionId) {
    const targetItem = this.navItems.find(item => 
      item.getAttribute('data-section') === sectionId
    );
    
    if (targetItem) {
      targetItem.classList.add('active');
    }
  }

  /**
   * Update URL hash
   * @private
   */
  _updateUrlHash(sectionId) {
    if (history.pushState) {
      history.pushState(null, null, `#${sectionId}`);
    } else {
      location.hash = `#${sectionId}`;
    }
  }

  /**
   * Dispatch custom navigation event
   * @private
   */
  _dispatchNavigationEvent(sectionId, previousSection) {
    const event = new CustomEvent('sectionChanged', {
      detail: { sectionId, previousSection }
    });
    window.dispatchEvent(event);
  }

  /**
   * Handle browser back/forward navigation
   */
  handlePopState() {
    const hash = window.location.hash.slice(1);
    const sectionId = hash || 'home';
    this.navigateTo(sectionId);
  }
}

export default NavigationManager;
