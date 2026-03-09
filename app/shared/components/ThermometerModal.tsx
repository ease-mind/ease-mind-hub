import { useSymptom, SymptomEntity, UserSymptomRecordEntity } from '@/data-access';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { useCognitiveSettings, useAuth } from '@/data-access';
import { EasemindButton } from '@/shared/ui/Button';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ThermometerModalProps {
    visible: boolean;
    onClose: () => void;
    onSave?: () => void;
}

export const ThermometerModal: React.FC<ThermometerModalProps> = ({ visible, onClose, onSave }) => {
    const { user } = useAuth();
    const { themeColors, fontSize, spacing, contrast, complexity } = useCognitiveSettings();
    const { getAllSymptoms, saveUserSymptoms, getLatestUserSymptoms, loading: symptomLoading } = useSymptom();
    const [symptoms, setSymptoms] = useState<SymptomEntity[]>([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState<'questionnaire' | 'list'>('questionnaire');

    const getContrastStyles = () => {
        if (contrast === 'high') {
            return {
                borderWidth: 2,
                shadowOpacity: 0.2,
                fontWeight: '700' as const,
            };
        }
        if (contrast === 'low') {
            return {
                borderWidth: 0,
                shadowOpacity: 0.05,
                fontWeight: '400' as const,
            };
        }

        return {
            borderWidth: 1,
            shadowOpacity: 0.1,
            fontWeight: '600' as const,
        };
    };

    const contrastStyles = getContrastStyles();

    useEffect(() => {
        if (visible) {
            loadSymptoms();
            loadUserSymptoms();
            setCurrentQuestionIndex(0);
            setViewMode('questionnaire');
        }
    }, [visible]);

    const loadSymptoms = async () => {
        setLoading(true);
        try {
            const data = await getAllSymptoms();
            setSymptoms(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erro ao carregar sintomas:', err);
            setSymptoms([]);
        } finally {
            setLoading(false);
        }
    };

    const loadUserSymptoms = async () => {
        if (!user?._id) return;
        try {
            const result = await getLatestUserSymptoms(user._id);
            if (result?.selectedSymptoms) {
                setSelectedSymptoms(result.selectedSymptoms);
            }
        } catch (err) {
            console.error('Erro ao carregar sintomas do usuário:', err);
        }
    };

    const handleAnswer = (answer: boolean) => {
        const currentSymptom = symptoms[currentQuestionIndex];

        if (answer) {
            if (!selectedSymptoms.includes(currentSymptom.id)) {
                setSelectedSymptoms([...selectedSymptoms, currentSymptom.id]);
            }
        } else {
            setSelectedSymptoms(selectedSymptoms.filter(id => id !== currentSymptom.id));
        }

        if (currentQuestionIndex < symptoms.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        if (!user?._id) return;

        setSaving(true);
        const data: UserSymptomRecordEntity = {
            userId: user._id,
            selectedSymptoms,
            temperature: getTemperature(),
            level: getTemperatureLevel() || 'Calmo',
            timestamp: new Date(),
            categoryCount: {
                communication: getCategoryCount('communication'),
                physical: getCategoryCount('physical'),
                stereotypies: getCategoryCount('stereotypies'),
            },
        };

        try {
            await saveUserSymptoms(data);
            setCurrentQuestionIndex(0);
            onSave?.();
            onClose();
        } catch (err) {
            console.error('Erro ao salvar sintomas:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSymptomToggle = (symptomId: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId) ? prev.filter(id => id !== symptomId) : [...prev, symptomId]
        );
    };

    const handleFinishList = async () => {
        if (!user?._id) return;

        setSaving(true);
        const data: UserSymptomRecordEntity = {
            userId: user._id,
            selectedSymptoms,
            temperature: getTemperature(),
            level: getTemperatureLevel() || 'Calmo',
            timestamp: new Date(),
            categoryCount: {
                communication: getCategoryCount('communication'),
                physical: getCategoryCount('physical'),
                stereotypies: getCategoryCount('stereotypies'),
            },
        };

        try {
            await saveUserSymptoms(data);
            onSave?.();
            onClose();
        } catch (err) {
            console.error('Erro ao salvar sintomas:', err);
        } finally {
            setSaving(false);
        }
    };

    const getTemperature = () => {
        const count = selectedSymptoms.length;
        if (count === 0) return 0;
        if (count <= 3) return 36;
        if (count <= 7) return 38;
        if (count <= 9) return 40;
        return 40;
    };

    const getTemperatureLevel = () => {
        const temp = getTemperature();
        if (temp === 0) return '';
        if (temp <= 36) return 'Calmo';
        if (temp <= 38) return 'Alerta';
        if (temp >= 39) return 'Sobrecarga';
    };

    const getCategoryCount = (category: string) => {
        return selectedSymptoms.filter((id) => symptoms.find((s) => s.id === id)?.category === category).length;
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'communication':
                return <MaterialIcons name="cancel" size={24} color={ColorsPalette.light['coral.500']} />;
            case 'physical':
                return <Feather name="zap" size={24} color="#FFC107" />;
            case 'stereotypies':
                return <MaterialCommunityIcons name="chart-line" size={24} color="#2196F3" />;
            default:
                return null;
        }
    };

    const getCategoryTitle = (category: string) => {
        switch (category) {
            case 'communication':
                return 'Comunicação';
            case 'physical':
                return 'Sintomas Físicos';
            case 'stereotypies':
                return 'Estereotipias';
            default:
                return '';
        }
    };

    const currentSymptom = symptoms[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / symptoms.length) * 100;

    if (loading) {
        return (
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color={ColorsPalette.light['coral.700']} />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
                    <View style={[styles.modalHeader, { padding: spacing * 2, borderBottomWidth: themeColors.borderDividerWidth, borderBottomColor: themeColors.borderDivider }]}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.iconContainer, { width: spacing * 4, height: spacing * 4, borderRadius: spacing * 2 }]}>
                                <Feather name="thermometer" size={fontSize * 1.5} color={themeColors.accent} />
                            </View>
                            <View>
                                <Text style={[styles.modalTitle, { fontSize: fontSize + 4, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight }]}>Nova Avaliação</Text>
                                <Text style={[styles.modalSubtitle, { fontSize, color: themeColors.textSecondary, marginTop: spacing / 4 }]}>
                                    {viewMode === 'questionnaire'
                                        ? `Pergunta ${currentQuestionIndex + 1} de ${symptoms.length}`
                                        : `${selectedSymptoms.length} sintomas selecionados`}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={[styles.closeButton, { width: spacing * 3, height: spacing * 3, borderRadius: spacing * 1.5, backgroundColor: themeColors.sliderTrack }]}>
                            <MaterialIcons name="close" size={fontSize * 1.5} color={themeColors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {complexity !== 'simple' && (
                        <View style={[styles.viewModeContainer, { paddingHorizontal: spacing * 2, paddingTop: spacing, gap: spacing }]}>
                            <TouchableOpacity
                                style={[
                                    styles.viewModeButton,
                                    {
                                        paddingVertical: spacing,
                                        paddingHorizontal: spacing * 1.5,
                                        borderRadius: spacing,
                                        gap: spacing / 2,
                                        borderWidth: contrastStyles.borderWidth,
                                        borderColor: viewMode === 'questionnaire' ? themeColors.accent : 'transparent',
                                    },
                                    viewMode === 'questionnaire' && { backgroundColor: themeColors.accent }
                                ]}
                                onPress={() => setViewMode('questionnaire')}
                            >
                                <Feather name="help-circle" size={fontSize} color={viewMode === 'questionnaire' ? '#FFF' : themeColors.textSecondary} />
                                <Text style={[styles.viewModeText, { fontSize, fontWeight: contrastStyles.fontWeight, color: viewMode === 'questionnaire' ? '#FFF' : themeColors.textSecondary }]}>
                                    Questionário
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.viewModeButton,
                                    {
                                        paddingVertical: spacing,
                                        paddingHorizontal: spacing * 1.5,
                                        borderRadius: spacing,
                                        gap: spacing / 2,
                                        borderWidth: contrastStyles.borderWidth,
                                        borderColor: viewMode === 'list' ? themeColors.accent : 'transparent',
                                    },
                                    viewMode === 'list' && { backgroundColor: themeColors.accent }
                                ]}
                                onPress={() => setViewMode('list')}
                            >
                                <Feather name="list" size={fontSize} color={viewMode === 'list' ? '#FFF' : themeColors.textSecondary} />
                                <Text style={[styles.viewModeText, { fontSize, fontWeight: contrastStyles.fontWeight, color: viewMode === 'list' ? '#FFF' : themeColors.textSecondary }]}>
                                    Lista Completa
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {viewMode === 'questionnaire' ? (
                        <>
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                                </View>
                            </View>

                            <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
                                {currentSymptom && (
                                    <>
                                        <View style={styles.categoryBadge}>
                                            {getCategoryIcon(currentSymptom.category)}
                                            <Text style={styles.categoryText}>{getCategoryTitle(currentSymptom.category)}</Text>
                                        </View>

                                        <Text style={styles.questionText}>Você está sentindo isso?</Text>

                                        <View style={styles.symptomCard}>
                                            <Text style={styles.symptomLabel}>{currentSymptom.label}</Text>
                                        </View>

                                        <View style={[styles.buttonsContainer, { gap: spacing }]}>
                                            <EasemindButton
                                                variant="secondary"
                                                onPress={() => handleAnswer(false)}
                                                style={{ flex: 1 }}
                                            >
                                                Não
                                            </EasemindButton>
                                            <EasemindButton
                                                variant="primary"
                                                onPress={() => handleAnswer(true)}
                                                style={{ flex: 1 }}
                                            >
                                                Sim
                                            </EasemindButton>
                                        </View>
                                    </>
                                )}
                            </ScrollView>
                        </>
                    ) : (
                        <ScrollView style={[styles.listContainer, { paddingHorizontal: spacing * 2, paddingTop: spacing * 2 }]} showsVerticalScrollIndicator={false}>
                            <View style={[styles.categorySection, { marginBottom: spacing * 3 }]}>
                                <View style={[styles.categorySectionHeader, { gap: spacing, marginBottom: spacing * 2 }]}>
                                    <MaterialIcons name="cancel" size={fontSize * 1.5} color={ColorsPalette.light['coral.500']} />
                                    <Text style={[styles.categorySectionTitle, { fontSize: fontSize + 4, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight }]}>Falha na Comunicação</Text>
                                </View>
                                <View style={[styles.symptomsGrid, { gap: spacing }]}>
                                    {symptoms
                                        .filter((s) => s.category === 'communication')
                                        .map((symptom) => (
                                            <TouchableOpacity
                                                key={symptom.id}
                                                onPress={() => handleSymptomToggle(symptom.id)}
                                                style={[
                                                    styles.symptomListCard,
                                                    { 
                                                        padding: spacing * 1.5,
                                                        borderWidth: contrastStyles.borderWidth,
                                                        borderColor: selectedSymptoms.includes(symptom.id) ? themeColors.accent : themeColors.borderDivider,
                                                        borderRadius: spacing,
                                                        backgroundColor: selectedSymptoms.includes(symptom.id) ? themeColors.segmentedSelected : themeColors.cardBackground,
                                                        shadowOpacity: contrastStyles.shadowOpacity,
                                                    },
                                                ]}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing }}>
                                                    <View
                                                        style={[
                                                            styles.radio,
                                                            { 
                                                                width: spacing * 1.5,
                                                                height: spacing * 1.5,
                                                                borderRadius: spacing * 0.75,
                                                                borderWidth: contrastStyles.borderWidth,
                                                                borderColor: selectedSymptoms.includes(symptom.id) ? themeColors.accent : themeColors.borderDivider,
                                                            },
                                                        ]}
                                                    >
                                                        {selectedSymptoms.includes(symptom.id) && <View style={[styles.radioInner, { width: spacing * 0.75, height: spacing * 0.75, borderRadius: spacing * 0.375, backgroundColor: themeColors.accent }]} />}
                                                    </View>
                                                    <Text style={[styles.symptomListText, { fontSize, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight, flex: 1 }]}>{symptom.label}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>

                            <View style={[styles.categorySection, { marginBottom: spacing * 3 }]}>
                                <View style={[styles.categorySectionHeader, { gap: spacing, marginBottom: spacing * 2 }]}>
                                    <Feather name="zap" size={fontSize * 1.5} color="#FFC107" />
                                    <Text style={[styles.categorySectionTitle, { fontSize: fontSize + 4, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight }]}>Sintomas Físicos</Text>
                                </View>
                                <View style={[styles.symptomsGrid, { gap: spacing }]}>
                                    {symptoms
                                        .filter((s) => s.category === 'physical')
                                        .map((symptom) => (
                                            <TouchableOpacity
                                                key={symptom.id}
                                                onPress={() => handleSymptomToggle(symptom.id)}
                                                style={[
                                                    styles.symptomListCard,
                                                    { 
                                                        padding: spacing * 1.5,
                                                        borderWidth: contrastStyles.borderWidth,
                                                        borderColor: selectedSymptoms.includes(symptom.id) ? themeColors.accent : themeColors.borderDivider,
                                                        borderRadius: spacing,
                                                        backgroundColor: selectedSymptoms.includes(symptom.id) ? themeColors.segmentedSelected : themeColors.cardBackground,
                                                        shadowOpacity: contrastStyles.shadowOpacity,
                                                    },
                                                ]}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing }}>
                                                    <View
                                                        style={[
                                                            styles.radio,
                                                            { 
                                                                width: spacing * 1.5,
                                                                height: spacing * 1.5,
                                                                borderRadius: spacing * 0.75,
                                                                borderWidth: contrastStyles.borderWidth,
                                                                borderColor: selectedSymptoms.includes(symptom.id) ? themeColors.accent : themeColors.borderDivider,
                                                            },
                                                        ]}
                                                    >
                                                        {selectedSymptoms.includes(symptom.id) && <View style={[styles.radioInner, { width: spacing * 0.75, height: spacing * 0.75, borderRadius: spacing * 0.375, backgroundColor: themeColors.accent }]} />}
                                                    </View>
                                                    <Text style={[styles.symptomListText, { fontSize, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight, flex: 1 }]}>{symptom.label}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>

                            <View style={[styles.categorySection, { marginBottom: spacing * 3 }]}>
                                <View style={[styles.categorySectionHeader, { gap: spacing, marginBottom: spacing * 2 }]}>
                                    <MaterialCommunityIcons name="chart-line" size={fontSize * 1.5} color="#2196F3" />
                                    <Text style={[styles.categorySectionTitle, { fontSize: fontSize + 4, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight }]}>Aumento de Estereotipias</Text>
                                </View>
                                <View style={[styles.symptomsGrid, { gap: spacing }]}>
                                    {symptoms
                                        .filter((s) => s.category === 'stereotypies')
                                        .map((symptom) => (
                                            <TouchableOpacity
                                                key={symptom.id}
                                                onPress={() => handleSymptomToggle(symptom.id)}
                                                style={[
                                                    styles.symptomListCard,
                                                    { 
                                                        padding: spacing * 1.5,
                                                        borderWidth: contrastStyles.borderWidth,
                                                        borderColor: selectedSymptoms.includes(symptom.id) ? themeColors.accent : themeColors.borderDivider,
                                                        borderRadius: spacing,
                                                        backgroundColor: selectedSymptoms.includes(symptom.id) ? themeColors.segmentedSelected : themeColors.cardBackground,
                                                        shadowOpacity: contrastStyles.shadowOpacity,
                                                    },
                                                ]}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing }}>
                                                    <View
                                                        style={[
                                                            styles.radio,
                                                            { 
                                                                width: spacing * 1.5,
                                                                height: spacing * 1.5,
                                                                borderRadius: spacing * 0.75,
                                                                borderWidth: contrastStyles.borderWidth,
                                                                borderColor: selectedSymptoms.includes(symptom.id) ? themeColors.accent : themeColors.borderDivider,
                                                            },
                                                        ]}
                                                    >
                                                        {selectedSymptoms.includes(symptom.id) && <View style={[styles.radioInner, { width: spacing * 0.75, height: spacing * 0.75, borderRadius: spacing * 0.375, backgroundColor: themeColors.accent }]} />}
                                                    </View>
                                                    <Text style={[styles.symptomListText, { fontSize, color: themeColors.textPrimary, fontWeight: contrastStyles.fontWeight, flex: 1 }]}>{symptom.label}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>

                            <View style={{ marginTop: spacing, marginBottom: spacing * 2 }}>
                                <EasemindButton
                                    variant="primary"
                                    onPress={handleFinishList}
                                    disabled={saving}
                                    loading={saving}
                                    fullWidth
                                >
                                    Concluir
                                </EasemindButton>
                            </View>

                            <View style={{ height: spacing * 2 }} />
                        </ScrollView>
                    )}

                    {saving && viewMode === 'questionnaire' && (
                        <View style={styles.savingIndicator}>
                            <ActivityIndicator size="small" color={ColorsPalette.light['coral.500']} />
                            <Text style={styles.savingText}>Salvando...</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        padding: 0,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: '100%',
        height: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: ColorsPalette.light['coral.500'],
        borderRadius: 3,
    },
    questionContainer: {
        flex: 1,
        padding: 20,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 24,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 32,
    },
    symptomCard: {
        backgroundColor: '#F9FAFB',
        padding: 24,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        marginBottom: 32,
    },
    symptomLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    savingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    savingText: {
        fontSize: 14,
        color: '#6B7280',
    },
    viewModeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    viewModeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        gap: 8,
    },
    viewModeButtonActive: {
        backgroundColor: ColorsPalette.light['coral.500'],
    },
    viewModeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    viewModeTextActive: {
        color: '#FFF',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    categorySection: {
        marginBottom: 24,
    },
    categorySectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    categorySectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    symptomsGrid: {
        gap: 12,
    },
    symptomListCard: {
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    symptomListCardSelected: {
        borderColor: ColorsPalette.light['coral.500'],
        backgroundColor: '#FFF1F2',
    },
    symptomListText: {
        fontSize: 15,
        color: '#374151',
        flex: 1,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: ColorsPalette.light['coral.500'],
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: ColorsPalette.light['coral.500'],
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsPalette.light['coral.500'],
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
});
