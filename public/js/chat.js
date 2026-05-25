document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-chat");
  const inputPregunta = document.getElementById("input-pregunta");
  const chatBox = document.getElementById("chat-box");
  const btnEnviar = form.querySelector("button");

  // Función para agregar un mensaje al chat
  const agregarMensaje = (texto, remitente) => {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("mensaje", remitente);

    const p = document.createElement("p");

    // Agregamos un prefijo para identificar quién habla
    const prefix = remitente === "usuario" ? "Tú: " : "IA: ";
    p.innerHTML = `<strong>${prefix}</strong>${texto}`;

    divMensaje.appendChild(p);
    chatBox.appendChild(divMensaje);

    // Hacer scroll automático hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  const enviarPregunta = async () => {
    const pregunta = inputPregunta.value.trim();
    if (!pregunta) return;

    // Mostrar el mensaje del usuario en la pantalla
    agregarMensaje(pregunta, "usuario");

    // Limpiar el input
    inputPregunta.value = "";

    // Deshabilitar botón mientras carga
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Pensando...";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pregunta }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      // La estructura de respuesta típica de Azure/OpenAI
      if (data && data.choices && data.choices.length > 0) {
        const respuestaIA = data.choices[0].message.content;
        agregarMensaje(respuestaIA, "ia");
      } else {
        agregarMensaje("No se recibió una respuesta válida de la IA.", "ia");
      }
    } catch (error) {
      console.error("Error al enviar la pregunta:", error);
      agregarMensaje(
        "Ocurrió un error al intentar conectarse con el servidor.",
        "ia",
      );
    } finally {
      // Restaurar el botón
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar";
    }
  };

  btnEnviar.addEventListener("click", enviarPregunta);

  // También escuchar cuando se presione "Enter" en el input
  inputPregunta.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      enviarPregunta();
    }
  });
});
