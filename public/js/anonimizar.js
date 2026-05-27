document.addEventListener("DOMContentLoaded", () => {
  const btnAnonimizar = document.getElementById("btn-anonimizar");
  const inputTexto = document.getElementById("input-texto");
  const resultadoBox = document.getElementById("resultado-box");
  const textoAnonimizado = document.getElementById("texto-anonimizado");

  btnAnonimizar.addEventListener("click", async () => {
    const texto = inputTexto.value.trim();

    if (!texto) {
      alert("Por favor, ingresa un texto para anonimizar.");
      return;
    }

    btnAnonimizar.disabled = true;
    btnAnonimizar.textContent = "Procesando...";
    resultadoBox.style.display = "none";

    try {
      const response = await fetch("/api/anonimizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.detalle || "Ocurrió un error en el servidor.",
        );
      }

      const textoFinal = data.resultado.redactedText || data.resultado.text;

      // Mostrar el resultado en pantalla
      textoAnonimizado.textContent = textoFinal;
      resultadoBox.style.display = "block";
    } catch (error) {
      console.error(error);
      alert("Error al anonimizar: " + error.message);
    } finally {
      // Restaurar el botón
      btnAnonimizar.disabled = false;
      btnAnonimizar.textContent = "Ocultar Datos";
    }
  });
});
