import { Schema, model } from "mongoose";

export interface ISubtask {
	id: string;
	title: string;
	completed: boolean;
}

export interface ITask {
	userId: string;
	id: string;
	title: string;
	description: string;
	category: string;
	priority: "low" | "medium" | "high";
	status: "todo" | "in-progress" | "done";
	estimatedMinutes: number;
	subtasks: ISubtask[];
	createdAt: string;
	updatedAt: string;
}

const subtaskSchema = new Schema<ISubtask>(
	{
		id: { type: String, required: true },
		title: { type: String, required: true },
		completed: { type: Boolean, default: false }
	},
	{ _id: false }
);

const taskSchema = new Schema<ITask>(
	{
		userId: { type: String, required: true, index: true },
		id: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, default: "" },
		category: { type: String, default: "Rotina" },
		priority: {
			type: String,
			required: true,
			enum: ["low", "medium", "high"],
			default: "medium"
		},
		status: {
			type: String,
			required: true,
			enum: ["todo", "in-progress", "done"],
			default: "todo"
		},
		estimatedMinutes: { type: Number, default: 0 },
		subtasks: { type: [subtaskSchema], default: [] }
	},
	{
		timestamps: true
	}
);

taskSchema.index({ userId: 1, id: 1 }, { unique: true });

const Task = model<ITask>("Task", taskSchema);

export default Task;
