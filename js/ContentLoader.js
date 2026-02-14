/**
 * ContentLoader Class
 * Bertanggung jawab untuk memuat konten HTML dari file eksternal
 */
class ContentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingQueue = new Map();
  }

  /**
   * Load konten dari file HTML
   * @param {string} sectionId - ID section yang akan dimuat
   * @param {string} filePath - Path file HTML
   * @returns {Promise<string>} - HTML content
   */
  async loadContent(sectionId, filePath) {
    // Cek cache terlebih dahulu
    if (this.cache.has(sectionId)) {
      return this.cache.get(sectionId);
    }

    // Cek apakah sedang loading
    if (this.loadingQueue.has(sectionId)) {
      return this.loadingQueue.get(sectionId);
    }

    // Buat promise untuk loading
    const loadPromise = this._fetchContent(filePath)
      .then(content => {
        this.cache.set(sectionId, content);
        this.loadingQueue.delete(sectionId);
        return content;
      })
      .catch(error => {
        console.error(`Error loading content for ${sectionId}:`, error);
        this.loadingQueue.delete(sectionId);
        return this._getErrorContent(sectionId);
      });

    this.loadingQueue.set(sectionId, loadPromise);
    return loadPromise;
  }

  /**
   * Fetch content dari file
   * @private
   */
  async _fetchContent(filePath) {
    // Tambahkan timestamp untuk cache busting
    const cacheBuster = `?v=${Date.now()}`;
    const response = await fetch(filePath + cacheBuster);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }

  /**
   * Generate error content jika loading gagal
   * @private
   */
  _getErrorContent(sectionId) {
    return `
      <div class="page-header">
        <span class="chapter-label">⚠️ Error</span>
        <h2>Konten Tidak Dapat Dimuat</h2>
        <p class="subtitle">Terjadi kesalahan saat memuat konten ${sectionId}</p>
      </div>
      <div class="warn-box">
        <div class="warn-title">⚠ Peringatan</div>
        <p>Konten untuk bagian ini tidak dapat dimuat. Silakan periksa koneksi atau hubungi administrator.</p>
      </div>
    `;
  }

  /**
   * Clear cache untuk section tertentu atau semua
   * @param {string|null} sectionId - ID section atau null untuk clear semua
   */
  clearCache(sectionId = null) {
    if (sectionId) {
      this.cache.delete(sectionId);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Preload multiple contents sekaligus
   * @param {Array<{id: string, path: string}>} contentList
   */
  async preloadContents(contentList) {
    const promises = contentList.map(({ id, path }) => 
      this.loadContent(id, path)
    );
    return Promise.all(promises);
  }
}

export default ContentLoader;
