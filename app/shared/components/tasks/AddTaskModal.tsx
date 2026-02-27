import { themeColors } from '@/shared/classes/constants/themeColors';
import { Priority, PRIORITY_LABELS, CATEGORY_OPTIONS } from '@/shared/types/tasks';
import React, { useState } from 'react';
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
};

const PRIORITIES: Priority[] = ['alta', 'media', 'baixa'];

export function AddTaskModal({ visible, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>(CATEGORY_OPTIONS[0]);
  const [priority, setPriority] = useState<Priority>('alta');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

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
              <Text style={styles.headerTitle}>Nova Tarefa</Text>
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
                <Text style={styles.addBtnText}>Adicionar Tarefa</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
  keyboard: {
    maxHeight: '85%',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: themeColors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: themeColors.textPrimary,
    marginBottom: 16,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  selectText: {
    fontSize: 16,
    color: themeColors.textPrimary,
  },
  selectArrow: {
    fontSize: 12,
    color: themeColors.textMuted,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginTop: -12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: themeColors.textPrimary,
  },
  addBtn: {
    backgroundColor: themeColors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
