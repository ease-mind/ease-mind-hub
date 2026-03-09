import {
	AccessAlarm as AlarmExampleIcon,
	NotificationsActive as AlertIcon,
	Apps as AppsIcon,
	Layers as CompleteIcon,
	Contrast as ContrastIcon,
	DarkMode as HighContrastIcon,
	LightMode as LowContrastIcon,
	TuneOutlined as NormalContrastIcon,
	Extension as SimpleIcon,
	HeightOutlined as SpaceBarIcon,
	TextFields as TextFieldsIcon
} from "@mui/icons-material";
import { Box, Slider, Switch, Typography } from "@mui/material";
import type { SnackbarData } from "@repo/ui";
import { EasemindButton, EasemindSnackbar } from "@repo/ui";
import { useTheme } from "@repo/utils";
import React, { useState } from "react";
import "./cognitive-settings.scss";
import { OptionCard, SectionCard } from "./components";
import { SECTIONS } from "./constants/sections";
import { SectionId } from "./types";
import { CognitiveSettings, ContrastLevel, FontSizeValue, SpacingValue, useCognitiveSettings } from "@repo/data-access";

function CognitiveSettingsPage() {
	const { settings, updateSettings } = useCognitiveSettings();
	const { colors, isDarkMode } = useTheme();

	const [activeSection, setActiveSection] = useState<SectionId>("complexity");
	const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [draft, setDraft] = useState<CognitiveSettings>({ ...settings });

	const patchDraft = (patch: Partial<CognitiveSettings>) =>
		setDraft(prev => ({ ...prev, ...patch }));

	const handleSave = () => {
		updateSettings(draft);
		setSnackbar({ status: "success", message: "Configurações salvas com sucesso!" });
		setSnackbarOpen(true);
	};

	const handleCancel = () => {
		setDraft({ ...settings });
		setSnackbar({ status: "info", message: "Alterações descartadas." });
		setSnackbarOpen(true);
	};

	const isComplete = settings.complexity === "complete";

	const getSectionMeta = (id: SectionId) => {
		const s = SECTIONS.find(s => s.id === id)!;
		return {
			iconColor: isDarkMode ? colors["coral.600"] : s.iconColor,
			iconBg: isDarkMode ? colors["background.card"] : s.iconBg
		};
	};

	const renderComplexity = () => {
		const meta = getSectionMeta("complexity");
		return (
			<SectionCard
				icon={<AppsIcon sx={{ color: meta.iconColor }} />}
				title="Nível de Complexidade da Interface"
				subtitle="Ajuste a quantidade de informações exibidas"
				cardBg={colors["background.card"]}
				iconBg={meta.iconBg}
				borderSubtle={colors["coral.100"]}
				textPrimary={colors["coral.800"] }
				textSecondary={colors["coral.800"]}
			>
				<Box className="cog-option-row">
					<OptionCard
						selected={draft.complexity === "simple"}
						onClick={() => patchDraft({ complexity: "simple" })}
						icon={
							<SimpleIcon
								sx={{
									color: isDarkMode ? "#4ade80" : "#16a34a",
									fontSize: "1.5rem"
								}}
							/>
						}
						label="Simples"
						description="Apenas o essencial"
						optionBorder={colors["coral.100"]}
						selectedBg={colors["coral.50"]}
						accentColor={colors["coral.500"]}
						iconRingBg={isDarkMode ? "rgba(22,163,74,0.15)" : "#dcfce7"}
						textPrimary={colors["coral.800"] }
						textSecondary={colors["coral.800"]}
					/>
					<OptionCard
						selected={draft.complexity === "complete"}
						onClick={() => patchDraft({ complexity: "complete" })}
						icon={
							<CompleteIcon
								sx={{
									color: isDarkMode ? "#c084fc" : "#9333ea",
									fontSize: "1.5rem"
								}}
							/>
						}
						label="Completo"
						description="Todas as opções"
						optionBorder={colors["coral.100"]}
						selectedBg={colors["coral.50"]}
						accentColor={colors["coral.500"]}
						iconRingBg={isDarkMode ? "rgba(147,51,234,0.15)" : "#f3e8ff"}
						textPrimary={colors["coral.800"] }
						textSecondary={colors["coral.800"]}
					/>
				</Box>
			</SectionCard>
		);
	};

	const renderContrast = () => {
		const meta = getSectionMeta("contrast");
		return (
			<SectionCard
				icon={<ContrastIcon sx={{ color: meta.iconColor }} />}
				title="Contraste"
				subtitle="Ajuste o contraste visual da interface"
				cardBg={colors["background.card"]}
				iconBg={meta.iconBg}
				borderSubtle={colors["coral.100"]}
				textPrimary={colors["coral.800"] }
				textSecondary={colors["coral.800"]}
			>
				<Box className="cog-option-row">
					{(["low", "normal", "high"] as ContrastLevel[]).map(level => {
						const iconMap = {
							low: (
								<LowContrastIcon
									sx={{
										color: isDarkMode ? "#fbbf24" : "#d97706",
										fontSize: "1.5rem"
									}}
								/>
							),
							normal: (
								<NormalContrastIcon
									sx={{
										color: isDarkMode ? "#60a5fa" : "#2563eb",
										fontSize: "1.5rem"
									}}
								/>
							),
							high: (
								<HighContrastIcon
									sx={{
										color: isDarkMode ? "#a78bfa" : "#7c3aed",
										fontSize: "1.5rem"
									}}
								/>
							)
						};
						const labelMap = { low: "Baixo", normal: "Normal", high: "Alto" };
						const descMap = { low: "Suave", normal: "Padrão", high: "Máximo" };
						const ringBgMap = {
							low: isDarkMode ? "rgba(217,119,6,0.15)" : "#fef3c7",
							normal: isDarkMode ? "rgba(37,99,235,0.15)" : "#dbeafe",
							high: isDarkMode ? "rgba(124,58,237,0.15)" : "#ede9fe"
						};
						return (
							<OptionCard
								key={level}
								selected={draft.contrast === level}
								onClick={() => patchDraft({ contrast: level })}
								icon={iconMap[level]}
								label={labelMap[level]}
								description={descMap[level]}
								optionBorder={colors["coral.100"]}
								selectedBg={colors["coral.50"]}
								accentColor={colors["coral.500"]}
								iconRingBg={ringBgMap[level]}
								textPrimary={colors["coral.800"] }
								textSecondary={colors["coral.800"]}
							/>
						);
					})}
				</Box>
			</SectionCard>
		);
	};

	const renderSpacing = () => {
		const meta = getSectionMeta("spacing");
		const marks = [
			{ value: 12, label: "Min" },
			{ value: 18, label: "Médio" },
			{ value: 24, label: "Max" }
		];
		return (
			<SectionCard
				icon={<SpaceBarIcon sx={{ color: meta.iconColor }} />}
				title="Espaçamento"
				subtitle="Controle o espaço entre elementos"
				cardBg={colors["background.card"]}
				iconBg={meta.iconBg}
				borderSubtle={colors["coral.100"]}
				textPrimary={colors["coral.800"] }
				textSecondary={colors["coral.800"]}
			>
				<Typography variant="caption" color={colors["coral.800"]}>
					Espaçamento: {draft.spacing}px
				</Typography>
				<Box px={1} mt={1}>
					<Slider
						value={draft.spacing}
						onChange={(_, v) => patchDraft({ spacing: v as SpacingValue })}
						step={null}
						marks={marks}
						min={12}
						max={24}
						sx={{ color: colors["coral.500"] }}
					/>
				</Box>
			</SectionCard>
		);
	};

	const renderFontSize = () => {
		const meta = getSectionMeta("fontSize");
		const marks = [
			{ value: 12, label: "Min" },
			{ value: 18, label: "Médio" },
			{ value: 24, label: "Max" }
		];
		return (
			<SectionCard
				icon={<TextFieldsIcon sx={{ color: meta.iconColor }} />}
				title="Tamanho da Fonte"
				subtitle="Ajuste o tamanho do texto"
				cardBg={colors["background.card"]}
				iconBg={meta.iconBg}
				borderSubtle={colors["coral.100"]}
				textPrimary={colors["coral.800"] }
				textSecondary={colors["coral.800"]}
			>
				<Typography variant="caption" color={colors["coral.800"]}>
					Tamanho: {draft.fontSize}px
				</Typography>
				<Box px={1} mt={1}>
					<Slider
						value={draft.fontSize}
						onChange={(_, v) => patchDraft({ fontSize: v as FontSizeValue })}
						step={null}
						marks={marks}
						min={12}
						max={24}
						sx={{ color: colors["coral.500"] }}
					/>
				</Box>
				<Box mt={2} p={2} borderRadius={2} sx={{ background: colors["coral.50"] }}>
					<Typography 
						style={{ fontSize: `${draft.fontSize}px`, color: colors["coral.800"] , lineHeight: 1.5 }}
					>
						Parágrafo de exemplo com o tamanho selecionado.
					</Typography>
				</Box>
			</SectionCard>
		);
	};

	const renderAlerts = () => {
		const meta = getSectionMeta("alerts");
		const intervalMarks = [
			{ value: 15, label: "15min" },
			{ value: 30, label: "30min" },
			{ value: 45, label: "45min" },
			{ value: 60, label: "60min" }
		];
		return (
			<SectionCard
				icon={<AlertIcon sx={{ color: meta.iconColor }} />}
				title="Alertas Cognitivos"
				subtitle="Receba avisos sobre seu tempo de atividade"
				cardBg={colors["background.card"]}
				iconBg={meta.iconBg}
				borderSubtle={colors["coral.100"]}
				textPrimary={colors["coral.800"] }
				textSecondary={colors["coral.800"]}
			>
				<Box className="cog-toggle-row">
					<Box>
						<Typography
							variant="body2"
							fontWeight={600}
							color={draft.alertsEnabled ? colors["coral.500"] : colors["coral.800"] }
						>
							Alertas Ativados
						</Typography>
						<Typography variant="caption" color={colors["coral.800"]}>
							Você receberá notificações
						</Typography>
					</Box>
					<Switch
						checked={draft.alertsEnabled}
						onChange={(_, checked) => patchDraft({ alertsEnabled: checked })}
						sx={{
							"& .MuiSwitch-switchBase.Mui-checked": { color: colors["coral.500"] },
							"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
								backgroundColor: colors["coral.500"]
							}
						}}
					/>
				</Box>
				{draft.alertsEnabled && (
					<>
						<Typography variant="caption" color={colors["coral.800"]} mt={2}>
							Alerta após {draft.alertIntervalMinutes} minutos
						</Typography>
						<Box px={1} mt={1}>
							<Slider
								value={draft.alertIntervalMinutes}
								onChange={(_, v) =>
									patchDraft({ alertIntervalMinutes: v as number })
								}
								step={null}
								marks={intervalMarks}
								min={15}
								max={60}
								sx={{ color: colors["coral.500"] }}
							/>
						</Box>
						<Box mt={2} p={2} borderRadius={2} sx={{ background: isDarkMode ? "rgba(220,38,38,0.12)" : "#fee2e2" }}>
							<Box display="flex" alignItems="center" gap="6px" mb="4px">
								<AlarmExampleIcon sx={{ color: "#dc2626", fontSize: "1.1rem" }} />
								<Typography variant="body2" fontWeight={600} color="#dc2626">
									Exemplo de Alerta
								</Typography>
							</Box>
							<Typography variant="caption" color={colors["coral.800"]}>
								Você está focado há um tempo! Considere fazer uma pausa de 5
								minutos.
							</Typography>
						</Box>
					</>
				)}
			</SectionCard>
		);
	};

	const sectionRenderers: Record<SectionId, () => React.ReactNode> = {
		complexity: renderComplexity,
		contrast: renderContrast,
		spacing: renderSpacing,
		fontSize: renderFontSize,
		alerts: renderAlerts
	};

	return (
		<Box className="cog-settings-page" sx={{ background: colors.background }}>
			<Box className="cog-settings-header">
				<Typography variant="h4" fontWeight={700} color={colors["coral.800"] }>
					Configurações Cognitivas
				</Typography>
				<Typography variant="body1" color={colors["coral.800"]}>
					Personalize sua experiência para melhor suporte cognitivo
				</Typography>
			</Box>

			{isComplete ? (
				<Box className="cog-settings-body cog-settings-body--stacked">
					{SECTIONS.map(s => (
						<React.Fragment key={s.id}>{sectionRenderers[s.id]()}</React.Fragment>
					))}
				</Box>
			) : (
				<Box className="cog-settings-body cog-settings-body--sidebar">
					<Box
						className="cog-sidebar"
						sx={{
							background: colors["background.card"],
							border: `1px solid ${colors["coral.100"]}`
						}}
					>
						{SECTIONS.map(s => (
							<Box
								key={s.id}
								className={`cog-sidebar-item ${activeSection === s.id ? "cog-sidebar-item--active" : ""}`}
								onClick={() => setActiveSection(s.id)}
								sx={{
									...(activeSection === s.id && {
										background: `linear-gradient(90deg, ${colors["coral.500"]} 0%, ${colors["coral.500"]} 100%)`,
										color: "#fff",
										borderRadius: "0.75rem",
										"& .MuiSvgIcon-root": { color: "#fff" },
										"& .MuiTypography-root": { color: "#fff" }
									})
								}}
							>
								{s.icon}
								<Typography
									variant="body2"
									fontWeight={activeSection === s.id ? 600 : 400}
								>
									{s.label}
								</Typography>
							</Box>
						))}
					</Box>
					<Box className="cog-content">{sectionRenderers[activeSection]()}</Box>
				</Box>
			)}

			<Box className="cog-settings-actions">
				<EasemindButton
					variant="outlined"
					color="secondary"
					label="Cancelar"
					onClick={handleCancel}
					borderRadius="8px"
					sx={{
						borderColor: colors["coral.100"],
						color: colors["coral.800"],
						"&:hover": { borderColor: colors["coral.200"], background: colors["coral.50"] }
					}}
				/>
				<EasemindButton
					variant="contained"
					color="secondary"
					label="Salvar Configurações"
					onClick={handleSave}
					borderRadius="8px"
					sx={{
						background: `linear-gradient(90deg, ${colors["coral.500"]} 0%, ${colors["coral.500"]} 100%)`,
						color: "#fff !important"
					}}
				/>
			</Box>

			<EasemindSnackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				data={snackbar}
			/>
		</Box>
	);
}

export default CognitiveSettingsPage;
