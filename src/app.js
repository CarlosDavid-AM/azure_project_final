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

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages", "chat.html"));
});

// Endpoints
const basePath = "/api";

app.use(basePath, router);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en: http://localhost:${PORT}`);
});
