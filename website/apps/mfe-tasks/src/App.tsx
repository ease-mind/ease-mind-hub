import './App.scss';
import { EaseMindThemeProvider } from '@repo/utils';
import { TaskList } from './components';

function App() {
  return (
    <EaseMindThemeProvider>
      <TaskList />
    </EaseMindThemeProvider>
  );
}

export default App;
