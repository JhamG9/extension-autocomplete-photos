/**
 * Punto de entrada principal de la extensión
 * Coordina la inicialización de las plataformas según el dominio actual
 */
class ExtensionManager {
  constructor() {
    this.currentPlatform = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      Logger.warn('Extension', 'Already initialized');
      return;
    }

    try {
      Logger.log('Extension', 'Starting initialization');

      const currentDomain = window.location.origin;
      Logger.log('Extension', 'Current domain', { domain: currentDomain });

      // Detectar plataforma y crear instancia
      this.currentPlatform = this.createPlatformInstance(currentDomain);

      if (!this.currentPlatform) {
        Logger.warn('Extension', 'No platform handler found for domain', { domain: currentDomain });
        return;
      }

      // Inicializar la plataforma después del delay inicial
      setTimeout(async () => {
        try {
          await this.currentPlatform.initialize();
          this.isInitialized = true;
          Logger.success('Extension', 'Platform initialized successfully', {
            platform: this.currentPlatform.config.name
          });
        } catch (error) {
          Logger.error('Extension', 'Platform initialization failed', error);
        }
      }, 3000); // Delay inicial de 3 segundos como en el código original

    } catch (error) {
      Logger.error('Extension', 'Failed to initialize extension', error);
    }
  }

  createPlatformInstance(domain) {
    try {
      // Shutterstock
      if (domain.includes('submit.shutterstock')) {
        return new ShutterstockPlatform();
      }

      // Adobe Stock
      if (domain.includes('contributor.stock.adobe.com')) {
        return new AdobeStockPlatform();
      }

      // Getty Images (con delay adicional)
      if (domain.includes('gettyimages.com')) {

        return new GettyImagesPlatform();
      }

      // Dreamstime
      if (domain.includes('dreamstime.com')) {
        // Agregar listener para coordenadas de click (debug)
        document.addEventListener('click', (event) => {
          const x = event.clientX;
          const y = event.clientY;
          Logger.log('Dreamstime', `Click coordinates: X=${x}, Y=${y}`);
        });

        return new DreamstimePlatform();
      }

      // DepositPhotos
      if (domain.includes('depositphotos.com')) {
        return new DepositPhotosPlatform();
      }

      // Alamy
      if (domain.includes('alamy.com')) {
        return new AlamyPlatform();
      }

      return null;

    } catch (error) {
      Logger.error('Extension', 'Failed to create platform instance', { domain, error });
      return null;
    }
  }

  // Método para reinicializar si es necesario
  async reinitialize() {
    Logger.log('Extension', 'Reinitializing extension');
    this.isInitialized = false;
    this.currentPlatform = null;
    await this.initialize();
  }

  // Método para obtener información del estado actual
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      platform: this.currentPlatform?.config?.name || 'None',
      domain: window.location.origin
    };
  }
}

// Auto-inicialización cuando el contenido se carga
(function () {
  'use strict';

  Logger.log('Extension', 'Content script loaded');

  // Crear e inicializar el manager
  const extensionManager = new ExtensionManager();

  // Hacer el manager globalmente accesible para debugging
  window.extensionManager = extensionManager;

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      extensionManager.initialize();
    });
  } else {
    // El DOM ya está listo
    extensionManager.initialize();
  }

  Logger.success('Extension', 'Extension manager setup complete');
})();