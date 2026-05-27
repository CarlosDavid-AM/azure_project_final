function asuzeService() {
  const detectarImagen = async (req, res) => {
    const { url: imageUrl } = req.body;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ error: "Falta el campo 'url' en el cuerpo de la petición." });
    }

    const endpoint = process.env.AZURE_ENDPOINT;
    const suscriptionKey = process.env.SUSCRIPTION_KEY;

    if (!endpoint || !suscriptionKey) {
      return res.status(500).json({
        error:
          "Falta configurar las variables de entorno AZURE_ENDPOINT o SUSCRIPTION_KEY en el servidor.",
      });
    }

    const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

    try {
      const upstream = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": suscriptionKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      const body = await upstream.text();
      const contentType =
        upstream.headers.get("content-type") || "application/json";
      res.status(upstream.status).type(contentType).send(body);
    } catch (error) {
      console.error(`Error analizando imagen: ${error.message}`);
      res.status(500).json({
        error: "No se pudo contactar a Azure Cognitive Services",
        detail: error?.message ?? String(error),
      });
    }
  };

  const chat = async (req, res) => {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res
        .status(400)
        .json({ error: "Falta la pregunta en la petición." });
    }

    const endpointUrl = process.env.AZURE_CHAT_URL_ENDPOINT;
    const token = process.env.TOKEN;

    if (!endpointUrl || !token) {
      return res.status(500).json({
        error:
          "Falta configurar AZURE_CHAT_URL_ENDPOINT o TOKEN en las variables de entorno.",
      });
    }

    const data = {
      model: "Phi-4",
      messages: [
        {
          role: "user",
          content: pregunta,
        },
      ],
    };

    try {
      const upstream = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!upstream.ok) {
        console.error(
          `Error del servicio de Azure: ${upstream.status} ${upstream.statusText}`,
        );
        return res.status(500).json({
          error: "Error de comunicación con el servicio de IA en Azure.",
        });
      }

      const responseData = await upstream.json();
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error al procesar el chat:", error);
      res.status(500).json({ error: "Error interno al procesar la petición." });
    }
  };

  const resumen = async (req, res) => {
    const { texto } = req.body;
    if (!texto) {
      return res.status(400).json({ error: "Falta el texto en la petición." });
    }
    // Servicio FOUNDRY (Azure)
    const suscriptionKey =
      process.env.AZURE_LANGUAGE_KEY ||
      process.env.AZURE_SUBSCRIPTION_KEY ||
      process.env.SUSCRIPTION_KEY;
    const endpoint =
      process.env.AZURE_LANGUAGE_ENDPOINT ||
      "https://ai001427877.services.ai.azure.com";

    // URLs
    const url = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`;

    const cuerpoPeticion = {
      displayName: "Resumir texto",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: texto,
          },
        ],
      },
      tasks: [
        {
          kind: "ExtractiveSummarization",
          taskName: "resumen_invasion",
          parameters: { sentenceCount: 2 },
        },
      ],
    };

    try {
      console.log("Enviando solicitud de resumen...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": suscriptionKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cuerpoPeticion),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en: ${errorData.error.message}`);
      }

      // Hasta este punto, la mitad del trabajo ya está hecha, ahora solo falta esperar a que el servicio procese la solicitud y luego obtener el resultado

      const URLSeguimiento = response.headers.get("operation-location");
      console.log("Solicitud enviada, esperando resultado...");

      // Bucle de espera para obtener el resultado
      let resultadoFinal = null;
      while (true) {
        const respuestaSeguimiento = await fetch(URLSeguimiento, {
          headers: {
            "Ocp-Apim-Subscription-Key": suscriptionKey,
          },
        });

        resultadoFinal = await respuestaSeguimiento.json();
        if (resultadoFinal.status === "succeeded") {
          break;
        }

        if (resultadoFinal.status === "failed") {
          throw new Error("El proceso de resumen ha fallado.");
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      console.log("Resultado generado por la IA");
      const tareaFinalizada = resultadoFinal.tasks.items[0];
      const frasesResumen = tareaFinalizada.results.documents[0].sentences;
      const textoResumido = frasesResumen.map((frase) => frase.text).join(" ");

      // Enviar la respuesta al cliente (Frontend)
      res.status(200).json({
        resumen: textoResumido,
        frases: frasesResumen,
      });
    } catch (error) {
      console.error(error.message);
      // Responder con error al frontend
      res.status(500).json({
        error: "No se pudo procesar el resumen",
        detalle: error.message,
      });
    }
  };

  const anonimizar = async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
      return res
        .status(400)
        .json({ error: "Falta el campo 'texto' en el cuerpo de la petición." });
    }

    const endpoint = process.env.AZURE_ENDPOINT;
    const suscriptionKey = process.env.SUSCRIPTION_KEY;

    if (!endpoint || !suscriptionKey) {
      return res.status(500).json({
        error:
          "Falta configurar las variables de entorno AZURE_ENDPOINT o SUSCRIPTION_KEY en el servidor.",
      });
    }

    const url = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

    try {
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
            policyKind: "CharacterMask",
            redactionCharacter: "*",
          },
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": suscriptionKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentoAnonimizar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error en Azure: ${errorData.error?.message || "Error desconocido"}`);
      }

      const data = await response.json();

      if (data.results?.errors?.length > 0) {
        console.error(data.results.errors);
        return res.status(400).json({ errors: data.results.errors });
      }

      const primerDocumento = data.results.documents[0];
      
      res.status(200).json({
        resultado: primerDocumento,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        error: "No se pudo anonimizar el texto",
        detalle: error.message,
      });
    }
  };

  return {
    detectarImagen,
    chat,
    resumen,
    anonimizar,
  };
}

export default asuzeService;
