import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TasksScreen from '@/app/(protected)/tasks';
import { useTask, useCognitiveSettings } from '@/data-access';

type TaskDto = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  estimatedMinutes: number;
  subtasks: any[];
  createdAt: string;
  updatedAt: string;
};

const mockGetAllTasks = jest.fn();
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children }: any) => children,
  },
}));

jest.mock('@/assets/images/add.svg', () => ({ __esModule: true, default: () => null }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@/data-access', () => {
  const themeColors = {
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    accent: '#FF4353',
    accentOrange: '#EA580C',
    toggleOn: '#FF4353',
    toggleOff: '#D1D5DB',
    segmentedSelected: '#FFE8E8',
    segmentedBorder: '#FF4353',
    sliderTrack: '#E5E7EB',
    sliderThumb: '#3B82F6',
    alertBoxBg: '#FEFCE8',
    alertBoxBorder: '#FDE047',
    bottomBarInactive: '#6B7280',
    bottomBarActive: '#FF4353',
    borderDivider: '#E5E7EB',
    borderDividerWidth: 1,
  };

  return {
    useTask: jest.fn(() => ({
      getAllTasks: mockGetAllTasks,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      loading: false,
    })),
    useCognitiveSettings: jest.fn(() => ({
      themeColors,
      spacing: 12,
      fontSize: 14,
      complexity: 'complete',
      contrast: 'normal',
      loading: false,
      updateState: jest.fn(),
      loadSettings: jest.fn(),
    })),
  };
});

jest.mock('@/shared/components', () => ({
  ScreenHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <>{`${title} - ${subtitle}`}</>
  ),
  ScreenFadeIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/shared/components/tasks', () => {
  const RN = require('react-native');
  return {
    AddTaskModal: ({ visible }: { visible: boolean }) =>
      visible ? <></> : null,
    TaskCard: ({ task, testID }: { task: any; testID?: string }) => (
      <RN.View testID={testID} accessibilityLabel={task.title}>
        <RN.Text>{task.title}</RN.Text>
      </RN.View>
    ),
    TaskDetailsModal: () => null,
  };
});

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    FlatList: ({ data, renderItem, ListEmptyComponent }: any) => {
      const content = data?.length
        ? data.map((item: any, index: number) => (
            <RN.View key={item.id ?? index}>{renderItem({ item })}</RN.View>
          ))
        : ListEmptyComponent;
      return <RN.View>{content}</RN.View>;
    },
  };
});

const mockedInsets = useSafeAreaInsets as jest.Mock;
const mockedUseTask = useTask as jest.MockedFunction<typeof useTask>;

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

    mockedUseTask.mockReturnValue({
      getAllTasks: mockGetAllTasks,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      loading: false,
    });
  });

  it('deve carregar e exibir tarefas', async () => {
    mockGetAllTasks.mockResolvedValue([sampleTaskDto()]);

    render(<TasksScreen />);

    await waitFor(
      () => {
        expect(screen.getByLabelText('Tarefa 1')).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('deve atualizar contadores de abas com base nas tarefas', async () => {
    mockGetAllTasks.mockResolvedValue([
      sampleTaskDto({ id: '1', status: 'todo' }),
      sampleTaskDto({ id: '2', status: 'done', title: 'Concluida' }),
    ]);

    render(<TasksScreen />);

    await waitFor(
      () => {
        expect(screen.getByLabelText('Todas')).toBeTruthy();
        expect(screen.getByLabelText('Tarefa 1')).toBeTruthy();
        expect(screen.getByLabelText('Concluida')).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('deve filtrar tarefas concluidas quando aba correspondente selecionada', async () => {
    mockGetAllTasks.mockResolvedValue([
      sampleTaskDto({ id: '1', status: 'todo', title: 'Pendente' }),
      sampleTaskDto({ id: '2', status: 'done', title: 'Concluida' }),
    ]);

    render(<TasksScreen />);

    await waitFor(
      () => {
        expect(screen.getByLabelText('Pendente')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    fireEvent.press(screen.getByLabelText('Concluídas'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Pendente')).toBeNull();
      expect(screen.getByLabelText('Concluida')).toBeTruthy();
    });
  });
});
