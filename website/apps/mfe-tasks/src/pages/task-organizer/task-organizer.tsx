import {
	CheckCircle as CheckCircleIcon,
	DeleteOutline as DeleteIcon,
	TrackChanges as FocusBadgeIcon,
	ViewKanban as KanbanIcon,
	Timer as TimerIcon,
	RadioButtonUnchecked as UncheckedIcon
} from "@mui/icons-material";
import {
	Box,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	LinearProgress,
	Typography
} from "@mui/material";
import type { SnackbarData } from "@repo/ui";
import { EasemindButton, EasemindSnackbar } from "@repo/ui";
import { useTheme } from "@repo/utils";
import { useCognitiveSettings } from "@repo/data-access";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTimer } from "../../hooks/use-focus-timer/use-focus-timer";
import { useTasks } from "../../hooks/use-tasks/use-tasks";
import { NewTaskModal } from "../../modals/new-task-modal/new-task-modal";
import { Task, TaskStatus, priorityColor, priorityLabel } from "../../repositories/tasks";
import {
	CognitiveAlertModal,
	KanbanColumn,
	StatisticsPanel,
	TimerPanel,
	TipsPanel
} from "./components";
import { FOCUS_TIPS, GENERAL_TIPS } from "./constants/tips";
import "./task-organizer.scss";

