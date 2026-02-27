import { Router } from "express";
import authRoutes from "./authRoutes";
import cognitiveSettingsRoutes from "./cognitiveSettingsRoutes";
import symptomRoutes from "./symptomRoutes";
import taskRoutes from "./taskRoutes";
import userRoutes from "./userRoutes";
import userSymptomRoutes from "./userSymptomRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/symptoms", symptomRoutes);
router.use("/user-symptoms", userSymptomRoutes);
router.use("/tasks", taskRoutes);
router.use("/cognitive-settings", cognitiveSettingsRoutes);

export default router;
