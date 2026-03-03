/**
 * Pond5 Platform Implementation (video uploads)
 */
class Pond5Platform extends BasePlatform {
	constructor() {
		super('POND5');
		this.processed = false;
	}

	async initialize() {
		Logger.log(this.config.name, 'Initializing Pond5 platform');

		try {
			setTimeout(() => {
				this.processCurrentPage();
			}, this.getDelay('initialization'));
		} catch (error) {
			Logger.error(this.config.name, 'Failed to initialize', error);
		}
	}

	async processCurrentPage() {
		if (this.processed) return;

		try {
			const fileName = this.extractFileName();
			if (!fileName) {
				Logger.warn(this.config.name, 'File name not found on page');
				return;
			}

			Logger.log(this.config.name, 'Processing file', { fileName });
			this.processed = true;

			const photoData = await this.getPhotoData(fileName);
			Logger.success(this.config.name, 'Photo data ready', {
				fileName,
				title: photoData?.title
			});

			// Llenar los campos automáticamente
			await this.fillAllFields(photoData);
		} catch (error) {
			Logger.error(this.config.name, 'Error processing page', error);
		}
	}

	extractFileName() {
		try {
			// Buscar el contenedor principal del video
			const container = document.querySelector(this.selectors.videoContainer);
			if (!container) {
				Logger.warn(this.config.name, 'Video container not found');
				return null;
			}

			// Buscar el enlace con el nombre del archivo
			const link = container.querySelector(this.selectors.fileNameLink);
			const text = link?.textContent?.trim();
			
			// Reemplazar espacios por guiones bajos
			const fileName = text ? text.replace(/\s+/g, '_') : null;
			return fileName;
		} catch (error) {
			Logger.error(this.config.name, 'Failed to extract filename', error);
			return null;
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

			Logger.success(this.config.name, 'All fields filled');
		} catch (error) {
			Logger.error(this.config.name, 'Error filling fields', error);
		}
	}

	async setTitle(title) {
		try {
			const titleInput = document.querySelector(this.selectors.title);

			if (titleInput) {
				titleInput.focus();
				titleInput.value = title;
				titleInput.dispatchEvent(new Event('input', { bubbles: true }));
				titleInput.dispatchEvent(new Event('change', { bubbles: true }));

				Logger.success(this.config.name, 'Title set');
			} else {
				Logger.error(this.config.name, 'Title input not found');
			}
		} catch (error) {
			Logger.error(this.config.name, 'Failed to set title', error);
		}
	}

	async setDescription(description) {
		try {
			const descTextarea = document.querySelector(this.selectors.description);

			if (descTextarea) {
				descTextarea.focus();
				descTextarea.value = description;
				descTextarea.dispatchEvent(new Event('input', { bubbles: true }));
				descTextarea.dispatchEvent(new Event('change', { bubbles: true }));

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
			const keywordsTextarea = document.querySelector(this.selectors.keywords);

			if (keywordsTextarea) {
				keywordsTextarea.focus();
				keywordsTextarea.value = keywords;
				keywordsTextarea.dispatchEvent(new Event('input', { bubbles: true }));
				keywordsTextarea.dispatchEvent(new Event('change', { bubbles: true }));

				Logger.success(this.config.name, 'Keywords set');
			} else {
				Logger.error(this.config.name, 'Keywords textarea not found');
			}
		} catch (error) {
			Logger.error(this.config.name, 'Failed to set keywords', error);
		}
	}
}

window.Pond5Platform = Pond5Platform;
