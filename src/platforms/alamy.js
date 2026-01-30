/**
 * Alamy Platform Implementation
 */
class AlamyPlatform extends BasePlatform {
  constructor() {
    super('ALAMY');
  }

  async initialize() {
    Logger.log(this.config.name, 'Initializing Alamy platform');
    
    try {
      // Esperar tiempo de inicialización
      setTimeout(() => {
        this.attachImageListeners();
        this.setupSubmitButtonListener();
        this.setupCtrlSubmitListener();
        Logger.success(this.config.name, 'Platform ready');
      }, this.getDelay('initialization'));
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to initialize', error);
    }
  }

  attachImageListeners() {
    try {
      const images = document.querySelectorAll(this.selectors.gridImages);
      Logger.success(this.config.name, `Found ${images.length} grid images`);
      
      images.forEach((img) => {
        img.addEventListener('click', (event) => this.handleImageClick(event));
      });
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to attach image listeners', error);
    }
  }

  setupSubmitButtonListener() {
    try {
      const button = document.querySelector(this.selectors.submitSearch);
      const clearSelectionInput = document.querySelector(this.selectors.clearSelection);
      
      if (button && clearSelectionInput) {
        button.addEventListener('click', () => {
          setTimeout(() => {
            clearSelectionInput.click();
            Logger.log(this.config.name, 'Selection cleared after submit');
          }, this.getDelay('autoSubmit'));
        });
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to setup submit button listener', error);
    }
  }

  async handleImageClick(event) {
    try {
      const li = event.target.closest('li.grid');
      if (!li) return;
      
      const filenameSpan = li.querySelector(this.selectors.imageCap);
      if (!filenameSpan) {
        Logger.warn(this.config.name, 'Filename span not found');
        return;
      }
      
      const fileName = filenameSpan.textContent.trim();
      Logger.log(this.config.name, 'Processing image', { fileName });
      
      // Obtener datos de la foto
      const photoData = await this.getPhotoData(fileName);
      
      // Llenar campos después de un delay
      setTimeout(() => {
        this.fillAllFields(photoData);
      }, this.getDelay('afterClick'));
      
    } catch (error) {
      Logger.error(this.config.name, 'Error handling image click', error);
    }
  }

  async fillAllFields(photoData) {
    try {
      // Llenar caption
      await this.setCaption(photoData.description);
      
      // Llenar keywords
      await this.setKeywords(photoData.keywords);
      
      // Seleccionar super tags automáticamente
      await this.assignSuperTags();

      // Agregar si es editorial (si aplica)
      if(photoData.editorial) {
        await this.setEditorial();
      }

      // Agregar click auto cuando presione el control
      this.setupCtrlSubmitListener();
      
    } catch (error) {
      Logger.error(this.config.name, 'Error filling fields', error);
    }
  }

  setupCtrlSubmitListener() {
    // Evitar agregar múltiples listeners
    if (this.ctrlListenerAttached) return;
    
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Control') {
        const submitButton = document.querySelector(this.selectors.submitSearch);
        if (submitButton) {
          submitButton.click();
          Logger.success(this.config.name, 'Submit clicked via Ctrl key');
        }
      }
    });
    
    this.ctrlListenerAttached = true;
    Logger.log(this.config.name, 'Ctrl submit listener attached');
  }

  async setCaption(description) {
    try {
      const captionTextarea = document.querySelector(this.selectors.caption);
      
      if (captionTextarea) {
        captionTextarea.value = description;
        captionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        Logger.success(this.config.name, 'Caption set');
      } else {
        Logger.error(this.config.name, 'Caption textarea not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set caption', error);
    }
  }

  async setKeywords(keywordsString) {
    try {
      const wordsArray = keywordsString
        .split(',')
        .map(word => word.trim())
        .filter(word => word.length > 0)
        .slice(0, this.config.limits.maxKeywords);
      
      // Invertir orden de keywords (como en código original)
      const keywordsProcessed = wordsArray.reverse().join(', ');
      
      const keywordInput = document.querySelector(this.selectors.keywordInput);
      
      if (keywordInput) {
        keywordInput.value = keywordsProcessed;
        keywordInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Simular Enter para procesar keywords
        const enterEvent = new KeyboardEvent('keypress', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          keyCode: 13,
          which: 13
        });
        keywordInput.dispatchEvent(enterEvent);
        
        Logger.success(this.config.name, `Keywords set (${wordsArray.length} words)`);
      } else {
        Logger.error(this.config.name, 'Keyword input not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set keywords', error);
    }
  }

  async assignSuperTags() {
    try {
      await this.delay(this.getDelay('afterClick'));
      
      const tagsContainer = document.querySelector(this.selectors.keywordsContainer);
      if (!tagsContainer) {
        Logger.warn(this.config.name, 'Tags container not found');
        return;
      }
      
      const stars = tagsContainer.querySelectorAll(this.selectors.superTagStars);
      let selectedCount = 0;
      const maxTags = this.config.limits.maxSuperTags;
      
      for (let star of stars) {
        if (selectedCount >= maxTags) break;
        
        star.click();
        selectedCount++;
      }
      
      Logger.success(this.config.name, `Selected ${selectedCount} super tags`);
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to assign super tags', error);
    }
  }

  async setEditorial() {
    try {
      const checkbox = document.querySelector(this.selectors.editorialCheckbox);
      
      if (checkbox) {
        if (!checkbox.checked) {
          checkbox.click();
        }
        Logger.success(this.config.name, 'Editorial checkbox selected');
      } else {
        Logger.error(this.config.name, 'Editorial checkbox not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set editorial', error);
    }
  }
}

window.AlamyPlatform = AlamyPlatform;