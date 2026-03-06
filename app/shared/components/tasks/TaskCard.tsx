import { useCognitiveSettings } from '@/shared/contexts';
import { Task, PRIORITY_LABELS } from '@/shared/types/tasks';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TaskCardProps = {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onClickDetails: (task: Task) => void;
  onEdit?: (task: Task) => void;
};

const priorityBg: Record<string, string> = {
  alta: '#FFE4E6',
  media: '#FEF9C3',
  baixa: '#D1FAE5',
};

export function TaskCard({ task, onToggleComplete, onClickDetails, onEdit }: TaskCardProps) {
  const { complexity, themeColors, fontSize, spacing, contrast } = useCognitiveSettings();
  const isSimple = complexity === 'simple';

  const priorityText: Record<string, string> = {
    alta: themeColors.accent,
    media: '#854D0E',
    baixa: '#065F46',
  };

  const getContrastStyles = () => {
    if (contrast === 'high') {
      return {
        borderWidth: 2,
        borderColor: themeColors.textPrimary,
        shadowOpacity: 0.15,
        fontWeight: '700' as const,
        checkboxBorderWidth: 3,
      };
    }
    if (contrast === 'low') {
      return {
        borderWidth: 0,
        borderColor: 'transparent',
        shadowOpacity: 0.03,
        fontWeight: '400' as const,
        checkboxBorderWidth: 1,
      };
    }

    return {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowOpacity: 0.05,
      fontWeight: '600' as const,
      checkboxBorderWidth: 2,
    };
  };

  const contrastStyles = getContrastStyles();

  if (isSimple) {
    return (
      <View style={[
        styles.card, 
        { 
          borderColor: contrastStyles.borderColor, 
          borderWidth: contrastStyles.borderWidth,
          marginBottom: spacing, 
          padding: spacing,
          shadowOpacity: contrastStyles.shadowOpacity,
        }
      ]}>
        <View style={styles.simpleContent}>
          <Text
            style={[
              styles.simpleTitle,
              { 
                color: themeColors.textPrimary, 
                fontSize: Math.max(14, Math.min(20, fontSize + 2)),
                fontWeight: contrastStyles.fontWeight,
              },
              task.completed && styles.titleStrike,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          <TouchableOpacity
            style={[styles.verDetalhesBtn, { backgroundColor: themeColors.segmentedSelected || '#FFE4E6', paddingHorizontal: spacing, paddingVertical: spacing / 2 }]}
            onPress={() => onClickDetails(task)}
            activeOpacity={0.8}
          >
            <Feather name="file-text" size={fontSize} color={themeColors.accent} />
            <Text style={[styles.verDetalhesText, { color: themeColors.accent, fontSize, fontWeight: contrastStyles.fontWeight }]}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <View style={[
      styles.card, 
      { 
        marginBottom: spacing, 
        padding: spacing,
        borderWidth: contrastStyles.borderWidth,
        borderColor: contrastStyles.borderColor,
        shadowOpacity: contrastStyles.shadowOpacity,
      }
    ]}>
      <TouchableOpacity
        onPress={() => onToggleComplete(task.id)}
        style={[styles.checkboxWrap, { marginRight: spacing }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={[
          styles.checkbox, 
          { borderWidth: contrastStyles.checkboxBorderWidth },
          task.completed && styles.checkboxChecked
        ]}>
          {task.completed ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { 
              color: themeColors.textPrimary, 
              fontSize: Math.max(14, Math.min(20, fontSize + 2)),
              fontWeight: contrastStyles.fontWeight,
            },
            task.completed && styles.titleStrike,
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={[styles.labelsRow, { gap: spacing / 2, marginBottom: spacing / 2 }]}>
          <View style={[styles.pill, { backgroundColor: priorityBg[task.priority], paddingHorizontal: spacing, paddingVertical: spacing / 3 }]}>
            <Text style={[styles.pillText, { color: priorityText[task.priority], fontSize: Math.max(10, fontSize - 2), fontWeight: contrastStyles.fontWeight }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          </View>
          <View style={[styles.pillCategory, { paddingHorizontal: spacing, paddingVertical: spacing / 3, backgroundColor: themeColors.sliderTrack }]}>
            <Text style={[styles.pillCategoryText, { color: themeColors.textSecondary, fontSize: Math.max(10, fontSize - 2) }]}>{task.category}</Text>
          </View>
        </View>
        <View style={[styles.metaRow, { gap: spacing, marginBottom: spacing }]}>
          <Feather name="clock" size={fontSize} color={themeColors.textMuted} />
          <Text style={[styles.metaText, { color: themeColors.textMuted, fontSize }]}>{task.estimatedTime}</Text>
          <Feather name="list" size={fontSize} color={themeColors.textMuted} />
          <Text style={[styles.metaText, { color: themeColors.textMuted, fontSize }]}>
            {completedCount}/{totalSubtasks} subtarefas
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.verDetalhesBtn, { backgroundColor: themeColors.segmentedSelected || '#FFE4E6', paddingHorizontal: spacing, paddingVertical: spacing / 2 }]}
          onPress={() => onClickDetails(task)}
          activeOpacity={0.8}
        >
          <Feather name="file-text" size={fontSize} color={themeColors.accent} />
          <Text style={[styles.verDetalhesText, { color: themeColors.accent, fontSize: Math.max(12, fontSize - 2), fontWeight: contrastStyles.fontWeight }]}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  simpleContent: {
    flex: 1,
    gap: 12,
  },
  simpleTitle: {
    fontWeight: '600',
  },
  titleStrike: {
    textDecorationLine: 'line-through',
    color: '#9e9e9e',
  },
  checkboxWrap: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
  },
  labelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillCategory: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillCategoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
  },
  verDetalhesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  verDetalhesText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
