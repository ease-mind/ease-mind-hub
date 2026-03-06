import { CognitiveSettingsProvider, UserProvider } from "@repo/data-access";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { EaseMindWrapper } from "./components/wrapper/wrapper";
import ErrorBoundary from "./error-boundary";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<UserProvider>
			<Router>
				<EaseMindWrapper>
					<CognitiveSettingsProvider>
						<ErrorBoundary>
							<App />
						</ErrorBoundary>
					</CognitiveSettingsProvider>
				</EaseMindWrapper>
			</Router>
		</UserProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
