import { EaseMindThemeProvider } from "@repo/utils";
import "./App.scss";
import { CognitiveSettingsProvider } from "./context/cognitive-settings/cognitive-settings.context";
import TaskOrganizerPage from "./pages/task-organizer/task-organizer";

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
