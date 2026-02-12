import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { EaseMindWrapper } from './components/wrapper/wrapper';
import { FinancialDataProvider, UserProvider } from '@repo/data-access';
import ErrorBoundary from './error-boundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <FinancialDataProvider>
        <Router>
          <EaseMindWrapper>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </EaseMindWrapper>
        </Router>
      </FinancialDataProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();