/**
 * Cliente centralizado para comunicación con la API
 */
class APIClient {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }
  
  /**
   * Lee la configuración guardada en el popup (chrome.storage es compartido
   * entre todas las plataformas, a diferencia de localStorage).
   */
  async getGenerationConfig() {
    try {
      const result = await chrome.storage.local.get(['generationConfig']);
      const config = result.generationConfig;
      if (!config) return undefined;

      return {
        ...config,
        date: this.formatDate(config.date)
      };
    } catch (error) {
      Logger.error('API', 'Failed to read config', error);
      return undefined;
    }
  }

  /** "2026-05-01" -> "May 1, 2026" */
  formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(`${isoDate}T00:00:00`);
    if (isNaN(date)) return isoDate;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  /**
   * Busca la foto por nombre. Si aún no existe, el backend la genera con la
   * configuración del popup. `platform` permite al backend adaptar la
   * respuesta (p. ej. quitar lugar/fecha editorial en Adobe).
   */
  async searchPhoto(fileName, platform) {
    try {
      Logger.log('API', 'Searching photo', { fileName, platform });

      const config = await this.getGenerationConfig();
      const response = await fetch(`${this.baseURL}/photos/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName, platform, config })
      });

      if (!response.ok) {
        // Nest devuelve { message } con el motivo (carpeta, config, etc.)
        let message = `HTTP ${response.status}`;
        try {
          const body = await response.json();
          message = Array.isArray(body.message) ? body.message.join(', ') : body.message || message;
        } catch (_) { /* respuesta sin JSON */ }
        throw new Error(message);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error('No photo data found');
      }

      Logger.success('API', 'Photo found', {
        fileName,
        title: data[0]?.title?.substring(0, 50) + '...'
      });

      return data[0];

    } catch (error) {
      const message = error.message === 'Failed to fetch'
        ? 'No se pudo conectar con el backend (localhost:3000)'
        : error.message;
      Logger.error('API', 'Failed to fetch photo', { fileName, error: message });
      APIClient.showToast(`${fileName}: ${message}`);
      throw error;
    }
  }

  /** Aviso visible en la página para que el error no quede solo en la consola */
  static showToast(text) {
    const toast = document.createElement('div');
    toast.textContent = `Jham Stock: ${text}`;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      maxWidth: '420px',
      padding: '12px 16px',
      background: '#b91c1c',
      color: 'white',
      font: '13px -apple-system, BlinkMacSystemFont, sans-serif',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      zIndex: 2147483647
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 7000);
  }
  
  /**
   * Procesa keywords limitando la cantidad y limpiando formato
   */
  processKeywords(keywords, maxCount = 50) {
    if (!keywords) return '';
    
    const wordsArray = keywords
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0)
      .slice(0, maxCount);
    
    const result = wordsArray.join(', ').replace(/\./g, '');
    
    Logger.log('API', 'Keywords processed', { 
      original: keywords.length, 
      processed: wordsArray.length 
    });
    
    return result;
  }
}

window.APIClient = APIClient;