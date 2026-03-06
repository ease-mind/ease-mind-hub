import { ScreenHeader, ScreenFadeIn } from '@/shared/components';
import { AddTaskModal, NewTaskForm, TaskCard, TaskDetailsModal } from '@/shared/components/tasks';
import { useCognitiveSettings } from '@/shared/contexts';
import { Priority, Task, TaskFilter } from '@/shared/types/tasks';
import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TaskDto,
  TaskPriority,
  TaskStatus,
  createTask,
  getAllTasks,
  updateTask,
} from '@/shared/services/taskService';

const AddIcon = require('@/assets/images/add.svg').default;

const mapPriorityFromBackend = (priority: TaskPriority): Priority => {
  if (priority === 'high') return 'alta';
  if (priority === 'medium') return 'media';
  return 'baixa';
};

const mapPriorityToBackend = (priority: Priority): TaskPriority => {
  if (priority === 'alta') return 'high';
  if (priority === 'media') return 'medium';
  return 'low';
};

const minutesFromEstimatedTime = (value: string): number => {
  const parsed = parseInt(value.replace(/\D/g, ''), 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

const estimatedTimeFromMinutes = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 min';
  return `${minutes} min`;
};

const mapFromBackend = (dto: TaskDto): Task => {
  const createdAtTime =
    typeof dto.createdAt === 'string' ? new Date(dto.createdAt).getTime() : Date.now();
  const completed = dto.status === 'done';

  return {
    id: dto.id,
    title: dto.title,
    category: dto.category ?? 'Rotina',
    priority: mapPriorityFromBackend(dto.priority),
    estimatedTime: estimatedTimeFromMinutes(dto.estimatedMinutes),
    description: dto.description,
    completed,
    subtasks: dto.subtasks,
    createdAt: createdAtTime,
  };
};

const statusFromCompleted = (completed: boolean): TaskStatus => (completed ? 'done' : 'todo');

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { themeColors, fontSize, spacing, contrast } = useCognitiveSettings();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const getContrastStyles = () => {
    if (contrast === 'high') {
      return {
        tabBorderWidth: 2,
        tabSelectedBorderWidth: 2,
        fontWeight: '700' as const,
      };
    }
    if (contrast === 'low') {
      return {
        tabBorderWidth: 0,
        tabSelectedBorderWidth: 1,
        fontWeight: '400' as const,
      };
    }
  
    return {
      tabBorderWidth: 1,
      tabSelectedBorderWidth: 1,
      fontWeight: '600' as const,
    };
  };

  const contrastStyles = getContrastStyles();

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pendentes') return !t.completed;
    if (filter === 'concluidas') return t.completed;
    return true;
  });

  const loadTasks = useCallback(async () => {
    try {
      const data = await getAllTasks();
      setTasks(data.map(mapFromBackend));
    } catch {
      Alert.alert(
        'Erro ao carregar tarefas',
        'Não foi possível carregar suas tarefas. Tente novamente mais tarde.',
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = useCallback(async (form: NewTaskForm) => {
    try {
      const payload: Omit<TaskDto, 'id' | 'createdAt' | 'updatedAt'> = {
        title: form.title,
        description: '',
        category: form.category,
        priority: mapPriorityToBackend(form.priority),
        status: 'todo',
        estimatedMinutes: minutesFromEstimatedTime(form.estimatedTime),
        subtasks: [],
      };
      const created = await createTask(payload);
      setTasks((prev) => [mapFromBackend(created), ...prev]);
    } catch {
      Alert.alert('Erro ao criar tarefa', 'Não foi possível criar a tarefa. Tente novamente.');
    }
  }, []);

  const patchTaskRemote = useCallback(
    async (task: Task) => {
      try {
        await updateTask(task.id, {
          title: task.title,
          description: task.description,
          category: task.category,
          priority: mapPriorityToBackend(task.priority),
          status: statusFromCompleted(task.completed),
          estimatedMinutes: minutesFromEstimatedTime(task.estimatedTime),
          subtasks: task.subtasks,
        });
      } catch {
        Alert.alert('Erro ao atualizar tarefa', 'Não foi possível atualizar a tarefa.');
        loadTasks();
      }
    },
    [loadTasks],
  );

  const handleToggleComplete = useCallback(
    async (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      );
      setSelectedTask((t) =>
        t && t.id === taskId ? { ...t, completed: !t.completed } : t,
      );

      const current = tasks.find((t) => t.id === taskId);
      if (current) {
        const toggled: Task = { ...current, completed: !current.completed };
        await patchTaskRemote(toggled);
      }
    },
    [patchTaskRemote, tasks],
  );

  const handleToggleSubtask = useCallback(
    async (taskId: string, subtaskId: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s,
            ),
          };
        }),
      );
      setSelectedTask((t) => {
        if (!t || t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s,
          ),
        };
      });

      const current = tasks.find((t) => t.id === taskId);
      if (current) {
        const updated: Task = {
          ...current,
          subtasks: current.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s,
          ),
        };
        await patchTaskRemote(updated);
      }
    },
    [patchTaskRemote, tasks],
  );

  const handleOpen = useCallback(
    async (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t)),
      );
      setSelectedTask((t) => (t && t.id === taskId ? { ...t, completed: false } : t));

      const current = tasks.find((t) => t.id === taskId);
      if (current) {
        const reopened: Task = { ...current, completed: false };
        await patchTaskRemote(reopened);
      }
    },
    [patchTaskRemote, tasks],
  );

  const handleAddSubtask = useCallback(
    async (taskId: string, title: string) => {
      const newSubtask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: title.trim(),
        completed: false,
      };
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return { ...t, subtasks: [...t.subtasks, newSubtask] };
        }),
      );
      setSelectedTask((t) => {
        if (!t || t.id !== taskId) return t;
        return { ...t, subtasks: [...t.subtasks, newSubtask] };
      });

      const current = tasks.find((t) => t.id === taskId);
      if (current) {
        const updated: Task = { ...current, subtasks: [...current.subtasks, newSubtask] };
        await patchTaskRemote(updated);
      }
    },
    [patchTaskRemote, tasks],
  );

  const handleEdit = useCallback((task: Task) => {
    setSelectedTask(null);
    setEditingTask(task);
    setAddModalVisible(true);
  }, []);

  const handleUpdateTask = useCallback(async (form: NewTaskForm) => {
    if (!editingTask) return;
    
    try {
      const updated: Task = {
        ...editingTask,
        title: form.title,
        category: form.category,
        priority: form.priority,
        estimatedTime: form.estimatedTime,
      };
      
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      await patchTaskRemote(updated);
      setEditingTask(null);
    } catch {
      Alert.alert('Erro ao atualizar tarefa', 'Não foi possível atualizar a tarefa. Tente novamente.');
    }
  }, [editingTask, patchTaskRemote]);

  const handleModalClose = useCallback(() => {
    setAddModalVisible(false);
    setEditingTask(null);
  }, []);

  const handleModalSubmit = useCallback(async (form: NewTaskForm) => {
    if (editingTask) {
      await handleUpdateTask(form);
    } else {
      await handleAddTask(form);
    }
  }, [editingTask, handleUpdateTask, handleAddTask]);

  const tabs: { value: TaskFilter; label: string; count: number }[] = [
    { value: 'todas', label: 'Todas', count: tasks.length },
    { value: 'pendentes', label: 'Pendentes', count: pendingCount },
    { value: 'concluidas', label: 'Concluídas', count: completedCount },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <ScreenHeader
              title="Minhas Tarefas"
              subtitle={`${pendingCount} pendentes de ${tasks.length} tarefas`}
              rightElement={
                <TouchableOpacity
                  style={styles.fab}
                  onPress={() => setAddModalVisible(true)}
                  activeOpacity={0.9}
                >
                  <AddIcon width={56} height={56} />
                </TouchableOpacity>
              }
            />
          ),
          headerShown: true,
        }}
      />
      <ScreenFadeIn>
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={[styles.tabsRow, { backgroundColor: themeColors.background, paddingVertical: spacing }]}>
          {tabs.map((tab, index) => {
              const selected = filter === tab.value;
              const isFirst = index === 0;
              const isLast = index === tabs.length - 1;
              return (
                <TouchableOpacity
                  key={tab.value}
                  style={[
                    styles.tab,
                    { borderWidth: contrastStyles.tabBorderWidth },
                    selected && [
                      styles.tabSelected,
                      { 
                        backgroundColor: themeColors.segmentedSelected, 
                        borderColor: themeColors.segmentedBorder,
                        borderWidth: contrastStyles.tabSelectedBorderWidth,
                      },
                    ],
                    isFirst && styles.tabFirst,
                    isLast && styles.tabLast,
                  ]}
                  onPress={() => setFilter(tab.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      { fontSize, color: themeColors.textSecondary, fontWeight: contrastStyles.fontWeight },
                      selected && { color: themeColors.accent },
                    ]}
                  >
                    {tab.label}
                  </Text>
                  <Text
                    style={[
                      styles.tabCount,
                      { fontSize: Math.max(12, fontSize - 2), color: themeColors.textMuted },
                      selected && { color: themeColors.accent },
                    ]}
                  >
                    ({tab.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggleComplete={handleToggleComplete}
              onClickDetails={setSelectedTask}
              onEdit={handleEdit}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 64 + insets.bottom + 24, paddingTop: spacing },
          ]}
          ListEmptyComponent={
            <View style={[styles.empty, { paddingVertical: spacing * 2 }]}>
              <Text style={[styles.emptyText, { fontSize, color: themeColors.textMuted, lineHeight: fontSize + spacing }]}>
                Nenhuma tarefa ainda. Toque no + para adicionar.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />

        <AddTaskModal
          visible={addModalVisible}
          onClose={handleModalClose}
          onAdd={handleModalSubmit}
          editingTask={editingTask}
        />

        <TaskDetailsModal
          visible={!!selectedTask}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleTaskComplete={handleToggleComplete}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
          onOpen={handleOpen}
          onEdit={handleEdit}
        />
      </View>
      </ScreenFadeIn>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabFirst: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  tabLast: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  tabSelected: {},
  tabLabel: {
    fontWeight: '600',
  },
  tabCount: {
    marginLeft: 2,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
