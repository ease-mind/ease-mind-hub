import { Router } from "express";
import {
	createTask,
	deleteTask,
	getAllTasks,
	getTaskById,
	updateTask
} from "../controllers/taskController";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router.get("/", validateToken, getAllTasks);
router.get("/:id", validateToken, getTaskById);
router.post("/", validateToken, createTask);
router.patch("/:id", validateToken, updateTask);
router.delete("/:id", validateToken, deleteTask);

export default router;
