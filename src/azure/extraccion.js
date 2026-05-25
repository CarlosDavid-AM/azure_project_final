const suscriptionKey = "";
const endpoint = "";

const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

async function extraerDatos() {
  try {
    const texto = `El ingeniero Carlos Mendoza del equipo de TI corrdinó la compra de Autos Nova en Lima el pasado 12 de mayo del 2026`;

    const documentoProcsar = {
      kind: "EntityRecognition",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: texto,
          },
        ],
      },
    };

    console.log("Enviando texto a Azure");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentoProcsar }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    const data = await response.json();

    if (data.errors > 0) {
      console.log(data.errors);
      return;
    }

    const primerDocumento = data.results.documents[0];
    // documentos.forEach((doc) => {
    //   console.log(doc.entities.category);
    // });

    // console.log(documentos[0])
    primerDocumento.entities.forEach((doc) => {
      if (doc.category === "DateTime") {
        console.log(doc);
      }
    });

    // La empresa para la que desarrolla, solo quiere obtener las fechas de esta conversacion
  } catch (error) {
    console.error(error.message);
  }
}

extraerDatos();
