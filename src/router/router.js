import express from "express";
import detectarImagen from "../service/asuzeService.js";

const router = express.Router();

router.post("/juegos", detectarImagen);

export default router;