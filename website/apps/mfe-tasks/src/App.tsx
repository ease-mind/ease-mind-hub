import { EasemindThemeProvider } from "@repo/utils";
import "./App.scss";
import TaskOrganizerPage from "./pages/task-organizer/task-organizer";
import { CognitiveSettingsProvider } from "@repo/data-access";

function App() {
	return (
		<EasemindThemeProvider>
			<CognitiveSettingsProvider>
				<TaskOrganizerPage />
			</CognitiveSettingsProvider>
		</EasemindThemeProvider>
	);
}

export default App;
