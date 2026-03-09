import { useCognitiveSettings } from '@/data-access';
import { Priority, PRIORITY_LABELS, CATEGORY_OPTIONS, Task, Category } from '@/data-access';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export type NewTaskForm = {
  title: string;
  category: string;
  priority: Priority;
  estimatedTime: string;
};

type AddTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (form: NewTaskForm) => void;
  editingTask?: Task | null;
};

const PRIORITIES: Priority[] = ['alta', 'media', 'baixa'];

export function AddTaskModal({ visible, onClose, onAdd, editingTask }: AddTaskModalProps) {
  const { themeColors, spacing, fontSize } = useCognitiveSettings();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORY_OPTIONS[0]);
  const [priority, setPriority] = useState<Priority>('alta');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  React.useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setEstimatedTime(editingTask.estimatedTime);
    }
  }, [editingTask]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        },
        keyboard: { 
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
          lineHeight: fontSize + spacing,
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
        scroll: { maxHeight: 400 },
        scrollContent: { paddingBottom: spacing * 2 },
        label: {
          fontSize,
          fontWeight: '600',
          color: themeColors.textPrimary,
          marginBottom: spacing / 2,
          lineHeight: fontSize + spacing,
        },
        input: {
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 10,
          paddingHorizontal: spacing,
          paddingVertical: spacing,
          fontSize: Math.max(14, fontSize),
          color: themeColors.textPrimary,
          marginBottom: spacing,
        },
        select: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 10,
          paddingHorizontal: spacing,
          paddingVertical: spacing,
          marginBottom: spacing,
        },
        selectText: {
          fontSize: Math.max(14, fontSize),
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing,
        },
        selectArrow: {
          fontSize: Math.max(12, fontSize - 2),
          color: themeColors.textMuted,
        },
        dropdown: {
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 10,
          marginTop: -spacing,
          marginBottom: spacing,
          overflow: 'hidden',
        },
        dropdownItem: {
          paddingVertical: spacing,
          paddingHorizontal: spacing,
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        },
        dropdownItemText: {
          fontSize: Math.max(14, fontSize),
          color: themeColors.textPrimary,
          lineHeight: fontSize + spacing,
        },
        addBtn: {
          backgroundColor: themeColors.accent,
          borderRadius: 12,
          paddingVertical: spacing,
          alignItems: 'center',
          marginTop: spacing / 2,
          paddingHorizontal: spacing,
        },
        addBtnText: {
          fontSize: Math.max(14, fontSize),
          fontWeight: '700',
          color: '#FFFFFF',
          lineHeight: fontSize + spacing,
        },
      }),
    [themeColors, spacing, fontSize],
  );

  const reset = () => {
    setTitle('');
    setCategory(CATEGORY_OPTIONS[0]);
    setPriority('alta');
    setEstimatedTime('');
    setCategoryOpen(false);
    setPriorityOpen(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAdd = () => {
    const t = title.trim();
    if (!t) return;
    onAdd({
      title: t,
      category,
      priority,
      estimatedTime: estimatedTime.trim() || '0 min',
    });
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeBtn}
                hitSlop={12}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Título da tarefa</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Revisar relatório mensal"
                placeholderTextColor={themeColors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
              <Text style={styles.label}>Categoria</Text>
              <TouchableOpacity
                style={styles.select}
                onPress={() => {
                  setPriorityOpen(false);
                  setCategoryOpen((v) => !v);
                }}
              >
                <Text style={styles.selectText}>{category}</Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
              {categoryOpen && (
                <View style={styles.dropdown}>
                  {CATEGORY_OPTIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(c);
                        setCategoryOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text style={styles.label}>Prioridade</Text>
              <TouchableOpacity
                style={styles.select}
                onPress={() => {
                  setCategoryOpen(false);
                  setPriorityOpen((v) => !v);
                }}
              >
                <Text style={styles.selectText}>{PRIORITY_LABELS[priority]}</Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
              {priorityOpen && (
                <View style={styles.dropdown}>
                  {PRIORITIES.map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setPriority(p);
                        setPriorityOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {PRIORITY_LABELS[p]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text style={styles.label}>Tempo estimado</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 30 min"
                placeholderTextColor={themeColors.textMuted}
                value={estimatedTime}
                onChangeText={setEstimatedTime}
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAdd}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>{editingTask ? 'Salvar' : 'Adicionar tarefa'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
