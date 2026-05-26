document.addEventListener("DOMContentLoaded", () => {
  const btnResumir = document.getElementById("btn-resumir");
  const inputTexto = document.getElementById("input-texto");
  const resultadoBox = document.getElementById("resultado-box");
  const textoResumidoEl = document.getElementById("texto-resumido");

  btnResumir.addEventListener("click", async () => {
    const texto = inputTexto.value.trim();

    if (!texto) {
      alert("Por favor, ingresa el texto que deseas resumir.");
      return;
    }

    // Cambiar estado del botón mientras carga
    btnResumir.textContent = "Resumiendo...";
    btnResumir.disabled = true;
    resultadoBox.style.display = "none";
    textoResumidoEl.textContent = "";

    try {
      const response = await fetch("/api/resumen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar la solicitud.");
      }

      // Mostrar el resultado
      textoResumidoEl.textContent = data.resumen;
      resultadoBox.style.display = "block";
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      // Restaurar el estado del botón
      btnResumir.textContent = "Resumir Texto";
      btnResumir.disabled = false;
    }
  });
});
