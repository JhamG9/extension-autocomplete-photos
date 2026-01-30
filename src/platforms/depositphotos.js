/**
 * DepositPhotos Platform Implementation
 */
class DepositPhotosPlatform extends BasePlatform {
  constructor() {
    super('DEPOSITPHOTOS');
    this.lastProcessedId = '';
  }

  async initialize() {
    Logger.log(this.config.name, 'Initializing DepositPhotos platform');
    
    try {
      const items = document.querySelectorAll(this.selectors.itemEditor);
      Logger.success(this.config.name, `Found ${items.length} editor items`);
      
      items.forEach((item) => {
        item.addEventListener('click', (event) => this.handleItemClick(item, event));
      });
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to initialize', error);
    }
  }

  async handleItemClick(item, event) {
    try {
      const id = item.getAttribute('id');
      
      // Evitar procesar el mismo elemento múltiples veces
      if (id === this.lastProcessedId) {
        return;
      }
      this.lastProcessedId = id;
      
      const fileNameSpan = item.querySelector(this.selectors.itemName);
      if (!fileNameSpan) {
        Logger.warn(this.config.name, 'Filename not found in item');
        return;
      }
      
      const fileName = fileNameSpan.textContent.trim();
      Logger.log(this.config.name, 'Processing item', { fileName, id });
      
      // Obtener datos de la foto
      const photoData = await this.getPhotoData(fileName);
      
      // Llenar campos
      await this.fillFields(item, photoData);
      
    } catch (error) {
      Logger.error(this.config.name, 'Error handling item click', error);
    }
  }

  async fillFields(item, photoData) {
    try {
      // Llenar descripción con efecto de escritura
      await this.setDescription(item, photoData.description);
      
      // Llenar keywords
      await this.setKeywords(item, photoData.keywords);

      // Seleccionar editorial si aplica
      if (photoData.editorial) {
        await this.setEditorial(item);
      }
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to fill fields', error);
    }
  }

  async setDescription(item, description) {
    try {
      const textarea = item.querySelector(this.selectors.description);
      
      if (textarea) {
        textarea.focus();
        textarea.value = '';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Simular escritura carácter por carácter
        await DOMUtils.simulateTyping(textarea, description, this.config.delays.typingSpeed);
        
        Logger.success(this.config.name, 'Description typed');
      } else {
        Logger.error(this.config.name, 'Description textarea not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set description', error);
    }
  }

  async setKeywords(item, keywordsString) {
    try {
      const keywords = keywordsString.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      for (const word of keywords) {
        await this.addSingleKeyword(item, word);
      }
      
      Logger.success(this.config.name, `Added ${keywords.length} keywords`);
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set keywords', error);
    }
  }

  async addSingleKeyword(item, word) {
    try {
      const inputContainer = item.querySelector(this.selectors.tagsEditor);
      const inputSpan = inputContainer?.querySelector(this.selectors.tagsInput);
      
      if (!inputSpan) {
        Logger.warn(this.config.name, 'Keywords input not found', { word });
        return;
      }
      
      inputSpan.focus();
      inputSpan.textContent = '';
      inputSpan.dispatchEvent(new InputEvent('input', { bubbles: true }));
      
      // Escribir la palabra
      inputSpan.textContent = word;
      inputSpan.dispatchEvent(new InputEvent('input', { bubbles: true }));
      
      // Simular Enter para confirmar el tag
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      inputSpan.dispatchEvent(enterEvent);
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to add keyword', { word, error });
    }
  }

  async setEditorial(item) {
    try {
      const editorialSelect = item.querySelector('select._itemeditor__value_is_editorial');
      
      if (editorialSelect) {
        editorialSelect.value = 'yes';
        editorialSelect.dispatchEvent(new Event('change', { bubbles: true }));
        
        Logger.success(this.config.name, 'Editorial set to Yes');
      } else {
        Logger.error(this.config.name, 'Editorial select not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set editorial', error);
    }
  }
}

window.DepositPhotosPlatform = DepositPhotosPlatform;