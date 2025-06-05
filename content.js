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

setTimeout(() => {
  const currentDomain = window.location.origin;

  if (currentDomain.includes("submit.shutterstock")) {
    functionShutterstock();
  } else if (currentDomain.includes("contributor.stock.adobe.com")) {
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
                    /Original name\(s\):\s*(.*)/
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
}, 3000);
