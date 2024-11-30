function setValueDescription(description) {
  const divContainer = document.querySelector('.o_input_theme_input.o_Input_Input_input.o_EditorDescription_EditorDescription_description');
  // Ahora buscamos el <textarea> dentro del contenedor
  const textAreaElement = divContainer.querySelector('.o_input_theme_inputElement.o_Input_Input_inputElement.o_EditorDescription_EditorDescription_descriptionInput');
  if (textAreaElement) {
    console.log("Elemento <textarea> encontrado para cambiar valor:", textAreaElement);

    // Simulamos el enfoque del textarea
    textAreaElement.focus(); // Fuerza el enfoque en el textarea
    console.log("Texto en el textarea activado.");

    // Asignamos el valor al <textarea>
    textAreaElement.value = description; // Establece el nuevo valor en el <textarea>
    console.log("Nuevo valor asignado al <textarea>");

    // Simulamos el evento input para que el campo sea actualizado correctamente
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true,
    });
    textAreaElement.dispatchEvent(event);
  }
}

function setKeywords(keywords) {
  const keywordsInput = document.querySelector('.o_input_theme_inputElement.o_Input_Input_inputElement[name="pendingKeywords"]');
  if (keywordsInput) {
    keywordsInput.focus();
    // Asignar el string al valor del input
    keywordsInput.value = keywords;

    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    keywordsInput.dispatchEvent(event);
  }
}

