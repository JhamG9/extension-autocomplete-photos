function setValueDescription(description) {
  const divContainer = document.querySelector(
    ".MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-1wcqu4s"
  );

  // Ahora buscamos el <textarea> dentro del contenedor
  const textAreaElement = divContainer.querySelector(
    ".MuiInputBase-input.MuiInput-input.MuiInputBase-inputMultiline.css-ovy66p"
  );
  if (textAreaElement) {
    console.log(
      "Elemento <textarea> encontrado para cambiar valor:",
      textAreaElement
    );

    // Simulamos el enfoque del textarea
    textAreaElement.focus(); // Fuerza el enfoque en el textarea
    console.log("Texto en el textarea activado.");

    // Asignamos el valor al <textarea>
    textAreaElement.value = description; // Establece el nuevo valor en el <textarea>
    console.log("Nuevo valor asignado al <textarea>");

    // Simulamos el evento input para que el campo sea actualizado correctamente
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    textAreaElement.dispatchEvent(event);
  }
}

function setKeywords(keywords) {
  const keywordsInput = document.querySelector(
    ".MuiInputBase-input.MuiInput-input.MuiInputBase-inputAdornedEnd.css-1n3jmm5"
  );

  if (keywordsInput) {
    keywordsInput.focus();

    // Obtener el descriptor original de 'value' para React
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;

    // Asignar el nuevo valor usando el descriptor original
    nativeInputValueSetter.call(keywordsInput, keywords);

    // Disparar un evento 'input' para que React detecte el cambio
    const inputEvent = new Event("input", { bubbles: true, cancelable: true });
    keywordsInput.dispatchEvent(inputEvent);

    // Comentar talvez
    setTimeout(() => {
      // Simular la tecla "Enter"
      ["keydown", "keypress", "keyup"].forEach((eventType) => {
        const enterEvent = new KeyboardEvent(eventType, {
          bubbles: true,
          cancelable: true,
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
        });
        keywordsInput.dispatchEvent(enterEvent);
      });

      console.log("Enter presionado");
    }, 500);
  }
}

function setValueCategoryOne(category) {
  setTimeout(() => {
    const categorySelect = document.querySelector(
      '[aria-labelledby="category1"]'
    );

    if (categorySelect) {
      const input = document.querySelector('input[name="category1"]');

      if (input) {
        input.value = category;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        console.log("Valor asignado Categoria 1");
      } else {
        console.log("No se encontró el input con name=category11");
      }
    }
  }, 3000);
}

function setValueCategoryTwo(category) {
  setTimeout(() => {
    const categorySelect = document.querySelector(
      '[aria-labelledby="category2"]'
    );

    if (categorySelect) {
      const input = document.querySelector('input[name="category2"]');

      if (input) {
        input.value = category;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        console.log("Valor asignado Categoria 2");
      } else {
        console.log("No se encontró el input con name=category11");
      }
    }
  }, 3000);
}


