
setTimeout(() => {
    try {
        // Intentamos acceder al elemento después de que el DOM esté completamente cargado
        // SOLO CARGA EL PRIMERO
        const clickableElement = document.querySelector('.o_Card_Card_selectableCard.o_EditorCard_EditorCard_selectableCard');
        console.log(clickableElement);
        if (clickableElement) {
          // Agregar el evento de clic
          clickableElement.addEventListener('click', function() {
            try {
              console.log("Elemento clickeado: ", this);
    
              // Esperamos un poco para asegurarnos de que el siguiente elemento se habilite
              setTimeout(() => {
                // Intentamos simular un clic en el contenedor <div> que contiene el <textarea>
                const divContainer = document.querySelector('.o_input_theme_input.o_Input_Input_input.o_EditorDescription_EditorDescription_description');
                if (divContainer) {
                  console.log("Contenedor <div> encontrado para clic:", divContainer);
                  divContainer.click(); // Simula un clic en el contenedor <div> para enfocarlo
                  console.log("Clic simulado en el <div>");
    
                  // Ahora buscamos el <textarea> dentro del contenedor
                  const textAreaElement = divContainer.querySelector('.o_input_theme_inputElement.o_Input_Input_inputElement.o_EditorDescription_EditorDescription_descriptionInput');
                  if (textAreaElement) {
                    console.log("Elemento <textarea> encontrado para cambiar valor:", textAreaElement);
    
                    // Simulamos el enfoque del textarea
                    textAreaElement.focus(); // Fuerza el enfoque en el textarea
                    console.log("Texto en el textarea activado.");
    
                    // Asignamos el valor al <textarea>
                    textAreaElement.value = "Esta imagen tiene cinco palabras como minimo"; // Establece el nuevo valor en el <textarea>
                    console.log("Nuevo valor asignado al <textarea>");
    
                    // Simulamos el evento input para que el campo sea actualizado correctamente
                    const event = new Event('input', {
                      'bubbles': true,
                      'cancelable': true,
                    });
                    textAreaElement.dispatchEvent(event); // Dispara el evento de entrada
                    console.log("Evento 'input' disparado en el <textarea>");



                    const locationInput = document.querySelector('.o_input_theme_inputElement.o_Input_Input_inputElement.o_EditorLocation_EditorLocation_locationInput');
                    if (locationInput) {
                        console.log("Input encontrado:", locationInput);
                        
                        // Establecer el valor del input
                        locationInput.value = "Bogotá, Bogota, Colombia";
                        console.log("Valor asignado:", locationInput.value);

                        // Crear y disparar el evento 'input' para simular que el usuario lo ha ingresado
                        const event = new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        locationInput.dispatchEvent(event);
                        console.log("Evento 'input' disparado.");
                    } else {
                        console.log("No se encontró el input.");
                    }
                  } else {
                    console.log("No se encontró el <textarea>.");
                  }
                } else {
                  console.log("No se encontró el contenedor <div>.");
                }
              }, 4000); // Esperamos 4 segundos para asegurar que el <textarea> esté disponible después de hacer clic en el <div>
    
            } catch (error) {
              console.error("Error al manejar el clic:", error);
            }
          });
        } else {
          console.log("No se encontró el elemento clickeable.");
        }
    
      } catch (error) {
        console.error("Error al inicializar el event listener:", error);
      }
}, 2000);
  console.log("Listo");
  