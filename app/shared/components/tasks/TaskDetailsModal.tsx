import { themeColors } from '@/shared/classes/constants/themeColors';
import { Subtask, Task, PRIORITY_LABELS } from '@/shared/types/tasks';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TaskDetailsModalProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onReabrir: (taskId: string) => void;
};

const priorityBg: Record<string, string> = {
  alta: '#FFE4E6',
  media: '#FEF9C3',
  baixa: '#D1FAE5',
};
const priorityText: Record<string, string> = {
  alta: themeColors.accent,
  media: '#854D0E',
  baixa: '#065F46',
};

export function TaskDetailsModal({
  visible,
  task,
  onClose,
  onToggleTaskComplete,
  onToggleSubtask,
  onAddSubtask,
  onReabrir,
}: TaskDetailsModalProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!task) return null;

  const handleAddSubtask = () => {
    const t = newSubtaskTitle.trim();
    if (!t) return;
    onAddSubtask(task.id, t);
    setNewSubtaskTitle('');
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Detalhes da Tarefa</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.taskTitleRow}
              onPress={() => onToggleTaskComplete(task.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  task.completed && styles.checkboxChecked,
                ]}
              >
                {task.completed ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.taskTitle,
                  task.completed && styles.taskTitleStrike,
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
            </TouchableOpacity>
            <View style={styles.pillsRow}>
              <View
                style={[
                  styles.pill,
                  { backgroundColor: priorityBg[task.priority] },
                ]}
              >
                <Text
                  style={[styles.pillText, { color: priorityText[task.priority] }]}
                >
                  {PRIORITY_LABELS[task.priority]}
                </Text>
              </View>
              <View style={styles.pillCategory}>
                <Text style={styles.pillCategoryText}>{task.category}</Text>
              </View>
              <View style={styles.pillTime}>
                <Feather name="clock" size={14} color="#1D4ED8" />
                <Text style={styles.pillTimeText}>{task.estimatedTime}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>
                {task.description || 'Sem descrição.'}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Subtarefas</Text>
            <View style={styles.subtasksProgress}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {completedSubtasks}/{totalSubtasks}
              </Text>
            </View>
            {task.subtasks.map((sub: Subtask) => (
              <TouchableOpacity
                key={sub.id}
                style={styles.subtaskRow}
                onPress={() => onToggleSubtask(task.id, sub.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.subtaskCheckbox,
                    sub.completed && styles.subtaskCheckboxChecked,
                  ]}
                >
                  {sub.completed ? (
                    <Text style={styles.subtaskCheckMark}>✓</Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.subtaskTitle,
                    sub.completed && styles.subtaskTitleStrike,
                  ]}
                >
                  {sub.title}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.addSubtaskRow}>
              <TextInput
                style={styles.addSubtaskInput}
                placeholder="Nova subtarefa..."
                placeholderTextColor={themeColors.textMuted}
                value={newSubtaskTitle}
                onChangeText={setNewSubtaskTitle}
                onSubmitEditing={handleAddSubtask}
              />
              <TouchableOpacity
                style={styles.addSubtaskBtn}
                onPress={handleAddSubtask}
                activeOpacity={0.8}
              >
                <Text style={styles.addSubtaskBtnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardsRow}>
              <View style={styles.summaryCardProgress}>
                <View style={styles.summaryCardLabelRow}>
                  <Feather name="bar-chart-2" size={18} color={themeColors.accent} />
                  <Text style={styles.summaryCardLabel}>Progresso</Text>
                </View>
                <Text style={styles.summaryCardValueProgress}>
                  {progressPercent}%
                </Text>
              </View>
              <View style={styles.summaryCardTime}>
                <View style={styles.summaryCardLabelRow}>
                  <Feather name="clock" size={18} color="#065F46" />
                  <Text style={styles.summaryCardLabel}>Tempo</Text>
                </View>
                <Text style={styles.summaryCardValueTime}>
                  {task.estimatedTime}
                </Text>
              </View>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.editarBtn}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Feather name="edit-2" size={20} color={themeColors.textPrimary} />
                <Text style={styles.editarText}>Editar</Text>
              </TouchableOpacity>
              {task.completed && (
                <TouchableOpacity
                  style={styles.reabrirBtn}
                  onPress={() => onReabrir(task.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reabrirIcon}>✕</Text>
                  <Text style={styles.reabrirText}>Reabrir</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: themeColors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: themeColors.textSecondary,
    fontWeight: '600',
  },
  scroll: {
    maxHeight: 500,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  taskTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: themeColors.textPrimary,
  },
  taskTitleStrike: {
    textDecorationLine: 'line-through',
    color: themeColors.textSecondary,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillCategory: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillCategoryText: {
    fontSize: 13,
    color: themeColors.textSecondary,
    fontWeight: '500',
  },
  pillTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillTimeText: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: themeColors.textPrimary,
    marginBottom: 8,
  },
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: themeColors.textPrimary,
    lineHeight: 20,
  },
  subtasksProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: themeColors.accent,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 13,
    color: themeColors.textSecondary,
    fontWeight: '600',
    minWidth: 28,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  subtaskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  subtaskCheckboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  subtaskCheckMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 14,
    color: themeColors.textPrimary,
  },
  subtaskTitleStrike: {
    textDecorationLine: 'line-through',
    color: themeColors.textSecondary,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  addSubtaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: themeColors.textPrimary,
  },
  addSubtaskBtn: {
    backgroundColor: themeColors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addSubtaskBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  summaryCardProgress: {
    flex: 1,
    backgroundColor: '#FFE4E6',
    borderRadius: 12,
    padding: 14,
  },
  summaryCardTime: {
    flex: 1,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 14,
  },
  summaryCardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  summaryCardLabel: {
    fontSize: 13,
    color: themeColors.textSecondary,
  },
  summaryCardValueProgress: {
    fontSize: 20,
    fontWeight: '700',
    color: themeColors.accent,
  },
  summaryCardValueTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#065F46',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  editarText: {
    fontSize: 15,
    fontWeight: '600',
    color: themeColors.textPrimary,
  },
  reabrirBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  reabrirIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  reabrirText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