function functionShutterstock() {
  try {
    // Seleccionamos todos los elementos con la clase especificada
    const clickableElements = document.querySelectorAll(
      ".MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root.css-1enqk8l"
    );

    if (clickableElements.length > 0) {
      console.clear();
      console.log(`Elementos encontrados: ${clickableElements.length}`);

      // Iteramos sobre cada elemento para agregar el evento click
      clickableElements.forEach((clickableElement) => {
        clickableElement.addEventListener("click", function () {
          try {
            setTimeout(() => {
              console.log("Elemento clickeado: ", this);
              //const spanElement = this.querySelector('span.o_List_List_itemText.o_list_theme_itemText.o_List_List_primary.o_list_theme_primary.o_EditorCard_EditorCard_itemTitle div');
              const spanElement = document.querySelector(
                ".MuiTypography-root.MuiTypography-bodyStaticLg.css-w8rlye"
              );

              if (spanElement) {
                let fileName = spanElement.textContent.trim(); // Obtenemos el texto y eliminamos espacios innecesarios
                // Esperamos un poco para asegurarnos de que el siguiente elemento se habilite
                console.log(fileName);
                const endpoint = `http://localhost:3000/photos/search?name=${encodeURIComponent(
                  fileName
                )}`;
                console.log("Llamando al endpoint:", endpoint);

                fetch(endpoint)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(
                        `Error en la respuesta: ${response.status} ${response.statusText}`
                      );
                    }
                    return response.json(); // Si el endpoint devuelve JSON
                  })
                  .then((data) => {
                    const photoDB = data[0];

                    const wordsArray = photoDB.keywords
                      .split(",")
                      .map((word) => word.trim());

                    // Si el número de palabras es mayor a 50, recorta el array
                    const trimmedArray = wordsArray.slice(0, 50); // Mantiene solo las primeras 50
                    const resultString = trimmedArray.join(", "); // Reconstruye el string
                    const resultKeywords = resultString.replace(/\./g, "");


                    setTimeout(() => {
                      // Intentamos simular un clic en el contenedor <div> que contiene el <textarea>
                      const divContainer = document.querySelector(
                        ".MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-1wcqu4s"
                      );
                      if (divContainer) {
                        divContainer.click();

                        setTimeout(() => {
                          setValueDescription(photoDB.description);
                          setKeywords(resultKeywords);

                          setValueCategoryOne(photoDB.categoryOne);
                          setValueCategoryTwo(photoDB.categoryTwo);

                        }, 1000);
                      } else {
                        console.log("No se encontró el contenedor <div>.");
                      }
                    }, 100);

                    // Aquí puedes manejar la respuesta del servidor
                  })
                  .catch((error) => {
                    console.error("Error al realizar el fetch:", error);
                  });
              } else {
                console.log(
                  "No se encontró el span con el nombre del archivo."
                );
              }
            }, 1000);
          } catch (error) {
            console.error("Error al manejar el clic:", error);
          }
        });
      });
    } else {
      console.log("No se encontraron elementos clickeables.");
    }
  } catch (error) {
    console.error("Error al inicializar los event listeners:", error);
  }
}

function setTitleAdobe(descriptionPhoto) {
  const textArea = document.querySelector('textarea[name="title"]');

  // Verificamos si se encontró el textarea
  if (textArea) {
    // Asignamos el valor al textarea
    textArea.value = descriptionPhoto;

    // Opcional: simulamos un evento de "input" para que cualquier escuchador de eventos lo detecte
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    textArea.dispatchEvent(event);
  } else {
    console.log("Textarea no encontrado.");
  }
}

function setKeywordsAdobe(keywords) {
  // Seleccionamos el textarea usando su id
  const keywordsTextArea = document.querySelector(
    "textarea#content-keywords-ui-textarea"
  );

  // Verificamos si se encontró el textarea
  if (keywordsTextArea) {
    // Asignamos el valor de palabras clave (word1, word2, word3)
    keywordsTextArea.value = keywords;

    // Opcional: Disparamos un evento de 'input' para que otros escuchadores lo detecten
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    keywordsTextArea.dispatchEvent(event);

    console.log("Valor de palabras clave actualizado a: 'word1, word2, word3'");
  } else {
    console.log("Textarea de palabras clave no encontrado.");
  }
}

