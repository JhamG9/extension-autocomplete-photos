/**
 * Cliente centralizado para comunicación con la API
 */
class APIClient {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }
  
  /**
   * Busca información de una foto por nombre
   */
  async searchPhoto(fileName) {
    try {
      Logger.log('API', 'Searching photo', { fileName });
      
      const url = `${this.baseURL}/photos/search?name=${encodeURIComponent(fileName)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No photo data found');
      }
      
      Logger.success('API', 'Photo found', { 
        fileName, 
        title: data[0]?.title?.substring(0, 50) + '...' 
      });
      
      return data[0]; // Retorna el primer resultado
      
    } catch (error) {
      Logger.error('API', 'Failed to fetch photo', { fileName, error: error.message });
      throw error;
    }
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