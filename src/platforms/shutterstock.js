/**
 * Shutterstock Platform Implementation
 */
class ShutterstockPlatform extends BasePlatform {
  constructor() {
    super('SHUTTERSTOCK');
  }

  async initialize() {
    Logger.log(this.config.name, 'Initializing Shutterstock platform');
    
    try {
      // Buscar elementos clickeables
      const clickableElements = document.querySelectorAll(this.selectors.clickableItems);
      
      if (clickableElements.length === 0) {
        Logger.warn(this.config.name, 'No clickable elements found');
        return;
      }
      
      Logger.success(this.config.name, `Found ${clickableElements.length} clickable elements`);
      
      // Agregar event listeners a cada elemento
      clickableElements.forEach((element) => {
        element.addEventListener('click', (event) => this.handleElementClick(event));
      });
      
    } catch (error) {
      Logger.error(this.config.name, 'Failed to initialize', error);
    }
  }

  async handleElementClick(event) {
    try {
      Logger.log(this.config.name, 'Element clicked');
      
      await this.delay(this.getDelay('afterClick'));
      
      // Buscar nombre del archivo
      const fileNameElement = document.querySelector(this.selectors.fileName);
      if (!fileNameElement) {
        Logger.error(this.config.name, 'File name element not found');
        return;
      }
      
      const fileName = fileNameElement.textContent.trim();
      Logger.log(this.config.name, 'Processing file', { fileName });
      
      // Obtener datos de la foto
      const photoData = await this.getPhotoData(fileName);
      
      // Hacer clic en el contenedor de descripción
      await this.clickDescriptionContainer();
      
      await this.delay(100);
      
      // Llenar los campos
      await this.fillAllFields(photoData);
      
    } catch (error) {
      Logger.error(this.config.name, 'Error handling click', error);
    }
  }

  async clickDescriptionContainer() {
    try {
      const divContainer = document.querySelector(this.selectors.description);
      if (divContainer) {
        divContainer.click();
        Logger.log(this.config.name, 'Description container clicked');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to click description container', error);
    }
  }

  async fillAllFields(photoData) {
    try {
      // Llenar descripción
      await this.setDescription(photoData.description);
      
      // Llenar keywords
      await this.setKeywords(photoData.keywords);
      
      // Llenar categorías
      await this.setCategories(photoData);
      
    } catch (error) {
      Logger.error(this.config.name, 'Error filling fields', error);
    }
  }

  async setDescription(description) {
    try {
      const divContainer = document.querySelector(this.selectors.description);
      const textAreaElement = divContainer?.querySelector(this.selectors.descriptionTextarea);
      
      if (textAreaElement) {
        textAreaElement.focus();
        textAreaElement.value = description;
        
        const event = new Event('input', { bubbles: true, cancelable: true });
        textAreaElement.dispatchEvent(event);
        
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
        
        // Usar descriptor nativo para React
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        
        nativeInputValueSetter.call(keywordsInput, keywords);
        
        // Disparar evento input
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        keywordsInput.dispatchEvent(inputEvent);
        
        // Simular Enter después de un delay
        setTimeout(() => {
          DOMUtils.pressEnter(keywordsInput);
          Logger.success(this.config.name, 'Keywords set and Enter pressed');
        }, this.getDelay('beforeKeywords'));
        
      } else {
        Logger.error(this.config.name, 'Keywords input not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set keywords', error);
    }
  }

  async setCategories(photoData) {
    // Categoría 1
    setTimeout(() => {
      this.setCategoryOne(photoData.categoryOne);
    }, this.getDelay('categoryDelay'));
    
    // Categoría 2  
    setTimeout(() => {
      this.setCategoryTwo(photoData.categoryTwo);
    }, this.getDelay('categoryDelay'));
  }

  setCategoryOne(category) {
    try {
      const categorySelect = document.querySelector(this.selectors.categoryOne);
      
      if (categorySelect) {
        const input = document.querySelector(this.selectors.categoryOneInput);
        
        if (input) {
          input.value = category;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          Logger.success(this.config.name, 'Category 1 set', { category });
        } else {
          Logger.error(this.config.name, 'Category 1 input not found');
        }
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set category 1', error);
    }
  }

  setCategoryTwo(category) {
    try {
      const categorySelect = document.querySelector(this.selectors.categoryTwo);
      
      if (categorySelect) {
        const input = document.querySelector(this.selectors.categoryTwoInput);
        
        if (input) {
          input.value = category;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          Logger.success(this.config.name, 'Category 2 set', { category });
        } else {
          Logger.error(this.config.name, 'Category 2 input not found');
        }
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set category 2', error);
    }
  }
}

window.ShutterstockPlatform = ShutterstockPlatform;