function functionAdobeStock() {
  try {
    // Seleccionamos todos los elementos que contienen las imágenes (cada uno tiene la clase 'upload-tile__wrapper')
    const clickableElements = document.querySelectorAll(
      'div[role="option"][aria-selected="false"] .upload-tile__wrapper'
    );

    if (clickableElements.length > 0) {
      clickableElements.forEach((element, index) => {
        // Agregamos un evento de clic a cada uno de los elementos
        element.addEventListener("click", () => {
          // Al hacer clic, mostramos el índice y la información del elemento
          console.log(
            `Clic realizado en el elemento número ${index + 1}:`,
            element
          );

          // Ahora buscamos el popup que se abre dentro de 'asset-sidebar-footer', esperamos un poco para asegurarnos de que aparezca
          setTimeout(() => {
            const assetSidebarFooter = document.querySelector(
              '[data-t="asset-sidebar-footer"]'
            );

            if (assetSidebarFooter) {
              // Dentro de este contenedor, buscamos el div con la clase 'text-sregular' que contiene el nombre original
              const originalNameDiv =
                assetSidebarFooter.querySelector(".text-sregular");

              if (originalNameDiv) {
                // Extraemos el texto que contiene el nombre original (después de "Original name(s):")
                const originalNameText = originalNameDiv.textContent.trim();
                const originalNameMatch = originalNameText.match(
                  /(?:Original name\(s\)|Nombre\/s original\/es):\s*(.+)$/
                );

                if (originalNameMatch && originalNameMatch[1]) {
                  const fileName = originalNameMatch[1];
                  const endpoint = `http://localhost:3000/photos/search?name=${encodeURIComponent(
                    fileName
                  )}`;

                  fetch(endpoint)
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(
                          `Error en la respuesta: ${response.status} ${response.statusText}`
                        );
                      }
                      return response.json(); // Si el endpoint devuelve JSON
                    })
                    .then((data) => {
                      console.log(data);
                      const photoDB = data[0];
                      const wordsArray = photoDB.keywords
                        .split(",")
                        .map((word) => word.trim());

                      const trimmedArray = wordsArray.slice(0, 49); // Mantiene solo las primeras 50
                      const resultString = trimmedArray.join(", "); // Reconstruye el string
                      const resultKeywords = resultString.replace(/\./g, "");
                      setTitleAdobe(photoDB.description);
                      setKeywordsAdobe(resultKeywords);
                    });
                } else {
                  console.log("No se pudo extraer el nombre original.");
                }
              } else {
                console.log("No se encontró el div con el nombre original.");
              }
            } else {
              console.log(
                'No se encontró el contenedor "asset-sidebar-footer"'
              );
            }
          }, 1000); // Esperamos un segundo para que el popup se cargue
        });
      });
    } else {
      console.log("No se encontraron elementos de Adobe Stock.");
    }
  } catch (error) {
    console.error(
      "Error al intentar hacer clic en los elementos de Adobe Stock:",
      error
    );
  }
}

// ****************************************************************
// ******************* START GETTY IMAGES *************************
// ****************************************************************
function setCountryGettyImages() {
  // 1. Referencia al input
  const input = document.querySelector('#metadata-select-country_of_shoot');

  // 2. Hacer focus y escribir "Col"
  input.focus();
  input.value = 'Col';

  // 3. Disparar evento input para que Material UI detecte el cambio
  input.dispatchEvent(new Event('input', { bubbles: true }));

  // 4. Esperar un momento para que el dropdown cargue las opciones
  setTimeout(() => {
    // 5. Buscar el dropdown con opciones (normalmente un <ul> con clases MuiAutocomplete-popper o similar)
    const dropdown = document.querySelector('ul.MuiAutocomplete-listbox');

    if (!dropdown) {
      console.log('No se encontró la lista de opciones');
      return;
    }

    // 6. Buscar la opción que contenga "Colombia"
    const option = Array.from(dropdown.querySelectorAll('li')).find(li =>
      li.textContent.toLowerCase().includes('colombia')
    );

    if (option) {
      // 7. Hacer click para seleccionar
      option.click();
      console.log('Colombia seleccionada');
    } else {
      console.log('Opción Colombia no encontrada');
    }
  }, 1500);
}

function setTitleGettyImages(title) {
  const textarea = document.querySelector('[data-cy="md-headline"] textarea[name="headline"]');
  textarea.focus();
  textarea.click();
  textarea.value = title;
  // Notificamos a React que el valor cambió
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
}

function setDescriptionGettyImages(description) {
  const textarea2 = document.querySelector('[data-cy="md-caption"] textarea[name="caption"]');
  textarea2.focus();
  textarea2.click();
  textarea2.value = description;
  const event2 = new Event('input', { bubbles: true });
  textarea2.dispatchEvent(event2);
}

