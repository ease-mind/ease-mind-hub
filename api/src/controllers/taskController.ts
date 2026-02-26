import { Request, Response } from "express";
import Task from "../models/taskModel";

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toTaskResponse(doc: any) {
	return {
		id: doc.id,
		title: doc.title,
		description: doc.description,
		priority: doc.priority,
		status: doc.status,
		estimatedMinutes: doc.estimatedMinutes,
		subtasks: doc.subtasks,
		createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
		updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
	};
}

export const getAllTasks = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).lean();
		return res.status(200).json(tasks.map(toTaskResponse));
	} catch (error) {
		console.error("Erro ao buscar tarefas:", error);
		return res.status(500).json({ message: "Erro ao buscar tarefas" });
	}
};

export const getTaskById = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		const { id } = req.params;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const task = await Task.findOne({ userId, id }).lean();
		if (!task) {
			return res.status(404).json({ message: "Tarefa não encontrada" });
		}
		return res.status(200).json(toTaskResponse(task));
	} catch (error) {
		console.error("Erro ao buscar tarefa:", error);
		return res.status(500).json({ message: "Erro ao buscar tarefa" });
	}
};

export const createTask = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const { title, description, priority, status, estimatedMinutes, subtasks } = req.body;
		if (!title) {
			return res.status(400).json({ message: "Título da tarefa é obrigatório" });
		}
		const now = new Date();
		const task = await Task.create({
			userId,
			id: generateId(),
			title,
			description: description || "",
			priority: priority || "medium",
			status: status || "todo",
			estimatedMinutes: estimatedMinutes || 0,
			subtasks: subtasks || [],
			createdAt: now,
			updatedAt: now
		});
		return res.status(201).json(toTaskResponse(task));
	} catch (error) {
		console.error("Erro ao criar tarefa:", error);
		return res.status(500).json({ message: "Erro ao criar tarefa" });
	}
};

export const updateTask = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		const { id } = req.params;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const task = await Task.findOne({ userId, id });
		if (!task) {
			return res.status(404).json({ message: "Tarefa não encontrada" });
		}
		const { title, description, priority, status, estimatedMinutes, subtasks } = req.body;
		if (title !== undefined) task.title = title;
		if (description !== undefined) task.description = description;
		if (priority !== undefined) task.priority = priority;
		if (status !== undefined) task.status = status;
		if (estimatedMinutes !== undefined) task.estimatedMinutes = estimatedMinutes;
		if (subtasks !== undefined) task.subtasks = subtasks;
		const updatedTask = await task.save();
		return res.status(200).json(toTaskResponse(updatedTask));
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
		return res.status(500).json({ message: "Erro ao atualizar tarefa" });
	}
};

export const deleteTask = async (req: Request, res: Response): Promise<any> => {
	try {
		const userId = req.userId;
		const { id } = req.params;
		if (!userId) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}
		const deleted = await Task.findOneAndDelete({ userId, id });
		if (!deleted) {
			return res.status(404).json({ message: "Tarefa não encontrada" });
		}
		return res.status(200).json({ message: "Tarefa deletada com sucesso" });
	} catch (error) {
		console.error("Erro ao deletar tarefa:", error);
		return res.status(500).json({ message: "Erro ao deletar tarefa" });
	}
};
