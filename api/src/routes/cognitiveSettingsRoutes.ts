import { Router } from "express";
import {
	getCognitiveSettings,
	resetCognitiveSettings,
	updateCognitiveSettings
} from "../controllers/cognitiveSettingsController";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router.get("/", validateToken, getCognitiveSettings);
router.put("/", validateToken, updateCognitiveSettings);
router.post("/reset", validateToken, resetCognitiveSettings);

export default router;
