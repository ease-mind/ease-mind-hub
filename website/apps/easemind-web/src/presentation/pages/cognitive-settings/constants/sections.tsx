import {
	NotificationsActive as AlertIcon,
	Apps as AppsIcon,
	Contrast as ContrastIcon,
	HeightOutlined as SpaceBarIcon,
	TextFields as TextFieldsIcon
} from "@mui/icons-material";
import { SectionDef } from "../types";

export const SECTIONS: SectionDef[] = [
	{
		id: "complexity",
		label: "Complexidade",
		icon: <AppsIcon />,
		iconColor: "#ff4353",
		iconBg: "#ffedd4"
	},
	{
		id: "contrast",
		label: "Contraste",
		icon: <ContrastIcon />,
		iconColor: "#4f46e5",
		iconBg: "#e0e7ff"
	},
	{
		id: "spacing",
		label: "Espaçamento",
		icon: <SpaceBarIcon />,
		iconColor: "#db2777",
		iconBg: "#fce7f3"
	},
	{
		id: "fontSize",
		label: "Tamanho da Fonte",
		icon: <TextFieldsIcon />,
		iconColor: "#ea580c",
		iconBg: "#fff7ed"
	},
	{
		id: "alerts",
		label: "Alertas",
		icon: <AlertIcon />,
		iconColor: "#dc2626",
		iconBg: "#fee2e2"
	}
];