function TaskOrganizerPage() {
	const { colors, isDarkMode } = useTheme();
	const { settings } = useCognitiveSettings();
	const isSimple = settings.complexity === "simple";

	const {
		todoTasks,
		inProgressTasks,
		doneTasks,
		totalTasks,
		completedCount,
		loading,
		createTask,
		updateTask,
		deleteTask,
		moveTask
	} = useTasks();

	const timer = useFocusTimer(15);

	const [modalOpen, setModalOpen] = useState(false);
	const [focusTask, setFocusTask] = useState<Task | null>(null);
	const [focusModeActive, setFocusModeActive] = useState(false);
	const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [cogAlertOpen, setCogAlertOpen] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const cogAlertFiredRef = useRef(false);
	const focusStartRef = useRef<number>(0);
	const draggedTaskRef = useRef<string | null>(null);

	useEffect(() => {
		if (!settings.alertsEnabled || !focusModeActive) return;

		const thresholdMs = settings.alertIntervalMinutes * 60 * 1000;

		const id = setInterval(() => {
			if (cogAlertFiredRef.current) return;
			const elapsed = Date.now() - focusStartRef.current;
			if (elapsed >= thresholdMs) {
				cogAlertFiredRef.current = true;
				setSnackbar({
					status: "warning",
					message: `Você está focado há ${settings.alertIntervalMinutes} minutos. Considere fazer uma pausa!`
				});
				setSnackbarOpen(true);
				setCogAlertOpen(true);
			}
		}, 1_000);

		return () => clearInterval(id);
	}, [focusModeActive, settings.alertsEnabled, settings.alertIntervalMinutes]);

	const handleCreateTask = useCallback(
		async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
			await createTask(data);
			setSnackbar({ status: "success", message: "Tarefa criada com sucesso!" });
			setSnackbarOpen(true);
		},
		[createTask]
	);

	const handleDragStart = (taskId: string) => {
		draggedTaskRef.current = taskId;
	};

	const handleDrop = async (status: TaskStatus) => {
		if (draggedTaskRef.current) {
			await moveTask(draggedTaskRef.current, status);
			draggedTaskRef.current = null;
		}
	};

	const handleEnterFocus = (task: Task) => {
		setFocusTask(task);
		setFocusModeActive(true);
		cogAlertFiredRef.current = false;
		focusStartRef.current = Date.now();
	};

	const handleExitFocus = () => {
		setFocusModeActive(false);
		timer.reset();
		cogAlertFiredRef.current = false;
	};

	const handleToggleSubtask = async (task: Task, subtaskId: string) => {
		const updated = task.subtasks.map(st =>
			st.id === subtaskId ? { ...st, completed: !st.completed } : st
		);
		const result = await updateTask(task.id, { subtasks: updated });
		if (focusTask?.id === task.id) setFocusTask(result);
	};

	const handleCompleteTask = async () => {
		if (!focusTask) return;
		await moveTask(focusTask.id, "done");
		const allDone = focusTask.subtasks.map(s => ({ ...s, completed: true }));
		await updateTask(focusTask.id, { subtasks: allDone });
		setSnackbar({ status: "success", message: "Tarefa concluída com sucesso!" });
		setSnackbarOpen(true);
		handleExitFocus();
	};

	const handleDeleteTask = () => {
		if (!focusTask) return;
		setDeleteConfirmOpen(true);
	};

	const confirmDeleteTask = async () => {
		if (!focusTask) return;
		setDeleteConfirmOpen(false);
		await deleteTask(focusTask.id);
		setSnackbar({ status: "success", message: "Tarefa excluída com sucesso!" });
		setSnackbarOpen(true);
		handleExitFocus();
	};

	const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

	if (focusModeActive && focusTask) {
		const completedSubs = focusTask.subtasks.filter(s => s.completed).length;
		const totalSubs = focusTask.subtasks.length;
		const taskProgress = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

		return (
			<Box className="task-page" sx={{ background: colors.background }}>
				<Box
					className="focus-badge"
					sx={{ background: colors["background.card"], border: `1px solid ${colors["coral.100"]}` }}
				>
					<FocusBadgeIcon sx={{ color: colors["coral.500"], fontSize: "1.25rem" }} />
					<Typography variant="body2" fontWeight={600} color={colors.text}>
						Modo Foco Ativado
					</Typography>
				</Box>

				<Typography variant="h4" fontWeight={700} textAlign="center" color={colors.text}>
					Concentre-se no que importa
				</Typography>
				<Typography variant="body2" color={colors["coral.800"]} textAlign="center">
					Uma tarefa de cada vez, sem distrações
				</Typography>

				<Box className="focus-layout">
					<Box
						className="focus-task-card"
						sx={{ background: colors["background.card"], border: `1px solid ${colors["coral.100"]}` }}
					>
						<Box display="flex" gap={1} alignItems="center" mb={1}>
							<Chip
								label={priorityLabel(focusTask.priority)}
								size="small"
								sx={{
									backgroundColor: priorityColor(focusTask.priority),
									color: "#fff",
									fontWeight: 600
								}}
							/>
							<Box display="flex" alignItems="center" gap="4px">
								<TimerIcon
									sx={{
										fontSize: "0.875rem",
										color: colors["coral.800"]
									}}
								/>
								<Typography variant="caption" color={colors["coral.800"]}>
									{focusTask.estimatedMinutes} min
								</Typography>
							</Box>
						</Box>

						<Typography variant="h5" fontWeight={700} color={colors.text}>
							{focusTask.title}
						</Typography>
						<Typography variant="body2" color={colors["coral.800"]} mb={2}>
							{focusTask.description}
						</Typography>

						{focusTask.subtasks.length > 0 && (
							<>
								<Box
									display="flex"
									justifyContent="space-between"
									alignItems="center"
									mb="4px"
								>
									<Typography
										variant="body2"
										fontWeight={600}
										color={colors.text}
									>
										Progresso da Tarefa
									</Typography>
									<Typography
										variant="body2"
										fontWeight={600}
										color={colors["coral.500"]}
									>
										{taskProgress}%
									</Typography>
								</Box>
								<LinearProgress
									variant="determinate"
									value={taskProgress}
									sx={{
										height: 8,
										borderRadius: 4,
										backgroundColor: colors["coral.100"],
										"& .MuiLinearProgress-bar": {
											backgroundColor: colors["coral.500"]
										}
									}}
								/>

								<Box mt={2}>
									<Typography
										variant="subtitle2"
										fontWeight={700}
										mb={1}
										color={colors.text}
									>
										Subtarefas
									</Typography>
									{focusTask.subtasks.map(st => (
										<Box
											key={st.id}
											className={`focus-subtask ${st.completed ? "focus-subtask--done" : ""}`}
											onClick={() => handleToggleSubtask(focusTask, st.id)}
											sx={{
												backgroundColor: st.completed
													? (isDarkMode ? "rgba(76,175,80,0.12)" : "#f1f8e9")
													: colors["background.card"],
												borderColor: colors["coral.100"]
											}}
										>
											{st.completed ? (
												<CheckCircleIcon sx={{ color: "#4caf50" }} />
											) : (
												<UncheckedIcon
													sx={{ color: colors["coral.400"] }}
												/>
											)}
											<Typography
												variant="body2"
												sx={{
													textDecoration: st.completed
														? "line-through"
														: "none",
													color: st.completed
														? colors["coral.800"]
														: colors.text
												}}
											>
												{st.title}
											</Typography>
										</Box>
									))}
								</Box>
							</>
						)}

						<Box display="flex" gap={1} mt={3}>
							<EasemindButton
								variant="outlined"
								color="secondary"
								label="Ver todas as tarefas"
								onClick={handleExitFocus}
								borderRadius="8px"
								sx={{
									flex: 1,
									borderColor: colors["coral.100"],
									color: colors["coral.800"],
									"&:hover": {
										borderColor: colors["coral.200"],
										background: colors["coral.50"]
									}
								}}
							/>
							<EasemindButton
								variant="contained"
								color="secondary"
								label="Concluir"
								onClick={handleCompleteTask}
								borderRadius="8px"
								sx={{
									flex: 1,
									background: `linear-gradient(90deg, ${colors["coral.500"]} 0%, ${colors["coral.500"]} 100%)`,
									color: "#fff !important"
								}}
							/>
							<EasemindButton
								variant="outlined"
								color="secondary"
								label="Excluir"
								onClick={handleDeleteTask}
								startIcon={<DeleteIcon />}
								borderRadius="8px"
								sx={{
									borderColor: isDarkMode ? "rgba(220,38,38,0.5)" : "#fca5a5",
									color: "#dc2626",
									"&:hover": {
										borderColor: "#dc2626",
										background: "rgba(220,38,38,0.08)"
									}
								}}
							/>
						</Box>
					</Box>

					<Box className="focus-right">
						<TimerPanel
							timer={timer}
							isDarkMode={isDarkMode}
							cardBg={colors["background.card"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
						/>
						<TipsPanel
							tips={FOCUS_TIPS}
							title="Dicas de Foco"
							isDarkMode={isDarkMode}
							cardBg={colors["background.card"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
						/>
					</Box>
				</Box>

				<CognitiveAlertModal
					open={cogAlertOpen}
					onContinue={() => setCogAlertOpen(false)}
					onStop={() => {
						setCogAlertOpen(false);
						handleExitFocus();
					}}
					isDarkMode={isDarkMode}
					textSecondary={colors["coral.800"]}
					minutes={settings.alertIntervalMinutes}
				/>

				<Dialog
					open={deleteConfirmOpen}
					onClose={() => setDeleteConfirmOpen(false)}
					PaperProps={{
						sx: {
							background: colors["background.card"],
							borderRadius: "12px",
							padding: "8px"
						}
					}}
				>
					<DialogTitle sx={{ color: colors.text, fontWeight: 700 }}>
						Excluir tarefa
					</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{ color: colors["coral.800"] }}>
							Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser
							desfeita.
						</DialogContentText>
					</DialogContent>
					<DialogActions sx={{ padding: "8px 24px 16px" }}>
						<EasemindButton
							variant="outlined"
							color="secondary"
							label="Cancelar"
							onClick={() => setDeleteConfirmOpen(false)}
							borderRadius="8px"
						/>
						<EasemindButton
							variant="contained"
							color="secondary"
							label="Sim, excluir"
							onClick={confirmDeleteTask}
							borderRadius="8px"
							sx={{
								background: "#dc2626",
								color: "#fff !important",
								"&:hover": { background: "#b91c1c" }
							}}
						/>
					</DialogActions>
				</Dialog>

				<EasemindSnackbar
					open={snackbarOpen}
					onClose={() => setSnackbarOpen(false)}
					data={snackbar}
				/>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="60vh"
				width="100%"
			>
				<CircularProgress sx={{ color: colors["coral.500"] }} />
			</Box>
		);
	}

	return (
		<Box className="task-page" sx={{ background: colors.background }}>
			<Box className="task-header">
				<Box>
					<Typography variant="h4" fontWeight={700} color={colors.text}>
						Organizador de Tarefas
					</Typography>
					<Typography variant="body1" color={colors["coral.800"]}>
						Gerencie suas atividades com suporte cognitivo inteligente
					</Typography>
				</Box>

				<Box
					className="task-progress-badge"
					sx={{ background: colors["background.card"], border: `1px solid ${colors["coral.100"]}` }}
				>
					<Typography variant="caption" color={colors["coral.800"]}>
						Progresso Geral
					</Typography>
					<Box className="task-progress-ring">
						<Typography variant="h5" fontWeight={700} color={colors["coral.500"]}>
							{completedCount}/{totalTasks}
						</Typography>
						<LinearProgress
							variant="determinate"
							value={progressPercent}
							sx={{
								width: "100%",
								height: 6,
								borderRadius: 3,
								mt: "4px",
								backgroundColor: colors["coral.100"],
								"& .MuiLinearProgress-bar": { backgroundColor: colors["coral.500"] }
							}}
						/>
					</Box>
				</Box>
			</Box>

			<Box className={`task-body ${isSimple ? "task-body--simple" : ""}`}>
				<Box
					className="task-kanban-wrapper"
					sx={{ background: colors["background.card"], border: `1px solid ${colors["coral.100"]}` }}
				>
					<Box className="task-kanban-header">
						<Box display="flex" alignItems="center" gap={1}>
							<KanbanIcon sx={{ color: colors["coral.500"] }} />
							<Typography variant="h6" fontWeight={700} color={colors.text}>
								Quadro Kanban
							</Typography>
						</Box>
						<EasemindButton
							variant="contained"
							color="secondary"
							label="Nova Tarefa"
							onClick={() => setModalOpen(true)}
							borderRadius="8px"
							sx={{
								background: `linear-gradient(90deg, ${colors["coral.500"]} 0%, ${colors["coral.500"]} 100%)`,
								color: "#fff !important"
							}}
						/>
					</Box>

					<Box className="task-kanban-columns">
						<KanbanColumn
							title="A Fazer"
							count={todoTasks.length}
							status="todo"
							tasks={todoTasks}
							isSimple={isSimple}
							isDarkMode={isDarkMode}
							colBg={isDarkMode ? "rgba(255,255,255,0.04)" : "#fafafa"}
							cardBg={colors["background.card"]}
							borderColor={colors["coral.100"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
							onDragStart={handleDragStart}
							onDrop={handleDrop}
							onFocus={handleEnterFocus}
							onMove={moveTask}
						/>
						<KanbanColumn
							title="Em Progresso"
							count={inProgressTasks.length}
							status="in-progress"
							tasks={inProgressTasks}
							isSimple={isSimple}
							isDarkMode={isDarkMode}
							colBg={isDarkMode ? "rgba(255,255,255,0.04)" : "#fafafa"}
							cardBg={colors["background.card"]}
							borderColor={colors["coral.100"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
							onDragStart={handleDragStart}
							onDrop={handleDrop}
							onFocus={handleEnterFocus}
							onMove={moveTask}
						/>
						<KanbanColumn
							title="Concluído"
							count={doneTasks.length}
							status="done"
							tasks={doneTasks}
							isSimple={isSimple}
							isDarkMode={isDarkMode}
							colBg={isDarkMode ? "rgba(255,255,255,0.04)" : "#fafafa"}
							cardBg={colors["background.card"]}
							borderColor={colors["coral.100"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
							onDragStart={handleDragStart}
							onDrop={handleDrop}
							onFocus={handleEnterFocus}
							onMove={moveTask}
						/>
					</Box>
				</Box>

				{!isSimple && (
					<Box className="task-sidebar">
						<TimerPanel
							timer={timer}
							isDarkMode={isDarkMode}
							cardBg={colors["background.card"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
						/>
						<TipsPanel
							tips={GENERAL_TIPS}
							title="Dicas"
							isDarkMode={isDarkMode}
							cardBg={colors["background.card"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
						/>
						<StatisticsPanel
							totalTasks={totalTasks}
							completedCount={completedCount}
							inProgressCount={inProgressTasks.length}
							progressPercent={progressPercent}
							isDarkMode={isDarkMode}
							cardBg={colors["background.card"]}
							textPrimary={colors.text}
							textSecondary={colors["coral.800"]}
						/>
					</Box>
				)}
			</Box>

			<NewTaskModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onSubmit={handleCreateTask}
			/>
			<EasemindSnackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				data={snackbar}
			/>
		</Box>
	);
}

export default TaskOrganizerPage;
