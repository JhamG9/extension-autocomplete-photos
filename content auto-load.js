try {
    // Intentamos acceder al body con un pequeño retraso
    setTimeout(() => {
      try {
        const targetElement = document.querySelector('body');
        
        console.log("Contenido del body:", targetElement.innerHTML);
  
        if (targetElement) {
          console.log("Elemento body encontrado:", targetElement);
  
          // Intentar simular un clic en el primer elemento con la clase especificada
          const clickableElement = document.querySelector('.o_Card_Card_selectableCard.o_EditorCard_EditorCard_selectableCard');
          if (clickableElement) {
            console.log("Elemento encontrado para simular clic:", clickableElement);
            clickableElement.click(); // Simula un clic en el primer elemento encontrado
            console.log("Clic simulado en el elemento:", clickableElement);
            
            // Esperar un poco para que el siguiente elemento se habilite
            setTimeout(() => {
              // Intentamos simular un clic en el contenedor <div> que contiene el <textarea>
              const divContainer = document.querySelector('.o_input_theme_input.o_Input_Input_input.o_EditorDescription_EditorDescription_description');
              if (divContainer) {
                console.log("Elemento <div> encontrado para clic:", divContainer);
                divContainer.click(); // Simula un clic en el contenedor <div> para enfocarlo
                console.log("Clic simulado en el <div>");
  
                // Ahora buscar el <textarea> dentro del contenedor
                const textAreaElement = divContainer.querySelector('.o_input_theme_inputElement.o_Input_Input_inputElement.o_EditorDescription_EditorDescription_descriptionInput');
                if (textAreaElement) {
                  console.log("Elemento <textarea> encontrado para cambiar valor:", textAreaElement);
  
                  // Simulamos el enfoque del textarea
                  textAreaElement.focus(); // Fuerza el enfoque en el textarea
                  console.log("Texto en el textarea activado.");
  
                  // Asignamos el valor al <textarea>
                  textAreaElement.value = "hola, como estás"; // Establece el nuevo valor en el <textarea>
                  console.log("Nuevo valor asignado al <textarea>");
  
                  // Simulamos el evento input para que el campo sea actualizado correctamente
                  const event = new Event('input', {
                    'bubbles': true,
                    'cancelable': true,
                  });
                  textAreaElement.dispatchEvent(event); // Dispara el evento de entrada
                  console.log("Evento 'input' disparado en el <textarea>");
                } else {
                  console.log("No se encontró el <textarea>.");
                }
              } else {
                console.log("No se encontró el contenedor <div>.");
              }
            }, 4000); // Esperamos 4 segundos para asegurar que el <textarea> esté disponible después de hacer clic en el <div>
          } else {
            console.log("No se encontró un elemento con la clase especificada para hacer clic.");
          }
        } else {
          console.log("No se encontró el body.");
        }
      } catch (error) {
        console.error("Error al acceder al body:", error);
      }
    }, 2000); // Retraso de 2 segundos antes de buscar el <textarea>
  } catch (error) {
    console.error("Error en content.js:", error);
  }
  