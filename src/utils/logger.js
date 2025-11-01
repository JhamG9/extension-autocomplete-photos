/**
 * Sistema de logging centralizado para la extensión
 */
class Logger {
  static log(platform, action, data) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔵 [${timestamp}] [${platform}] ${action}:`, data);
  }
  
  static success(platform, action, data) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`✅ [${timestamp}] [${platform}] ${action}:`, data);
  }
  
  static error(platform, error, context = {}) {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`❌ [${timestamp}] [${platform}] Error:`, error, context);
  }
  
  static warn(platform, message, data) {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`⚠️ [${timestamp}] [${platform}] ${message}:`, data);
  }
}

// Export para usar en otros módulos
window.Logger = Logger;