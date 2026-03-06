import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TasksScreen from '@/app/(protected)/tasks';
import {
  getAllTasks,
  createTask,
  updateTask,
  TaskDto,
} from '@/shared/services/taskService';

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children }: any) => children,
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@/shared/services/taskService', () => ({
  getAllTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
}));

jest.mock('@/shared/components', () => ({
  ScreenHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <>{`${title} - ${subtitle}`}</>
  ),
}));

jest.mock('@/shared/components/tasks', () => ({
  AddTaskModal: ({ visible }: { visible: boolean }) =>
    visible ? <></> : null,
  TaskCard: ({ task }: { task: any }) => <>{task.title}</>,
  TaskDetailsModal: () => null,
}));

const mockedInsets = useSafeAreaInsets as jest.Mock;
const mockedGetAllTasks = getAllTasks as jest.MockedFunction<typeof getAllTasks>;
const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;
const mockedUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;

const sampleTaskDto = (overrides?: Partial<TaskDto>): TaskDto => ({
  id: '1',
  title: 'Tarefa 1',
  description: '',
  category: 'Rotina',
  priority: 'medium',
  status: 'todo',
  estimatedMinutes: 30,
  subtasks: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('TasksScreen', () => {
  beforeEach(() => {
    mockedInsets.mockReturnValue({ top: 0, bottom: 0, left: 0, right: 0 });
    jest.clearAllMocks();
  });

  it('deve carregar e exibir tarefas', async () => {
    mockedGetAllTasks.mockResolvedValueOnce([sampleTaskDto()]);

    render(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('Tarefa 1')).toBeTruthy();
    });
  });

  it('deve atualizar contadores de abas com base nas tarefas', async () => {
    mockedGetAllTasks.mockResolvedValueOnce([
      sampleTaskDto({ id: '1', status: 'todo' }),
      sampleTaskDto({ id: '2', status: 'done', title: 'Concluida' }),
    ]);

    render(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Todas/)).toBeTruthy();
    });

    expect(screen.getByText('(2)')).toBeTruthy();
  });

  it('deve filtrar tarefas concluidas quando aba correspondente selecionada', async () => {
    mockedGetAllTasks.mockResolvedValueOnce([
      sampleTaskDto({ id: '1', status: 'todo', title: 'Pendente' }),
      sampleTaskDto({ id: '2', status: 'done', title: 'Concluida' }),
    ]);

    render(<TasksScreen />);

    await waitFor(() => {
      expect(screen.getByText('Pendente')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Concluídas'));

    await waitFor(() => {
      expect(screen.queryByText('Pendente')).toBeNull();
      expect(screen.getByText('Concluida')).toBeTruthy();
    });
  });
});