function setKeywordsGettyImages(keywords) {
  const keywordsInput = document.querySelector('div[data-cy="metadata-keyword-multiselect"] textarea');
  keywordsInput.focus();
  keywordsInput.value = keywords;
  keywordsInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function functionGettyImages() {
  console.log("Listo");

  document.querySelectorAll('[data-cy="item-card"]').forEach(card => {
    card.addEventListener('click', () => {
      const fileName = card.querySelector('[data-cy="contribution-file-name"]')?.textContent?.trim();
      console.log(fileName);

      setTimeout(() => {
        const endpoint = `http://localhost:3000/photos/search?name=${fileName}`;
        fetch(endpoint)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error en la respuesta: ${response.status} ${response.statusText}`
              );
            }
            return response.json(); // Si el endpoint devuelve JSON
          })
          .then((data) => {
            const photo = data[0];
            setTitleGettyImages(photo.title);
            setDescriptionGettyImages(photo.description);
            setKeywordsGettyImages(photo.keywords);

            setCountryGettyImages();

          });
      }, 1000);
    });
  });
}
// ****************************************************************
// ****************** FINISH GETTY IMAGES *************************
// ****************************************************************





// ****************************************************************
// ********************* START DREAMSTIEM *************************
// ****************************************************************

/**
 * Requiere dar click en el Filename o Date del listado de fotos a vender
 * Luego dar click en la foto para redireccionar, tienes 5 segundos para esto
 * Se puede cambiar el tiempo en el setTimeout
 */
function functionDreamsTime() {
  setTimeout(() => {
    document.addEventListener('click', (event) => {
      const item = event.target.closest('.upload-item');
      const fileNameElement = item.querySelector('.js-filenamefull');
      const fileName = fileNameElement?.getAttribute('data-text');

      console.log("filename =>", fileName);
      if (fileName) {
        setTimeout(() => {
          const endpoint = `http://localhost:3000/photos/search?name=${fileName}`;
          fetch(endpoint)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error en la respuesta: ${response.status} ${response.statusText}`
                );
              }
              return response.json(); // Si el endpoint devuelve JSON
            })
            .then((data) => {
              const photo = data[0];
              console.log("Photo => ", photo);

              const titleInput = document.getElementById('title');
              if (titleInput) {
                titleInput.value = photo.title;
              }

              const descriptionTextarea = document.getElementById('description');
              if (descriptionTextarea) {
                descriptionTextarea.value = photo.description;
              }

              const keywordsInput = document.getElementById('keywords_tag');
              if (keywordsInput) {
                keywordsInput.focus();
                keywordsInput.value = photo.keywords;
                keywordsInput.dispatchEvent(new Event('input', { bubbles: true }));

                setTimeout(() => {
                  const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                  });
                  keywordsInput.dispatchEvent(enterEvent);
                }, 100);
              }
            });
        }, 1000);
      }
    });
  }, 100);


}

// ****************************************************************
// ******************** FINISH DREAMSTIME *************************
// ****************************************************************



// ****************************************************************
// ********************* START DEPOSITPHOTOS **********************
// ****************************************************************

function setKeywordsDepositPhotos(keywordsBackend, item) {
  const keywords = keywordsBackend.split(',').map(k => k.trim());
  for (const word of keywords) {
    const inputContainer = item.querySelector('._tagseditor__item.tagseditor__item_new');
    const inputSpan = inputContainer?.querySelector('span[contenteditable="true"]');

    if (!inputSpan) break;

    inputSpan.focus();

    // Limpia el contenido por si quedó algo previo
    inputSpan.textContent = '';
    inputSpan.dispatchEvent(new InputEvent('input', { bubbles: true }));

    // Simula que el usuario escribe la palabra
    inputSpan.textContent = word;
    inputSpan.dispatchEvent(new InputEvent('input', { bubbles: true }));

    // Simula tecla Enter para confirmar el tag
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    inputSpan.dispatchEvent(enterEvent);
  }
}

var lastIdDepositPhotos = '';
/**
 * Se debe de dar click en el input de keywords
 * y luego se selecciona y envia la foto
 */
function functionDepositPhotos() {
  const items = document.querySelectorAll('.itemeditor');
  console.log("Elementos encontrados: ", items.length);

  items.forEach(item => {
    item.addEventListener('click', (event) => {

      const id = item.getAttribute('id');
      if (id === lastIdDepositPhotos) return;
      lastIdDepositPhotos = id;

      const fileNameSpan = item.querySelector('.itemeditor__name');
      if (fileNameSpan) {

        const fileName = fileNameSpan.textContent.trim();
        console.log("Filename =>", fileName);


        const endpoint = `http://localhost:3000/photos/search?name=${fileName}`;
        fetch(endpoint)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error en la respuesta: ${response.status} ${response.statusText}`
              );
            }
            return response.json(); // Si el endpoint devuelve JSON
          })
          .then(async (data) => {
            const photo = data[0];

            // Buscar el textarea dentro del item y asignarle "Hello World"
            const textarea = item.querySelector('textarea.itemeditor__input_description');
            if (textarea) {
              textarea.focus();
              textarea.value = photo.description;

              textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }

            setKeywordsDepositPhotos(photo.keywords, item);
          });
      }
    });
  });
}
// ****************************************************************
// ********************* FINISH DEPOSITPHOTOS **********************
// ****************************************************************



// ****************************************************************
// ********************** START ALAMY *****************************
// ****************************************************************
function setKeywordsAlamy(keywordsImage) {

  const wordsArray = keywordsImage
    .split(',')
    .map(word => word.trim())
    .filter(word => word.length > 0)
    .slice(0, 50);
  const keywordsString = wordsArray.join(', ');

  const keywordInput = document.querySelector('#add-keyword');
  keywordInput.value = keywordsString;

  keywordInput.dispatchEvent(new Event('input', { bubbles: true }));

  // Simulamos la tecla Enter para que se dispare ng-keypress="AddNewKeyword($event);"
  const event = new KeyboardEvent('keypress', {
    bubbles: true,
    cancelable: true,
    key: 'Enter',
    keyCode: 13,
    which: 13
  });
  keywordInput.dispatchEvent(event);
}

function functionAlamy() {
  document.querySelectorAll('li.grid img').forEach(img => {
    img.addEventListener('click', function (e) {
      const li = e.target.closest('li.grid');
      if (!li) return;

      const filenameSpan = li.querySelector('.img_cap');
      console.log('Nombre del archivo:', filenameSpan);

      if (filenameSpan) {
        const fileName = filenameSpan.textContent.trim();

        const endpoint = `http://localhost:3000/photos/search?name=${fileName}`;
        fetch(endpoint)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error en la respuesta: ${response.status} ${response.statusText}`
              );
            }
            return response.json(); // Si el endpoint devuelve JSON
          })
          .then(async (data) => {
            const image = data[0];
            setTimeout(() => {
              const captionTextarea = document.querySelector('textarea[name="captionText"]');
              if (captionTextarea) {
                captionTextarea.value = image.description;

                captionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('Texto insertado en el caption');
              }
              setKeywordsAlamy(image.keywords);
            }, 1000);
          });
      }
    });
  });

  const button = document.getElementById('submitsearch');
  const clearSelectionInput = document.querySelector('#automationClearSelection input.deselect-all');
  if (button) {
    button.addEventListener('click', () => {
      setTimeout(() => {
        clearSelectionInput.click();
      }, 500);
    });
  }


}

// ****************************************************************
// ********************** FINISH ALAMY *****************************
// ****************************************************************




setTimeout(() => {
  const currentDomain = window.location.origin;

  console.log(currentDomain);
  if (currentDomain.includes("submit.shutterstock")) {
    functionShutterstock();
  } else if (currentDomain.includes("contributor.stock.adobe.com")) {
    functionAdobeStock();
  } else if (currentDomain.includes("gettyimages.com")) {
    setTimeout(() => {
      functionGettyImages();
    }, 8000);
  } else if (currentDomain.includes("dreamstime.com")) {
    functionDreamsTime();
  } else if (currentDomain.includes("depositphotos.com")) {
    functionDepositPhotos();
  } else if (currentDomain.includes("alamy.com")) {
    setTimeout(() => {
      functionAlamy();
      console.log("Listo!");

    }, 5000); // Tiempo para dejar la vista de las imagenes para vender
  }
}, 3000);

