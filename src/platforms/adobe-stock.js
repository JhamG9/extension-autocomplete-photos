/**
 * Adobe Stock Platform Implementation
 */
class AdobeStockPlatform extends BasePlatform {
  constructor() {
    super('ADOBE_STOCK');
  }

  async initialize() {
    Logger.log(this.config.name, 'Initializing Adobe Stock platform');

    try {
      const clickableElements = document.querySelectorAll(this.selectors.uploadTiles);

      if (clickableElements.length === 0) {
        Logger.warn(this.config.name, 'No upload tiles found');
        return;
      }

      Logger.success(this.config.name, `Found ${clickableElements.length} upload tiles`);

      clickableElements.forEach((element, index) => {
        element.addEventListener('click', () => this.handleElementClick(element, index));
      });

    } catch (error) {
      Logger.error(this.config.name, 'Failed to initialize', error);
    }
  }

  async handleElementClick(element, index) {
    try {
      Logger.log(this.config.name, `Upload tile ${index + 1} clicked`);

      // Esperar a que aparezca el sidebar
      await this.delay(this.getDelay('sidebarLoad'));

      const fileName = await this.extractFileName();
      if (!fileName) {
        Logger.error(this.config.name, 'Could not extract filename');
        return;
      }

      Logger.log(this.config.name, 'Processing file', { fileName });

      // Obtener datos de la foto
      const photoData = await this.getPhotoData(fileName);

      // Llenar campos
      await this.fillFields(photoData);

    } catch (error) {
      Logger.error(this.config.name, 'Error handling click', error);
    }
  }

  async extractFileName() {
    try {
      const assetSidebarFooter = document.querySelector(this.selectors.sidebarFooter);

      if (assetSidebarFooter) {
        const originalNameDiv = assetSidebarFooter.querySelector(this.selectors.originalName);

        if (originalNameDiv) {
          const originalNameText = originalNameDiv.textContent.trim();
          const originalNameMatch = originalNameText.match(
            /(?:Original name\(s\)|Nombre\/s original\/es):\s*(.+)$/
          );

          if (originalNameMatch && originalNameMatch[1]) {
            return originalNameMatch[1];
          }
        }
      }

      return null;
    } catch (error) {
      Logger.error(this.config.name, 'Failed to extract filename', error);
      return null;
    }
  }

  async fillFields(photoData) {
    try {
      // Llenar título
      await this.setTitle(photoData.description);

      // Llenar keywords
      await this.setKeywords(photoData.keywords);
      await this.clickReleaseOption(false);

      if (photoData.isIA) {
        await this.checkGenerativeAI();
      }
      console.log('PhotoData====', photoData);
    } catch (error) {
      Logger.error(this.config.name, 'Error filling fields', error);
    }
  }

  async clickReleaseOption(isEditorial) {
    try {
      // Si es editorial, seleccionar "Sí", si no es editorial, seleccionar "No"
      const selector = isEditorial ? 'input[data-t="has-release-yes"]' : 'input[data-t="has-release-no"]';
      const optionText = isEditorial ? 'Sí' : 'No';

      const releaseInput = document.querySelector(selector);

      if (releaseInput) {
        releaseInput.click();
        Logger.success(this.config.name, `Clicked "${optionText}" release option`);
      } else {
        Logger.error(this.config.name, `"${optionText}" release option not found`);
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to click release option', error);
    }
  }

  async setTitle(title) {
    try {
      const textArea = document.querySelector(this.selectors.title);

      if (textArea) {
        textArea.value = title;

        const event = new Event('input', { bubbles: true, cancelable: true });
        textArea.dispatchEvent(event);

        Logger.success(this.config.name, 'Title set');
      } else {
        Logger.error(this.config.name, 'Title textarea not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set title', error);
    }
  }

  async setKeywords(keywords) {
    try {
      const keywordsTextArea = document.querySelector(this.selectors.keywords);

      if (keywordsTextArea) {
        keywordsTextArea.value = keywords;

        const event = new Event('input', { bubbles: true, cancelable: true });
        keywordsTextArea.dispatchEvent(event);

        Logger.success(this.config.name, 'Keywords set');
      } else {
        Logger.error(this.config.name, 'Keywords textarea not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to set keywords', error);
    }
  }

  async checkGenerativeAI() {
    try {
      const aiCheckbox = document.querySelector('#content-tagger-generative-ai-checkbox');

      if (aiCheckbox && !aiCheckbox.checked) {
        aiCheckbox.click();
        Logger.success(this.config.name, 'Generative AI checkbox checked');
      } else if (!aiCheckbox) {
        Logger.error(this.config.name, 'Generative AI checkbox not found');
        return;
      }

      await this.delay(1000);

      const propertyReleaseCheckbox = document.querySelector('#content-tagger-generative-ai-property-release-checkbox');

      if (propertyReleaseCheckbox && !propertyReleaseCheckbox.checked) {
        propertyReleaseCheckbox.click();
        Logger.success(this.config.name, 'Generative AI property release checkbox checked');
      } else if (!propertyReleaseCheckbox) {
        Logger.error(this.config.name, 'Generative AI property release checkbox not found');
      }
    } catch (error) {
      Logger.error(this.config.name, 'Failed to check generative AI checkboxes', error);
    }
  }
}

window.AdobeStockPlatform = AdobeStockPlatform;