import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import router from "./router/router.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON - DEBE estar al principio
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, HEAD, PUT, PATCH, DELETE",
    credentials: true,
  }),
);

// Servir archivos estáticos de frontend
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src", "index.html"));
});

app.get("/imagen", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages", "imagen.html"));
});

// Endpoints
const basePath = "/api";

app.use(basePath, router);


// Analizar imagen con IA
app.post("/api/vision/analyze", async (req, res) => {
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
  } catch (err) {
    res.status(500).json({
      error: "No se pudo contactar a Azure Cognitive Services",
      detail: err?.message ?? String(err),
    });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en: http://localhost:${PORT}`);
});
