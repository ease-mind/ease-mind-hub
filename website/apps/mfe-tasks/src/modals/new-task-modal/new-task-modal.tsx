import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Chip, IconButton, TextField, Typography } from "@mui/material";
import { EasemindButton, EasemindModal } from "@repo/ui";
import { useTheme } from "@repo/utils";
import { useState } from "react";
import { Task, TaskPriority, generateId } from "../../repositories/tasks";
import "./new-task-modal.scss";

interface NewTaskModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
	{ value: "low", label: "Baixa" },
	{ value: "medium", label: "Média" },
	{ value: "high", label: "Alta" }
];

export function NewTaskModal({ open, onClose, onSubmit }: NewTaskModalProps) {
	const { isDarkMode } = useTheme();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<TaskPriority>("medium");
	const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
	const [subtaskInput, setSubtaskInput] = useState("");
	const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>(
		[]
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const subtaskItemBg = isDarkMode ? "rgba(255,255,255,0.06)" : "#fafafa";

	const validate = (): boolean => {
		const errs: Record<string, string> = {};
		if (!title.trim()) errs.title = "Título é obrigatório";
		if (!description.trim()) errs.description = "Descrição é obrigatória";
		if (!estimatedMinutes || estimatedMinutes <= 0) errs.time = "Informe um tempo válido";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleAddSubtask = () => {
		const trimmed = subtaskInput.trim();
		if (!trimmed) return;
		setSubtasks(prev => [...prev, { id: generateId(), title: trimmed, completed: false }]);
		setSubtaskInput("");
	};

	const handleRemoveSubtask = (id: string) => {
		setSubtasks(prev => prev.filter(s => s.id !== id));
	};

	const handleSubmit = () => {
		if (!validate()) return;
		onSubmit({
			title: title.trim(),
			description: description.trim(),
			priority,
			status: "todo",
			estimatedMinutes,
			subtasks
		});
		setTitle("");
		setDescription("");
		setPriority("medium");
		setEstimatedMinutes(30);
		setSubtasks([]);
		setSubtaskInput("");
		setErrors({});
		onClose();
	};

	const handleClose = () => {
		setErrors({});
		onClose();
	};

	return (
		<EasemindModal open={open} onClose={handleClose} title="Nova Tarefa">
			<Box className="new-task-form">
				<Box className="new-task-field">
					<Typography variant="body2" fontWeight={600}>
						Título da Tarefa *
					</Typography>
					<TextField
						fullWidth
						size="small"
						placeholder="Ex: Revisar relatório mensal"
						value={title}
						onChange={e => setTitle(e.target.value)}
						error={!!errors.title}
						helperText={errors.title}
					/>
				</Box>

				<Box className="new-task-field">
					<Typography variant="body2" fontWeight={600}>
						Descrição
					</Typography>
					<TextField
						fullWidth
						size="small"
						multiline
						rows={3}
						placeholder="Descreva os detalhes da tarefa..."
						value={description}
						onChange={e => setDescription(e.target.value)}
						error={!!errors.description}
						helperText={errors.description}
					/>
				</Box>

				<Box className="new-task-row">
					<Box className="new-task-field" flex={1}>
						<Typography variant="body2" fontWeight={600}>
							Prioridade
						</Typography>
						<Box display="flex" gap={1}>
							{PRIORITY_OPTIONS.map(opt => (
								<Chip
									key={opt.value}
									label={opt.label}
									clickable
									onClick={() => setPriority(opt.value)}
									sx={{
										fontWeight: 600,
										borderRadius: "1rem",
										border:
											priority === opt.value
												? "2px solid #ff4353"
												: "2px solid transparent",
										backgroundColor:
											priority === opt.value
												? isDarkMode
													? "rgba(255,67,83,0.12)"
													: "#FFF5F5"
												: undefined,
										color: priority === opt.value ? "#ff4353" : undefined
									}}
								/>
							))}
						</Box>
					</Box>

					<Box className="new-task-field" width="10rem">
						<Typography variant="body2" fontWeight={600}>
							Tempo Estimado (min)
						</Typography>
						<TextField
							type="number"
							size="small"
							fullWidth
							value={estimatedMinutes}
							onChange={e => setEstimatedMinutes(Number(e.target.value))}
							error={!!errors.time}
							helperText={errors.time}
							inputProps={{ min: 1 }}
						/>
					</Box>
				</Box>

				<Box className="new-task-field">
					<Typography variant="body2" fontWeight={600}>
						Subtarefas
					</Typography>
					<Box display="flex" gap={1}>
						<TextField
							fullWidth
							size="small"
							placeholder="Adicione uma subtarefa..."
							value={subtaskInput}
							onChange={e => setSubtaskInput(e.target.value)}
							onKeyDown={e => e.key === "Enter" && handleAddSubtask()}
						/>
						<EasemindButton
							variant="contained"
							color="secondary"
							label="+ Adicionar"
							onClick={handleAddSubtask}
							borderRadius="8px"
							sx={{
								minWidth: "auto",
								px: 2,
								whiteSpace: "nowrap",
								background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
								color: "#fff !important"
							}}
						/>
					</Box>

					{subtasks.length > 0 && (
						<Box display="flex" flexDirection="column" gap="4px" mt={1}>
							{subtasks.map(st => (
								<Box
									key={st.id}
									display="flex"
									alignItems="center"
									justifyContent="space-between"
									px="12px"
									py="4px"
									borderRadius={1}
									sx={{ background: subtaskItemBg }}
								>
									<Typography variant="body2">{st.title}</Typography>
									<IconButton
										size="small"
										onClick={() => handleRemoveSubtask(st.id)}
									>
										<DeleteOutlineIcon fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Box>
					)}
				</Box>

				<Box className="new-task-actions">
					<EasemindButton
						variant="outlined"
						color="secondary"
						label="Cancelar"
						onClick={handleClose}
						borderRadius="8px"
						sx={{
							flex: 1,
							borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "#e5e7eb",
							color: isDarkMode ? "#ffd5d5" : "#374151"
						}}
					/>
					<EasemindButton
						variant="contained"
						color="secondary"
						label="Criar Tarefa"
						onClick={handleSubmit}
						borderRadius="8px"
						sx={{
							flex: 1,
							background: "linear-gradient(90deg, #FF4353 0%, #FF4353 100%)",
							color: "#fff !important"
						}}
					/>
				</Box>
			</Box>
		</EasemindModal>
	);
}
