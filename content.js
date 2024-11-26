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

setTimeout(() => {
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
}, 2000);


