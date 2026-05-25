import express from "express";
import asuzeService from "../service/asuzeService.js";

const router = express.Router();
const { detectarImagen, chat } = asuzeService();

const basePath = "/api";

router.post(`${basePath}/imagen-analisis`, detectarImagen);
router.post(`${basePath}/chat`, chat);

export default router;
