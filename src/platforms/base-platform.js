/**
 * Clase base para todas las plataformas de stock
 * Define la interfaz común y funcionalidades compartidas
 */
class BasePlatform {
  constructor(platformKey) {
    this.platformKey = platformKey;
    this.config = PLATFORM_CONFIG[platformKey];
    this.selectors = SELECTORS[platformKey];
    this.apiClient = new APIClient();
    
    if (!this.config || !this.selectors) {
      throw new Error(`Platform ${platformKey} not configured`);
    }
    
    Logger.log(this.config.name, 'Platform initialized');
  }
  
  /**
   * Método principal que debe implementar cada plataforma
   */
  async initialize() {
    throw new Error('initialize() must be implemented by subclass');
  }
  
  /**
   * Busca y procesa información de la foto
   */
  async getPhotoData(fileName) {
    try {
      const photoData = await this.apiClient.searchPhoto(fileName);
      
      // Procesar keywords según los límites de la plataforma
      const processedKeywords = this.apiClient.processKeywords(
        photoData.keywords,
        this.config.limits?.maxKeywords || 50
      );
      
      return {
        ...photoData,
        keywords: processedKeywords
      };
    } catch (error) {
      Logger.error(this.config.name, 'Failed to get photo data', { fileName, error });
      throw error;
    }
  }
  
  /**
   * Espera por un elemento específico de la plataforma
   */
  async waitForSelector(selectorKey, timeout) {
    const selector = this.selectors[selectorKey];
    if (!selector) {
      throw new Error(`Selector '${selectorKey}' not found for ${this.config.name}`);
    }
    
    return await DOMUtils.waitForElement(selector, timeout);
  }
  
  /**
   * Establece valor en un campo específico de la plataforma
   */
  async setField(fieldKey, value) {
    try {
      const element = await this.waitForSelector(fieldKey);
      return DOMUtils.setElementValue(element, value);
    } catch (error) {
      Logger.error(this.config.name, `Failed to set ${fieldKey}`, { value, error });
      return false;
    }
  }
  
  /**
   * Delay helper
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Obtiene un delay específico de la configuración
   */
  getDelay(delayKey) {
    return this.config.delays?.[delayKey] || 1000;
  }
}

window.BasePlatform = BasePlatform;