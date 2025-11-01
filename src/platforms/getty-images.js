/**
 * Getty Images Platform Implementation
 */
class GettyImagesPlatform extends BasePlatform {
  constructor() {
    super('GETTY_IMAGES');
  }

  async initialize() {
    Logger.log(this.config.name, 'Initializing Getty Images platform');
    
    try {
      const itemCards = document.querySelectorAll(this.selectors.itemCards);
      
      if (itemCards.length === 0) {
        Logger.warn(this.config.name, 'No item cards found');
        return;
      }
      
      Logger.success(this.config.name, `Found ${itemCards.length} item cards`);
      
      itemCards.forEach((card) => {
        card.addEventListener('click', () => this.handleCardClick(card));
      });
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to initialize', error);
    }
  }

  async handleCardClick(card) {
    try {
      const fileNameElement = card.querySelector(this.selectors.fileName);
      const fileName = fileNameElement?.textContent?.trim();
      
      if (!fileName) {
        Logger.error(this.config.name, 'Filename not found in card');
        return;
      }
      
      Logger.log(this.config.name, 'Processing file', { fileName });
      
      await this.delay(this.getDelay('afterClick'));
      
      // Obtener datos de la foto
      const photoData = await this.getPhotoData(fileName);
      
      // Llenar todos los campos
      await this.fillAllFields(photoData);
      
    } catch (error) {
      Logger.error(this.config.name, 'Error handling card click', error);
    }
  }

  async fillAllFields(photoData) {
    try {
      // Llenar título
      await this.setTitle(photoData.title);
      
      // Llenar descripción
      await this.setDescription(photoData.description);
      
      // Llenar keywords
      await this.setKeywords(photoData.keywords);
      
      // Configurar país
      await this.setCountry();
      
    } catch (error) {
      Logger.error(this.config.name, 'Error filling fields', error);
    }
  }

  async setTitle(title) {
    try {
      const textarea = document.querySelector(this.selectors.title);
      
      if (textarea) {
        textarea.focus();
        textarea.click();
        textarea.value = title;
        
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        
        Logger.success(this.config.name, 'Title set');
      } else {
        Logger.error(this.config.name, 'Title textarea not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set title', error);
    }
  }

  async setDescription(description) {
    try {
      const textarea = document.querySelector(this.selectors.description);
      
      if (textarea) {
        textarea.focus();
        textarea.click();
        textarea.value = description;
        
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        
        Logger.success(this.config.name, 'Description set');
      } else {
        Logger.error(this.config.name, 'Description textarea not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set description', error);
    }
  }

  async setKeywords(keywords) {
    try {
      const keywordsInput = document.querySelector(this.selectors.keywords);
      
      if (keywordsInput) {
        keywordsInput.focus();
        keywordsInput.value = keywords;
        keywordsInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        Logger.success(this.config.name, 'Keywords set');
      } else {
        Logger.error(this.config.name, 'Keywords input not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set keywords', error);
    }
  }

  async setCountry() {
    try {
      const input = document.querySelector(this.selectors.country);
      
      if (input) {
        input.focus();
        input.value = 'Col';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Esperar dropdown y seleccionar Colombia
        setTimeout(() => {
          const dropdown = document.querySelector(this.selectors.countryDropdown);
          
          if (dropdown) {
            const option = Array.from(dropdown.querySelectorAll('li')).find((li) =>
              li.textContent.toLowerCase().includes('colombia')
            );
            
            if (option) {
              option.click();
              Logger.success(this.config.name, 'Country set to Colombia');
            } else {
              Logger.warn(this.config.name, 'Colombia option not found');
            }
          } else {
            Logger.warn(this.config.name, 'Country dropdown not found');
          }
        }, this.getDelay('countryDropdown'));
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set country', error);
    }
  }
}

window.GettyImagesPlatform = GettyImagesPlatform;