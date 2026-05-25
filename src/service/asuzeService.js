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
      return res.status(400).json({ error: "Falta la pregunta en la petición." });
    }

    const endpointUrl = process.env.AZURE_CHAT_URL_ENDPOINT;
    const token = process.env.TOKEN;

    if (!endpointUrl || !token) {
      return res.status(500).json({
        error: "Falta configurar AZURE_CHAT_URL_ENDPOINT o TOKEN en las variables de entorno.",
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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!upstream.ok) {
        console.error(`Error del servicio de Azure: ${upstream.status} ${upstream.statusText}`);
        return res.status(500).json({ error: "Error de comunicación con el servicio de IA en Azure." });
      }

      const responseData = await upstream.json();
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error al procesar el chat:", error);
      res.status(500).json({ error: "Error interno al procesar la petición." });
    }
  };

  return {
    detectarImagen,
    chat,
  };
}

export default asuzeService;
