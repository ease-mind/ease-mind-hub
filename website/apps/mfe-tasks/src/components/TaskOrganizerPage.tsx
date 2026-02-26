import { CognitiveSettingsProvider } from "../context/cognitive-settings/cognitive-settings.context";
import TaskOrganizerPageBase from "../pages/task-organizer/task-organizer";

export function TaskOrganizerPage() {
	return (
		<CognitiveSettingsProvider>
			<TaskOrganizerPageBase />
		</CognitiveSettingsProvider>
	);
}
