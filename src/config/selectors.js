/**
 * Configuración de selectores CSS por plataforma
 * Centralizamos todos los selectores para facilitar mantenimiento
 */
const SELECTORS = {
  SHUTTERSTOCK: {
    description: '.MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-1wcqu4s',
    descriptionTextarea: '.MuiInputBase-input.MuiInput-input.MuiInputBase-inputMultiline.css-ovy66p',
    keywords: '.MuiInputBase-input.MuiInput-input.MuiInputBase-inputAdornedEnd.css-1n3jmm5',
    categoryOne: '[aria-labelledby="category1"]',
    categoryOneInput: 'input[name="category1"]',
    categoryTwo: '[aria-labelledby="category2"]',
    categoryTwoInput: 'input[name="category2"]',
    clickableItems: '.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-1enqk8l',
    fileName: '.MuiTypography-root.MuiTypography-bodyStaticLg.css-w8rlye'
  },
  
  ADOBE_STOCK: {
    title: 'textarea[name="title"]',
    keywords: 'textarea#content-keywords-ui-textarea',
    uploadTiles: 'div[role="option"][aria-selected="false"] .upload-tile__wrapper',
    sidebarFooter: '[data-t="asset-sidebar-footer"]',
    originalName: '.text-sregular'
  },
  
  GETTY_IMAGES: {
    country: '#metadata-select-country_of_shoot',
    countryDropdown: 'ul.MuiAutocomplete-listbox',
    title: '[data-cy="md-headline"] textarea[name="headline"]',
    description: '[data-cy="md-caption"] textarea[name="caption"]',
    keywords: 'div[data-cy="metadata-keyword-multiselect"] textarea',
    itemCards: '[data-cy="item-card"]',
    fileName: '[data-cy="contribution-file-name"]',
    saveButton: 'button[data-cy="save-metadata"]',
    submitButton: '[data-cy="submit-button"]'
  },
  
  DREAMSTIME: {
    title: '#title',
    description: '#description',
    keywords: '#keywords_tag',
    submitButton: '#submitbutton',
    fileNameFull: '.js-filenamefull',
    uploadItem: '.upload-item'
  },
  
  DEPOSITPHOTOS: {
    itemEditor: '.itemeditor',
    itemName: '.itemeditor__name',
    description: 'textarea.itemeditor__input_description',
    tagsEditor: '._tagseditor__item.tagseditor__item_new',
    tagsInput: 'span[contenteditable="true"]'
  },
  
  ALAMY: {
    gridImages: 'li.grid img',
    imageCap: '.img_cap',
    caption: 'textarea[name="captionText"]',
    keywordInput: '#add-keyword',
    keywordsContainer: '#mtKeywords',
    superTagStars: 'i.icon-tag-star.dark-grey',
    submitSearch: '#submitsearch',
    clearSelection: '#automationClearSelection input.deselect-all'
  }
};

window.SELECTORS = SELECTORS;