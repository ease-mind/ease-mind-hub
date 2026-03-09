import { useCognitiveSettings } from '@/data-access';
import { Subtask, Task, PRIORITY_LABELS } from '@/data-access';
import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
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
  onOpen: (taskId: string) => void;
  onEdit?: (task: Task) => void;
};

const priorityBg: Record<string, string> = {
  alta: '#FFE4E6',
  media: '#FEF9C3',
  baixa: '#D1FAE5',
};

export function TaskDetailsModal({
  visible,
  task,
  onClose,
  onToggleTaskComplete,
  onToggleSubtask,
  onAddSubtask,
  onOpen,
  onEdit,
}: TaskDetailsModalProps) {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  const priorityText: Record<string, string> = useMemo(
    () => ({
      alta: themeColors.accent,
      media: '#854D0E',
      baixa: '#065F46',
    }),
    [themeColors.accent],
  );
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        },
        modal: {
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: spacing,
          paddingHorizontal: spacing,
          paddingBottom: spacing * 2,
          maxHeight: '90%',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing,
        },
        headerTitle: {
          fontSize: Math.max(18, fontSize + 4),
          fontWeight: '700',
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing + 4,
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
          fontSize: Math.max(16, fontSize + 2),
          color: themeColors.textSecondary,
          fontWeight: '600',
        },
        scroll: { maxHeight: 500 },
        scrollContent: { paddingBottom: spacing * 2 },
        taskTitleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing,
        },
        checkbox: {
          width: 28,
          height: 28,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#D1D5DB',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing,
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
          fontSize: Math.max(16, fontSize + 2),
          fontWeight: '600',
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing,
        },
        taskTitleStrike: {
          textDecorationLine: 'line-through',
          color: themeColors.textSecondary,
        },
        pillsRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing / 2,
          marginBottom: spacing,
        },
        pill: {
          paddingHorizontal: spacing,
          paddingVertical: spacing / 2,
          borderRadius: 8,
        },
        pillText: { fontSize: Math.max(12, fontSize - 2), fontWeight: '600', lineHeight: fontSize + spacing },
        pillCategory: {
          backgroundColor: '#F3F4F6',
          paddingHorizontal: spacing,
          paddingVertical: spacing / 2,
          borderRadius: 8,
        },
        pillCategoryText: {
          fontSize: Math.max(12, fontSize - 2),
          color: themeColors.textSecondary,
          fontWeight: '500',
          lineHeight: fontSize + spacing / 2,
        },
        pillTime: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing / 2,
          backgroundColor: '#DBEAFE',
          paddingHorizontal: spacing,
          paddingVertical: spacing / 2,
          borderRadius: 8,
        },
        pillTimeText: {
          fontSize: Math.max(12, fontSize - 2),
          color: '#1D4ED8',
          fontWeight: '500',
        },
        sectionTitle: {
          fontSize: Math.max(14, fontSize + 2),
          fontWeight: '700',
          color: themeColors.textPrimary,
          marginBottom: spacing / 2,
          lineHeight: fontSize + spacing,
        },
        descriptionBox: {
          backgroundColor: '#F9FAFB',
          borderRadius: 10,
          padding: spacing,
          marginBottom: spacing,
        },
        descriptionText: {
          fontSize,
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing,
        },
        subtasksProgress: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing,
          marginBottom: spacing,
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
          fontSize: Math.max(12, fontSize - 2),
          color: themeColors.textSecondary,
          fontWeight: '600',
          minWidth: 28,
        },
        subtaskRow: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: 10,
          padding: spacing,
          marginBottom: spacing / 2,
        },
        subtaskCheckbox: {
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: '#D1D5DB',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing,
        },
        subtaskCheckboxChecked: {
          backgroundColor: '#10B981',
          borderColor: '#10B981',
        },
        subtaskCheckMark: {
          color: '#FFFFFF',
          fontSize: Math.max(12, fontSize - 2),
          fontWeight: '700',
        },
        subtaskTitle: {
          flex: 1,
          fontSize,
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing,
        },
        subtaskTitleStrike: {
          textDecorationLine: 'line-through',
          color: themeColors.textSecondary,
        },
        addSubtaskRow: {
          flexDirection: 'row',
          gap: spacing / 2,
          marginTop: spacing / 2,
        },
        addSubtaskInput: {
          flex: 1,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 10,
          paddingHorizontal: spacing,
          paddingVertical: spacing,
          fontSize,
          color: themeColors.textPrimary,
        },
        addSubtaskBtn: {
          backgroundColor: themeColors.accent,
          borderRadius: 10,
          paddingHorizontal: spacing,
          justifyContent: 'center',
          paddingVertical: spacing / 2,
        },
        addSubtaskBtnText: {
          fontSize,
          fontWeight: '600',
          color: '#FFFFFF',
        },
        cardsRow: {
          flexDirection: 'row',
          gap: spacing,
          marginTop: spacing,
          marginBottom: spacing,
        },
        summaryCardProgress: {
          flex: 1,
          backgroundColor: '#FFE4E6',
          borderRadius: 12,
          padding: spacing,
        },
        summaryCardTime: {
          flex: 1,
          backgroundColor: '#D1FAE5',
          borderRadius: 12,
          padding: spacing,
        },
        summaryCardLabelRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing / 2,
          marginBottom: spacing / 2,
        },
        summaryCardLabel: {
          fontSize: Math.max(12, fontSize - 2),
          color: themeColors.textSecondary,
          lineHeight: fontSize + spacing / 2,
        },
        summaryCardValueProgress: {
          fontSize: Math.max(18, fontSize + 4),
          fontWeight: '700',
          color: themeColors.accent,
        },
        summaryCardValueTime: {
          fontSize: Math.max(18, fontSize + 4),
          fontWeight: '700',
          color: '#065F46',
        },
        actionsRow: { flexDirection: 'row', gap: spacing },
        editarBtn: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F3F4F6',
          borderRadius: 10,
          paddingVertical: spacing,
          gap: spacing / 2,
        },
        editarText: {
          fontSize: Math.max(14, fontSize),
          fontWeight: '600',
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing,
        },
        reabrirBtn: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: themeColors.accent,
          borderRadius: 10,
          paddingVertical: spacing,
          gap: spacing / 2,
        },
        reabrirIcon: { fontSize: Math.max(14, fontSize), color: '#FFFFFF' },
        reabrirText: {
          fontSize: Math.max(14, fontSize),
          fontWeight: '600',
          color: '#FFFFFF',
          lineHeight: fontSize + spacing,
        },
      }),
    [themeColors, spacing, fontSize],
  );

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
                onPress={() => onEdit && onEdit(task)}
                activeOpacity={0.8}
              >
                <Feather name="edit-2" size={20} color={themeColors.textPrimary} />
                <Text style={styles.editarText}>Editar</Text>
              </TouchableOpacity>
              {task.completed && (
                <TouchableOpacity
                  style={styles.reabrirBtn}
                  onPress={() => onOpen(task.id)}
                  activeOpacity={0.8}
                >
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
