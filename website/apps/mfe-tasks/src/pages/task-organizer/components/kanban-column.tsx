import { Box, Chip, Typography } from "@mui/material";
import { Task, TaskStatus } from "../../../repositories/tasks";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
	title: string;
	count: number;
	status: TaskStatus;
	tasks: Task[];
	isSimple: boolean;
	isDarkMode: boolean;
	colBg: string;
	cardBg: string;
	borderColor: string;
	textPrimary?: string;
	textSecondary?: string;
	onDragStart: (id: string) => void;
	onDrop: (status: TaskStatus) => void;
	onFocus: (task: Task) => void;
	onMove: (id: string, status: TaskStatus) => void;
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
	todo: "in-progress",
	"in-progress": "done",
	done: null
};

export function KanbanColumn({
	title,
	count,
	status,
	tasks,
	isSimple,
	isDarkMode,
	colBg,
	cardBg,
	borderColor,
	textPrimary,
	textSecondary,
	onDragStart,
	onDrop,
	onFocus,
	onMove
}: KanbanColumnProps) {
	const chipBg =
		status === "todo"
			? isDarkMode
				? "rgba(255,255,255,0.08)"
				: "#f3f4f6"
			: status === "in-progress"
				? isDarkMode
					? "rgba(255,67,83,0.12)"
					: "#fef2f2"
				: isDarkMode
					? "rgba(76,175,80,0.12)"
					: "#e8f5e9";

	return (
		<Box
			className="kanban-col"
			sx={{ background: colBg }}
			onDragOver={e => e.preventDefault()}
			onDrop={() => onDrop(status)}
		>
			<Box className="kanban-col__header">
				<Typography variant="subtitle2" fontWeight={700} color={textPrimary}>
					{title}
				</Typography>
				<Chip
					label={count}
					size="small"
					sx={{ fontWeight: 700, backgroundColor: chipBg, color: textPrimary }}
				/>
			</Box>
			<Box className="kanban-col__cards">
				{tasks.map(task => (
					<TaskCard
						key={task.id}
						task={task}
						isSimple={isSimple}
						isDarkMode={isDarkMode}
						cardBg={cardBg}
						borderColor={borderColor}
						textPrimary={textPrimary}
						textSecondary={textSecondary}
						onDragStart={() => onDragStart(task.id)}
						onFocus={() => onFocus(task)}
						onMoveNext={
							NEXT_STATUS[status]
								? () => onMove(task.id, NEXT_STATUS[status]!)
								: undefined
						}
					/>
				))}
			</Box>
		</Box>
	);
}
