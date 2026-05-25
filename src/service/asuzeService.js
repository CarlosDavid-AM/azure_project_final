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

  return {
    detectarImagen,
  };
}

export default asuzeService;