function functionShutterstock() {
  try {
    // Seleccionamos todos los elementos con la clase especificada
    const clickableElements = document.querySelectorAll('.o_Card_Card_selectableCard.o_EditorCard_EditorCard_selectableCard');
    console.log(`Elementos encontrados: ${clickableElements.length}`);

    if (clickableElements.length > 0) {
      // Iteramos sobre cada elemento para agregar el evento click
      clickableElements.forEach((clickableElement) => {
        clickableElement.addEventListener('click', function () {
          try {
            console.log("Elemento clickeado: ", this);

            const spanElement = this.querySelector('span.o_List_List_itemText.o_list_theme_itemText.o_List_List_primary.o_list_theme_primary.o_EditorCard_EditorCard_itemTitle div');
            if (spanElement) {
              let fileName = spanElement.textContent.trim(); // Obtenemos el texto y eliminamos espacios innecesarios
              // Esperamos un poco para asegurarnos de que el siguiente elemento se habilite
              console.log(fileName);
              const endpoint = `http://localhost:3000/photos/search?name=${encodeURIComponent(fileName)}`;
              console.log("Llamando al endpoint:", endpoint);

              fetch(endpoint)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
                  }
                  return response.json(); // Si el endpoint devuelve JSON
                })
                .then(data => {
                  const photoDB = data[0];

                  const wordsArray = photoDB.keywords.split(',').map(word => word.trim());

                  // Si el número de palabras es mayor a 50, recorta el array
                  const trimmedArray = wordsArray.slice(0, 50); // Mantiene solo las primeras 50
                  const resultString = trimmedArray.join(', '); // Reconstruye el string
                  const resultKeywords = resultString.replace(/\./g, '');

                  setTimeout(() => {
                    // Intentamos simular un clic en el contenedor <div> que contiene el <textarea>
                    const divContainer = document.querySelector('.o_input_theme_input.o_Input_Input_input.o_EditorDescription_EditorDescription_description');
                    if (divContainer) {
                      divContainer.click();

                      setTimeout(() => {
                        setValueDescription(photoDB.description);
                        setKeywords(resultKeywords);
                      }, 1000);
                    } else {
                      console.log("No se encontró el contenedor <div>.");
                    }
                  }, 0);

                  // Aquí puedes manejar la respuesta del servidor
                })
                .catch(error => {
                  console.error("Error al realizar el fetch:", error);
                });
            } else {
              console.log("No se encontró el span con el nombre del archivo.");
            }
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
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true,
    });
    textArea.dispatchEvent(event);
  } else {
    console.log("Textarea no encontrado.");
  }
}

function setKeywordsAdobe(keywords) {
  // Seleccionamos el textarea usando su id
  const keywordsTextArea = document.querySelector('textarea#content-keywords-ui-textarea');

  // Verificamos si se encontró el textarea
  if (keywordsTextArea) {
    // Asignamos el valor de palabras clave (word1, word2, word3)
    keywordsTextArea.value = keywords;

    // Opcional: Disparamos un evento de 'input' para que otros escuchadores lo detecten
    const event = new Event('input', {
      'bubbles': true,
      'cancelable': true,
    });
    keywordsTextArea.dispatchEvent(event);

    console.log("Valor de palabras clave actualizado a: 'word1, word2, word3'");
  } else {
    console.log("Textarea de palabras clave no encontrado.");
  }
}

setTimeout(() => {
  const currentDomain = window.location.origin;

  if (currentDomain.includes('submit.shutterstock')) {
    functionShutterstock();
  } else if (currentDomain.includes('contributor.stock.adobe.com')) {
    try {
      // Seleccionamos todos los elementos que contienen las imágenes (cada uno tiene la clase 'upload-tile__wrapper')
      const clickableElements = document.querySelectorAll('div[role="option"][aria-selected="false"] .upload-tile__wrapper');

      if (clickableElements.length > 0) {
        clickableElements.forEach((element, index) => {
          // Agregamos un evento de clic a cada uno de los elementos
          element.addEventListener('click', () => {
            // Al hacer clic, mostramos el índice y la información del elemento
            console.log(`Clic realizado en el elemento número ${index + 1}:`, element);

            // Ahora buscamos el popup que se abre dentro de 'asset-sidebar-footer', esperamos un poco para asegurarnos de que aparezca
            setTimeout(() => {
              const assetSidebarFooter = document.querySelector('[data-t="asset-sidebar-footer"]');

              if (assetSidebarFooter) {
                // Dentro de este contenedor, buscamos el div con la clase 'text-sregular' que contiene el nombre original
                const originalNameDiv = assetSidebarFooter.querySelector('.text-sregular');

                if (originalNameDiv) {
                  // Extraemos el texto que contiene el nombre original (después de "Original name(s):")
                  const originalNameText = originalNameDiv.textContent.trim();
                  const originalNameMatch = originalNameText.match(/Original name\(s\):\s*(.*)/);

                  if (originalNameMatch && originalNameMatch[1]) {
                    const fileName = originalNameMatch[1];
                    const endpoint = `http://localhost:3000/photos/search?name=${encodeURIComponent(fileName)}`;

                    fetch(endpoint)
                      .then(response => {
                        if (!response.ok) {
                          throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
                        }
                        return response.json(); // Si el endpoint devuelve JSON
                      })
                      .then(data => {
                        console.log(data)
                        const photoDB = data[0];
                        const wordsArray = photoDB.keywords.split(',').map(word => word.trim());

                        const trimmedArray = wordsArray.slice(0, 49); // Mantiene solo las primeras 50
                        const resultString = trimmedArray.join(', '); // Reconstruye el string
                        const resultKeywords = resultString.replace(/\./g, '');
                        setTitleAdobe(photoDB.description);
                        setKeywordsAdobe(resultKeywords);
                      });


                  } else {
                    console.log('No se pudo extraer el nombre original.');
                  }
                } else {
                  console.log('No se encontró el div con el nombre original.');
                }
              } else {
                console.log('No se encontró el contenedor "asset-sidebar-footer"');
              }
            }, 1000); // Esperamos un segundo para que el popup se cargue
          });
        });
      } else {
        console.log("No se encontraron elementos de Adobe Stock.");
      }
    } catch (error) {
      console.error("Error al intentar hacer clic en los elementos de Adobe Stock:", error);
    }
  }
}, 2000);


