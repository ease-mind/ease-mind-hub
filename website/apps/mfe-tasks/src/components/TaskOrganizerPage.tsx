import { CognitiveSettingsProvider } from "@repo/data-access";
import TaskOrganizerPageBase from "../pages/task-organizer/task-organizer";

export function TaskOrganizerPage() {
	return (
		<CognitiveSettingsProvider>
			<TaskOrganizerPageBase />
		</CognitiveSettingsProvider>
	);
}
