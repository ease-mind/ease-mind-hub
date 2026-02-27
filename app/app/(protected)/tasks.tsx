import { ScreenHeader } from '@/shared/components';
import {
  AddTaskModal,
  NewTaskForm,
  TaskCard,
  TaskDetailsModal,
} from '@/shared/components/tasks';
import { themeColors } from '@/shared/classes/constants/themeColors';
import { Task, TaskFilter } from '@/shared/types/tasks';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddIcon = require('@/assets/images/add.svg').default;

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pendentes') return !t.completed;
    if (filter === 'concluidas') return t.completed;
    return true;
  });

  const handleAddTask = useCallback((form: NewTaskForm) => {
    const task: Task = {
      id: genId(),
      title: form.title,
      category: form.category,
      priority: form.priority,
      estimatedTime: form.estimatedTime,
      description: '',
      completed: false,
      subtasks: [],
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
    setSelectedTask((t) =>
      t && t.id === taskId ? { ...t, completed: !t.completed } : t
    );
  }, []);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
    setSelectedTask((t) => {
      if (!t || t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        ),
      };
    });
  }, []);

  const handleReabrir = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t))
    );
    setSelectedTask((t) =>
      t && t.id === taskId ? { ...t, completed: false } : t
    );
  }, []);

  const handleAddSubtask = useCallback((taskId: string, title: string) => {
    const newSubtask = {
      id: genId(),
      title: title.trim(),
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, subtasks: [...t.subtasks, newSubtask] };
      })
    );
    setSelectedTask((t) => {
      if (!t || t.id !== taskId) return t;
      return { ...t, subtasks: [...t.subtasks, newSubtask] };
    });
  }, []);

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
                  <AddIcon width={48} height={48} />
                </TouchableOpacity>
              }
            />
          ),
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <View style={styles.tabsRow}>
          {tabs.map((tab, index) => {
              const selected = filter === tab.value;
              const isFirst = index === 0;
              const isLast = index === tabs.length - 1;
              return (
                <TouchableOpacity
                  key={tab.value}
                  style={[
                    styles.tab,
                    selected && styles.tabSelected,
                    isFirst && styles.tabFirst,
                    isLast && styles.tabLast,
                  ]}
                  onPress={() => setFilter(tab.value)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      selected && styles.tabLabelSelected,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  <Text
                    style={[
                      styles.tabCount,
                      selected && styles.tabCountSelected,
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
              onVerDetalhes={setSelectedTask}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Nenhuma tarefa ainda. Toque no + para adicionar.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        <AddTaskModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onAdd={handleAddTask}
        />

        <TaskDetailsModal
          visible={!!selectedTask}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleTaskComplete={handleToggleComplete}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
          onReabrir={handleReabrir}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: themeColors.background,
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
  tabSelected: {
    backgroundColor: themeColors.segmentedSelected,
    borderColor: themeColors.segmentedBorder,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: themeColors.textSecondary,
  },
  tabLabelSelected: {
    color: themeColors.accent,
  },
  tabCount: {
    fontSize: 13,
    color: themeColors.textMuted,
    marginLeft: 2,
  },
  tabCountSelected: {
    color: themeColors.accent,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: themeColors.textMuted,
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
