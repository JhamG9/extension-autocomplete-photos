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

			// Seleccionar país Colombia
			await this.setLocationCountry();

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

	async setLocationCountry() {
		try {
			// Usar jQuery y Chosen API si está disponible
			if (typeof jQuery !== 'undefined') {
				const $select = jQuery('#location_country');
				if ($select.length) {
					$select.val('COL').trigger('chosen:updated');
					Logger.success(this.config.name, 'Location country set via jQuery');
					return;
				}
			}

			// Fallback: Usar el campo de búsqueda del Chosen
			const chosenSingle = document.querySelector('#location_country_chosen .chosen-single');
			
			if (chosenSingle) {
				// Abrir el dropdown
				chosenSingle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
				
				await this.delay(300);
				
				// Escribir en el campo de búsqueda para filtrar
				const searchInput = document.querySelector('#location_country_chosen .chosen-search input');
				
				if (searchInput) {
					searchInput.focus();
					searchInput.value = 'Colombia';
					searchInput.dispatchEvent(new Event('input', { bubbles: true }));
					
					// Simular keyup para que Chosen filtre
					searchInput.dispatchEvent(new KeyboardEvent('keyup', { 
						bubbles: true, 
						key: 'a', 
						keyCode: 65 
					}));
					
					await this.delay(300);
					
					// Buscar el resultado filtrado (Colombia debería ser el único visible)
					const allResults = document.querySelectorAll('#location_country_chosen .chosen-results li.active-result');
					
					for (const li of allResults) {
						// Verificar que el elemento esté visible y sea Colombia
						const isVisible = li.offsetParent !== null && !li.classList.contains('result-selected');
						if (li.textContent.trim() === 'Colombia' && isVisible) {
							// Hacer click directo con eventos completos
							li.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
							li.click();
							
							Logger.success(this.config.name, 'Location country set to Colombia');
							return;
						}
					}
					
					// Último intento: buscar cualquier li visible con Colombia
					const visibleColombia = document.querySelector('#location_country_chosen .chosen-results li:not([style*="display: none"])');
					if (visibleColombia && visibleColombia.textContent.trim() === 'Colombia') {
						visibleColombia.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
						visibleColombia.click();
						Logger.success(this.config.name, 'Location country set to Colombia (fallback)');
						return;
					}
				}
				
				Logger.warn(this.config.name, 'Could not set location country');
			} else {
				Logger.error(this.config.name, 'Chosen single element not found');
			}
		} catch (error) {
			Logger.error(this.config.name, 'Failed to set location country', error);
		}
	}
}

window.Pond5Platform = Pond5Platform;
