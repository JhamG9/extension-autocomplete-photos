/**
 * Dreamstime Platform Implementation
 */
class DreamstimePlatform extends BasePlatform {
  constructor() {
    super('DREAMSTIME');
  }

  async initialize() {
    Logger.log(this.config.name, 'Initializing Dreamstime platform');
    
    try {
      // Primera función: click automático después del delay inicial
      setTimeout(() => {
        this.performInitialClick();
      }, this.getDelay('initialization'));

      // Segunda función: listener para clicks en elementos de upload
      setTimeout(() => {
        this.attachUploadListeners();
      }, 100);
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to initialize', error);
    }
  }

  performInitialClick() {
    try {
      const coords = this.config.coordinates.workScreen; // Usando coordenadas de trabajo
      const elementImg = DOMUtils.clickAt(coords.x, coords.y);
      
      if (elementImg) {
        const span = elementImg.querySelector(this.selectors.fileNameFull);
        const filename = span?.getAttribute('data-text');
        Logger.log(this.config.name, 'Selected image', { filename });
        
        // Click en otra posición
        DOMUtils.clickAt(101, 280);
        
        // Configurar listener del botón submit
        setTimeout(() => {
          this.setupSubmitButton();
        }, this.getDelay('beforeSubmit'));
        
        // Procesar archivo si se encontró
        if (filename) {
          setTimeout(() => {
            this.processFile(filename);
          }, this.getDelay('afterClick'));
        }
      }
    } catch (error) {
      Logger.error(this.config.name, 'Error in initial click', error);
    }
  }

  setupSubmitButton() {
    try {
      const submitButton = document.getElementById(this.selectors.submitButton.replace('#', ''));
      
      if (submitButton) {
        submitButton.addEventListener('click', () => {
          setTimeout(() => {
            window.location.replace('https://www.dreamstime.com/upload');
          }, 3000);
        });
        
        Logger.log(this.config.name, 'Submit button listener attached');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to setup submit button', error);
    }
  }

  attachUploadListeners() {
    try {
      document.addEventListener('click', (event) => {
        const item = event.target.closest(this.selectors.uploadItem);
        if (item) {
          const fileNameElement = item.querySelector(this.selectors.fileNameFull);
          const fileName = fileNameElement?.getAttribute('data-text');
          
          if (fileName) {
            Logger.log(this.config.name, 'Upload item clicked', { fileName });
            // Funcionalidad comentada en el código original
          }
        }
      });
    } catch (error) {
      Logger.error(this.config.name, 'Failed to attach upload listeners', error);
    }
  }

  async processFile(filename) {
    try {
      const photoData = await this.getPhotoData(filename);
      
      // Llenar campos
      await this.fillFields(photoData);
      
      // Configurar hotkey Alt para submit
      this.setupHotkey();
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to process file', error);
    }
  }

  async fillFields(photoData) {
    try {
      // Título
      const titleInput = document.querySelector(this.selectors.title);
      if (titleInput) {
        titleInput.value = photoData.title;
        Logger.success(this.config.name, 'Title set');
      }
      
      // Descripción
      const descriptionTextarea = document.querySelector(this.selectors.description);
      if (descriptionTextarea) {
        descriptionTextarea.value = photoData.description;
        Logger.success(this.config.name, 'Description set');
      }
      
      // Keywords
      const keywordsInput = document.querySelector(this.selectors.keywords);
      if (keywordsInput) {
        keywordsInput.focus();
        keywordsInput.value = photoData.keywords;
        keywordsInput.dispatchEvent(new Event('input', { bubbles: true }));
        Logger.success(this.config.name, 'Keywords set');
      }
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to fill fields', error);
    }
  }

  setupHotkey() {
    try {
      const btn = document.querySelector(this.selectors.submitButton);
      
      if (btn) {
        document.addEventListener('keydown', (event) => {
          if (event.altKey) {
            setTimeout(() => {
              btn.click();
              Logger.log(this.config.name, 'Auto-submit via Alt key');
            }, this.getDelay('afterClick'));
          }
        });
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to setup hotkey', error);
    }
  }
}

window.DreamstimePlatform = DreamstimePlatform;