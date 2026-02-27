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
import { EaseMindButton, EaseMindSnackbar } from "@repo/ui";
import { useTheme } from "@repo/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCognitiveSettings } from "../../context/cognitive-settings/cognitive-settings.context";
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

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Hooks

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

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * States & Refs

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

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Derived styles

	const pageBg = isDarkMode ? colors.background : "#fef3f1";
	const cardBg = isDarkMode ? colors["background.card"] : "#ffffff";
	const colBg = isDarkMode ? "rgba(255,255,255,0.04)" : "#fafafa";
	const darkBorder =
		settings.contrast === "high"
			? "rgba(255,255,255,0.25)"
			: settings.contrast === "normal"
				? "rgba(255,255,255,0.1)"
				: "transparent";
	const borderColor = isDarkMode ? darkBorder : "#e5e7eb";
	const textPrimary = isDarkMode ? colors["coral.contrast"] : "#111827";
	const textSecondary = isDarkMode ? colors["coral.800"] : "#4b5563";
	const progressTrackBg = isDarkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb";
	const subtaskBg = isDarkMode ? "rgba(255,255,255,0.04)" : "#ffffff";
	const subtaskDoneBg = isDarkMode ? "rgba(76,175,80,0.12)" : "#f1f8e9";

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Effects

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

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Handlers

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

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Helpers

	const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Render — Focus mode

	if (focusModeActive && focusTask) {
		const completedSubs = focusTask.subtasks.filter(s => s.completed).length;
		const totalSubs = focusTask.subtasks.length;
		const taskProgress = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

		return (
			<Box className="task-page" sx={{ background: pageBg }}>
				<Box
					className="focus-badge"
					sx={{ background: cardBg, border: `1px solid ${borderColor}` }}
				>
					<FocusBadgeIcon sx={{ color: "#ff4353", fontSize: "1.25rem" }} />
					<Typography variant="body2" fontWeight={600} color={textPrimary}>
						Modo Foco Ativado
					</Typography>
				</Box>

				<Typography variant="h4" fontWeight={700} textAlign="center" color={textPrimary}>
					Concentre-se no que importa
				</Typography>
				<Typography variant="body2" color={textSecondary} textAlign="center">
					Uma tarefa de cada vez, sem distrações
				</Typography>

				<Box className="focus-layout">
					<Box
						className="focus-task-card"
						sx={{ background: cardBg, border: `1px solid ${borderColor}` }}
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
										color: isDarkMode ? colors["coral.800"] : "#999"
									}}
								/>
								<Typography variant="caption" color={textSecondary}>
									{focusTask.estimatedMinutes} min
								</Typography>
							</Box>
						</Box>

						<Typography variant="h5" fontWeight={700} color={textPrimary}>
							{focusTask.title}
						</Typography>
						<Typography variant="body2" color={textSecondary} mb={2}>
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
										color={textPrimary}
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
										backgroundColor: progressTrackBg,
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
										color={textPrimary}
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
													? subtaskDoneBg
													: subtaskBg,
												borderColor
											}}
										>
											{st.completed ? (
												<CheckCircleIcon sx={{ color: "#4caf50" }} />
											) : (
												<UncheckedIcon
													sx={{
														color: isDarkMode
															? colors["coral.400"]
															: "#bbb"
													}}
												/>
											)}
											<Typography
												variant="body2"
												sx={{
													textDecoration: st.completed
														? "line-through"
														: "none",
													color: st.completed
														? isDarkMode
															? colors["coral.800"]
															: "#999"
														: textPrimary
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
							<EaseMindButton
								variant="outlined"
								color="secondary"
								label="Ver todas as tarefas"
								onClick={handleExitFocus}
								borderRadius="8px"
								sx={{
									flex: 1,
									borderColor: "#e5e7eb",
									color: isDarkMode ? colors["coral.800"] : "#374151",
									"&:hover": {
										borderColor: "#d1d5db",
										background: "rgba(0,0,0,0.04)"
									}
								}}
							/>
							<EaseMindButton
								variant="contained"
								color="secondary"
								label="Concluir"
								onClick={handleCompleteTask}
								borderRadius="8px"
								sx={{
									flex: 1,
									background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
									color: "#fff !important"
								}}
							/>
							<EaseMindButton
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
							cardBg={cardBg}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
						/>
						<TipsPanel
							tips={FOCUS_TIPS}
							title="Dicas de Foco"
							isDarkMode={isDarkMode}
							cardBg={cardBg}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
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
					textSecondary={textSecondary}
					minutes={settings.alertIntervalMinutes}
				/>

				<Dialog
					open={deleteConfirmOpen}
					onClose={() => setDeleteConfirmOpen(false)}
					PaperProps={{
						sx: {
							background: cardBg,
							borderRadius: "12px",
							padding: "8px"
						}
					}}
				>
					<DialogTitle sx={{ color: textPrimary, fontWeight: 700 }}>
						Excluir tarefa
					</DialogTitle>
					<DialogContent>
						<DialogContentText sx={{ color: textSecondary }}>
							Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser
							desfeita.
						</DialogContentText>
					</DialogContent>
					<DialogActions sx={{ padding: "8px 24px 16px" }}>
						<EaseMindButton
							variant="outlined"
							color="secondary"
							label="Cancelar"
							onClick={() => setDeleteConfirmOpen(false)}
							borderRadius="8px"
						/>
						<EaseMindButton
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

				<EaseMindSnackbar
					open={snackbarOpen}
					onClose={() => setSnackbarOpen(false)}
					data={snackbar}
				/>
			</Box>
		);
	}

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Render — Loading

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

	/* - - - - - - - - - - - - - - - - - - - - - - */
	// * Render — Main

	return (
		<Box className="task-page" sx={{ background: pageBg }}>
			<Box className="task-header">
				<Box>
					<Typography variant="h4" fontWeight={700} color={textPrimary}>
						Organizador de Tarefas
					</Typography>
					<Typography variant="body1" color={textSecondary}>
						Gerencie suas atividades com suporte cognitivo inteligente
					</Typography>
				</Box>

				<Box
					className="task-progress-badge"
					sx={{ background: cardBg, border: `1px solid ${borderColor}` }}
				>
					<Typography variant="caption" color={textSecondary}>
						Progresso Geral
					</Typography>
					<Box className="task-progress-ring">
						<Typography variant="h5" fontWeight={700} color="#ff4353">
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
								backgroundColor: progressTrackBg,
								"& .MuiLinearProgress-bar": { backgroundColor: "#ff4353" }
							}}
						/>
					</Box>
				</Box>
			</Box>

			<Box className={`task-body ${isSimple ? "task-body--simple" : ""}`}>
				<Box
					className="task-kanban-wrapper"
					sx={{ background: cardBg, border: `1px solid ${borderColor}` }}
				>
					<Box className="task-kanban-header">
						<Box display="flex" alignItems="center" gap={1}>
							<KanbanIcon sx={{ color: "#ff4353" }} />
							<Typography variant="h6" fontWeight={700} color={textPrimary}>
								Quadro Kanban
							</Typography>
						</Box>
						<EaseMindButton
							variant="contained"
							color="secondary"
							label="Nova Tarefa"
							onClick={() => setModalOpen(true)}
							borderRadius="8px"
							sx={{
								background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
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
							colBg={colBg}
							cardBg={cardBg}
							borderColor={borderColor}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
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
							colBg={colBg}
							cardBg={cardBg}
							borderColor={borderColor}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
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
							colBg={colBg}
							cardBg={cardBg}
							borderColor={borderColor}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
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
							cardBg={cardBg}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
						/>
						<TipsPanel
							tips={GENERAL_TIPS}
							title="Dicas"
							isDarkMode={isDarkMode}
							cardBg={cardBg}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
						/>
						<StatisticsPanel
							totalTasks={totalTasks}
							completedCount={completedCount}
							inProgressCount={inProgressTasks.length}
							progressPercent={progressPercent}
							isDarkMode={isDarkMode}
							cardBg={cardBg}
							textPrimary={textPrimary}
							textSecondary={textSecondary}
						/>
					</Box>
				)}
			</Box>

			<NewTaskModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onSubmit={handleCreateTask}
			/>
			<EaseMindSnackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				data={snackbar}
			/>
		</Box>
	);
}

export default TaskOrganizerPage;
