import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  TaskDto,
  CreateTaskPayload,
} from './taskService';
import { api } from '@/shared/config/api';

jest.mock('@/shared/config/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('taskService', () => {
  const sampleTask: TaskDto = {
    id: '1',
    title: 'Tarefa',
    description: 'Desc',
    category: 'Rotina',
    priority: 'medium',
    status: 'todo',
    estimatedMinutes: 30,
    subtasks: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllTasks deve buscar lista de tarefas', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [sampleTask] });

    const result = await getAllTasks();

    expect(mockedApi.get).toHaveBeenCalledWith('/tasks');
    expect(result).toEqual([sampleTask]);
  });

  it('getTaskById deve buscar tarefa por id', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: sampleTask });

    const result = await getTaskById('1');

    expect(mockedApi.get).toHaveBeenCalledWith('/tasks/1');
    expect(result).toEqual(sampleTask);
  });

  it('createTask deve enviar payload correto', async () => {
    const payload: CreateTaskPayload = {
      title: 'Nova',
      description: '',
      category: 'Rotina',
      priority: 'low',
      status: 'todo',
      estimatedMinutes: 15,
      subtasks: [],
    };

    mockedApi.post.mockResolvedValueOnce({ data: sampleTask });

    const result = await createTask(payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/tasks', payload);
    expect(result).toEqual(sampleTask);
  });

  it('updateTask deve realizar patch parcial', async () => {
    const patch: Partial<CreateTaskPayload> = {
      title: 'Atualizada',
      status: 'done',
    };

    mockedApi.patch.mockResolvedValueOnce({ data: { ...sampleTask, ...patch } });

    const result = await updateTask('1', patch);

    expect(mockedApi.patch).toHaveBeenCalledWith('/tasks/1', patch);
    expect(result).toEqual({ ...sampleTask, ...patch });
  });

  it('deleteTask deve chamar delete com id', async () => {
    mockedApi.delete.mockResolvedValueOnce(undefined as any);

    await deleteTask('1');

    expect(mockedApi.delete).toHaveBeenCalledWith('/tasks/1');
  });
});


