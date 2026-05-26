import express from "express";
import asuzeService from "../service/asuzeService.js";

const router = express.Router();
const { detectarImagen, chat, resumen } = asuzeService();

const basePath = "/api";

router.post(`${basePath}/imagen-analisis`, detectarImagen);
router.post(`${basePath}/chat`, chat);
router.post(`${basePath}/resumen`, resumen);

export default router;
