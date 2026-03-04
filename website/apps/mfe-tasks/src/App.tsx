import { EaseMindThemeProvider } from "@repo/utils";
import "./App.scss";
import TaskOrganizerPage from "./pages/task-organizer/task-organizer";
import { CognitiveSettingsProvider } from "@repo/data-access";

function App() {
	return (
		<EaseMindThemeProvider>
			<CognitiveSettingsProvider>
				<TaskOrganizerPage />
			</CognitiveSettingsProvider>
		</EaseMindThemeProvider>
	);
}

export default App;
