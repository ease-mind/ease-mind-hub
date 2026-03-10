import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function TestApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Component</h1>
      <p>If you can see this, the basic rendering works!</p>
      <p>The issue is likely with the CognitiveSettingsProvider.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);

reportWebVitals();
