import {
	ContentCut as ContentCutIcon,
	LooksOne as LooksOneIcon,
	NotificationsOff as NotificationsOffIcon,
	PauseCircle as PauseTimerIcon,
	SelfImprovement as SelfImprovementIcon,
	Spa as SpaIcon
} from "@mui/icons-material";
import { TipDef } from "../types";

export const FOCUS_TIPS: TipDef[] = [
	{
		icon: <NotificationsOffIcon fontSize="small" />,
		title: "Silencie Notificações",
		description: "Desative todas as distrações do celular e computador.",
		iconColor: "#4f46e5",
		iconBg: "#e0e7ff"
	},
	{
		icon: <SpaIcon fontSize="small" />,
		title: "Ambiente Tranquilo",
		description: "Use fones de ouvido ou encontre um local silencioso.",
		iconColor: "#16a34a",
		iconBg: "#dcfce7"
	},
	{
		icon: <SelfImprovementIcon fontSize="small" />,
		title: "Respire Fundo",
		description: "Faça 3 respirações profundas antes de começar.",
		iconColor: "#dc2626",
		iconBg: "#fee2e2"
	}
];

export const GENERAL_TIPS: TipDef[] = [
	{
		icon: <ContentCutIcon fontSize="small" />,
		title: "Divida Tarefas",
		description: "Quebre tarefas grandes em etapas menores.",
		iconColor: "#ea580c",
		iconBg: "#fff7ed"
	},
	{
		icon: <PauseTimerIcon fontSize="small" />,
		title: "Pausas Regulares",
		description: "Faça pausas de 5 minutos a cada 25 minutos.",
		iconColor: "#4f46e5",
		iconBg: "#e0e7ff"
	},
	{
		icon: <LooksOneIcon fontSize="small" />,
		title: "Uma de Cada Vez",
		description: "Concentre-se em uma tarefa por vez.",
		iconColor: "#16a34a",
		iconBg: "#dcfce7"
	}
];
