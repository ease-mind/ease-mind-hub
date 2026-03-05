import { useAuth } from '@/shared/contexts';
import { ScreenHeader } from '@/shared/components';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { maskDocument } from '@/shared/helpers/maskDocument';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { EasemindInput } from '@/shared/ui/Input/Input';
import { EasemindInputController } from '@/shared/ui/Input/InputController';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
    const { user, updateUser, updateUserProfileImage, logout } = useAuth();
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const formMethods = useForm({
        mode: 'onChange',
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            document: user?.document || '',
        }
    });

    useEffect(() => { 
        formMethods.reset({
            name: user?.name || '',
            email: user?.email || '',
            document: user?.document || '',
        });
    }, [user]);
    
    const handleEditProfileImage = async () => {
        try {
            setIsUploadingImage(true);

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
                setIsUploadingImage(false);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
            });

            if (result.canceled) {
                setIsUploadingImage(false);
                return;
            }

            const selectedImage = result.assets?.[0];
            if (!selectedImage || !selectedImage.uri) {
                showFeedback("error");
                setIsUploadingImage(false);
                return;
            }

            const file = {
                uri: selectedImage.uri,
                type: selectedImage.type || 'image/jpeg',
                name: selectedImage.fileName || `profile-${Date.now()}.jpg`,
            };

            await updateUserProfileImage(file);
            showFeedback("success");
        } catch (error) {
            console.error('Erro ao atualizar a foto:', error);
            showFeedback("error");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSaveProfile = async (data: { name: string, email: string, document: string }) => {
        try {
            setIsSaving(true);
            await updateUser({ name: data.name, email: data.email, document: data.document });
            showFeedback("success");
            setIsEditing(false);
        } catch (error) {
            showFeedback("error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        formMethods.reset({
            name: user?.name || '',
            email: user?.email || '',
            document: user?.document || '',
        });
        setIsEditing(false);
    };

    const handleLogout = async () => {
        Alert.alert(
            'Confirmar saída',
            'Deseja realmente sair da sua conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            router.replace('/(auth)/account-access');
                        } catch (error) {
                            console.error('Erro ao fazer logout:', error);
                            showFeedback("error");
                        }
                    }
                }
            ]
        );
    };

    return (
        <>
            <ScreenHeader title="Meu Perfil" subtitle="Configure suas informações" />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    bounces={true}
                >
                    <View style={styles.profileSection}>
                        <TouchableOpacity 
                            onPress={handleEditProfileImage} 
                            disabled={isUploadingImage}
                            activeOpacity={0.8}
                        >
                            <View style={styles.profileImageContainer}>
                                <View style={styles.profileImage}>
                                    {isUploadingImage ? (
                                        <ActivityIndicator size="large" color={ColorsPalette.light['coral.400']} />
                                    ) : user && user.image ? (
                                        <Image source={{ uri: user.image }} style={styles.profileImageFill} />
                                    ) : (
                                        <MaterialIcons name="account-circle" size={80} color={ColorsPalette.light['coral.300']} />
                                    )}
                                </View>
                                <View style={styles.cameraIconContainer}>
                                    <Feather name="camera" size={18} color="#fff" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.userName}>{formMethods.watch('name') || 'Usuário'}</Text>
                        <Text style={styles.userEmail}>{user?.email || ''}</Text>
                    </View>

                    <View style={styles.cardContainer}>
                        <View style={styles.cardHeader}>
                            <Feather name="user" size={20} color={ColorsPalette.light['coral.600']} />
                            <Text style={styles.cardTitle}>Informações Pessoais</Text>
                        </View>

                        <FormProvider {...formMethods}>
                            <View style={styles.formSection}>
                                <EasemindInputController
                                    name="name"
                                    label={'Nome completo'}
                                    placeholder="Seu nome"
                                    editable={isEditing}
                                    rules={{ required: 'Nome é obrigatório' }}
                                />
                                <EasemindInputController
                                    name="email"
                                    label={'E-mail'}
                                    placeholder="email@example.com"
                                    editable={isEditing}
                                    keyboardType="email-address"
                                    rules={{
                                        required: "E-mail obrigatório",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "E-mail é inválido"
                                        }
                                    }}
                                />
                                <Controller
                                    control={formMethods.control}
                                    name="document"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <EasemindInput
                                            label={'Documento (CPF)'}
                                            value={value}
                                            onBlur={onBlur}
                                            onChangeText={(text) => onChange(maskDocument(text))}
                                            placeholder="000.000.000-00"
                                            editable={isEditing}
                                            keyboardType="numeric"
                                            maxLength={14}
                                        />
                                    )}
                                />
                            </View>
                        </FormProvider>
                    </View>

                    <View style={styles.actionsSection}>
                        {isEditing ? (
                            <View style={styles.editActionsContainer}>
                                <TouchableOpacity 
                                    style={styles.cancelButton} 
                                    onPress={handleCancelEdit}
                                    disabled={isSaving}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
                                    onPress={formMethods.handleSubmit(handleSaveProfile)}
                                    disabled={isSaving || !formMethods.formState.isValid}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Feather name="check" size={20} color="#fff" />
                                            <Text style={styles.saveButtonText}>Salvar</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.editButton} 
                                onPress={() => setIsEditing(true)}
                                activeOpacity={0.7}
                            >
                                <Feather name="edit-2" size={20} color={ColorsPalette.light['coral.600']} />
                                <Text style={styles.editButtonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={handleLogout}
                            activeOpacity={0.7}
                        >
                            <Feather name="log-out" size={20} color={ColorsPalette.light['coral.600']} />
                            <Text style={styles.logoutButtonText}>Sair da conta</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <FeedbackAnimation />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorsPalette.light['coral.50'],
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    profileImageFill: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: ColorsPalette.light['coral.600'],
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    cardContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    formSection: {
        gap: 4,
    },
    actionsSection: {
        padding: 20,
        gap: 12,
    },
    editActionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: ColorsPalette.light['coral.600'],
        shadowColor: ColorsPalette.light['coral.600'],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: ColorsPalette.light['coral.50'],
        borderWidth: 2,
        borderColor: ColorsPalette.light['coral.200'],
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: ColorsPalette.light['coral.600'],
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: ColorsPalette.light['coral.200'],
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: ColorsPalette.light['coral.600'],
    },
});

export default ProfileScreen;