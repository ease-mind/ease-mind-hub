import {
	ArrowForward as ArrowForwardIcon,
	SubdirectoryArrowRight as SubArrowIcon,
	Timer as TimerIcon
} from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { Task, priorityColor, priorityLabel } from "../../../repositories/tasks";

interface TaskCardProps {
	task: Task;
	isSimple: boolean;
	isDarkMode: boolean;
	cardBg: string;
	borderColor: string;
	textPrimary?: string;
	textSecondary?: string;
	onDragStart: () => void;
	onFocus: () => void;
	onMoveNext?: () => void;
}

export function TaskCard({
	task,
	isSimple,
	isDarkMode,
	cardBg,
	borderColor,
	textPrimary,
	textSecondary,
	onDragStart,
	onFocus,
	onMoveNext
}: TaskCardProps) {
	const completedSubs = task.subtasks.filter(s => s.completed).length;
	const isDone = task.status === "done";

	return (
		<Box
			className={`task-card ${isDone ? "task-card--done" : ""}`}
			draggable
			onDragStart={onDragStart}
			onClick={onFocus}
			tabIndex={0}
			sx={{ background: cardBg, borderColor }}
		>
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<Typography
					variant="body2"
					fontWeight={600}
					sx={
						isDone
							? {
									textDecoration: "line-through",
									color: isDarkMode ? "#FFB5BD" : "#999"
								}
							: { color: textPrimary }
					}
				>
					{task.title}
				</Typography>
				{!isSimple && (
					<Chip
						label={priorityLabel(task.priority)}
						size="small"
						sx={{
							backgroundColor: priorityColor(task.priority),
							color: "#fff",
							fontWeight: 600,
							fontSize: "0.65rem",
							height: "1.25rem"
						}}
					/>
				)}
			</Box>
			{!isSimple && (
				<>
					<Box display="flex" alignItems="center" gap="4px">
						<TimerIcon
							sx={{ fontSize: "0.8rem", color: isDarkMode ? "#FFB5BD" : "#9ca3af" }}
						/>
						<Typography variant="caption" color={textSecondary}>
							{task.estimatedMinutes} min
						</Typography>
					</Box>
					{task.subtasks.length > 0 && (
						<Box display="flex" alignItems="center" gap="4px">
							<SubArrowIcon sx={{ fontSize: "0.8rem", color: "#ff4353" }} />
							<Typography variant="caption" color="#ff4353">
								{isDone
									? `${task.subtasks.length} subtarefas concluídas`
									: `${completedSubs} de ${task.subtasks.length} subtarefas`}
							</Typography>
						</Box>
					)}
				</>
			)}
			{onMoveNext && !isDone && (
				<Box display="flex" justifyContent="flex-end" mt="4px">
					<IconButton
						size="small"
						onClick={e => {
							e.stopPropagation();
							onMoveNext();
						}}
						title="Mover para próximo status"
					>
						<ArrowForwardIcon
							fontSize="small"
							sx={{ color: isDarkMode ? "#FFB5BD" : undefined }}
						/>
					</IconButton>
				</Box>
			)}
		</Box>
	);
}
