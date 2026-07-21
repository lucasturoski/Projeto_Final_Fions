import express from "express";
import Estoque from "../models/Estoque.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const estoque = await Estoque.find();
        res.json(estoque);
    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

export default router;