import express from "express";
import asuzeService from "../service/asuzeService.js";

const router = express.Router();
const { detectarImagen } = asuzeService();

router.post("/imagen-analisis", detectarImagen);

export default router;
