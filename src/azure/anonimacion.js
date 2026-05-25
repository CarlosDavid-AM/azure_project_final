// Ocultar datos sensibles

const suscriptionKey = "";
const endpoint = "";

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

async function anonimizarDatos() {
  try {
    const texto = `Hola mi nombre es Juan Carlos Peres con DNI 45454646. Mi número es 123456789 y vivo en Av. Miraflores 748, Arequipa. Pueden escribirme a juancarlos@gmail.com`;

    const documentoAnonimizar = {
      kind: "PiiEntityRecognition",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: texto,
          },
        ],
      },
      parameters: {
        redactionPolicy: {
          policyKing: "CharacterMask",
          redactionCharacter: "*",
        },
      },
    };

    console.log("Enviando texto a Azure");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentoAnonimizar }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    const data = await response.json();

    if (data.result.erros.length > 0) {
      console.error(data.results.errors);
      return;
    }

    const primerDocumento = data.result.documents[0];
    console.log(primerDocumento);
  } catch (error) {
    console.error(error.message);
  }
}

anonimizarDatos();
