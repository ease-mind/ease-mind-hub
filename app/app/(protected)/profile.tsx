import { useAuth, useCognitiveSettings } from '@/data-access';
import { ScreenHeader, ScreenFadeIn } from '@/shared/components';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { maskDocument } from '@/shared/helpers/maskDocument';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { EasemindInput } from '@/shared/ui/Input/Input';
import { EasemindInputController } from '@/shared/ui/Input/InputController';
import { EasemindButton } from '@/shared/ui/Button';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const { user, logout, updateUser, updateUserProfileImage } = useAuth();
    const { themeColors, spacing, fontSize, contrast } = useCognitiveSettings();
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
            await updateUser({ 
                name: data.name, 
                email: data.email, 
                document: data.document 
            });
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

    const isHighContrast = contrast === 'high';
    const isLowContrast = contrast === 'low';

    const getContrastBorderWidth = () => isHighContrast ? 2 : 1;
    const getContrastShadowOpacity = () => {
        if (isLowContrast) return 0.02;
        if (isHighContrast) return 0.15;
        return 0.05;
    };
    const getProfileBorderWidth = () => isHighContrast ? 6 : 4;

    return (
        <>
        <ScreenFadeIn>
            <ScreenHeader title="Meu Perfil" subtitle="Configure suas informações" />
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[{ paddingBottom: spacing * 8 }]}
                    bounces={true}
                >
                    <View style={[styles.profileSection, { 
                        paddingVertical: spacing * 2,
                        backgroundColor: themeColors.cardBackground,
                        borderBottomWidth: getContrastBorderWidth(),
                        borderBottomColor: isHighContrast ? themeColors.borderDivider : '#f0f0f0'
                    }]}>
                        <TouchableOpacity 
                            onPress={handleEditProfileImage} 
                            disabled={isUploadingImage}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.profileImageContainer, { marginBottom: spacing }]}>
                                <View style={[styles.profileImage, {
                                    borderWidth: getProfileBorderWidth(),
                                    borderColor: isHighContrast ? themeColors.borderDivider : '#fff',
                                    shadowOpacity: getContrastShadowOpacity(),
                                }]}>
                                    {isUploadingImage ? (
                                        <ActivityIndicator size="large" color={ColorsPalette.light['coral.400']} />
                                    ) : user && user.image ? (
                                        <Image source={{ uri: user.image }} style={styles.profileImageFill} />
                                    ) : (
                                        <MaterialIcons name="account-circle" size={80} color={ColorsPalette.light['coral.300']} />
                                    )}
                                </View>
                                <View style={[styles.cameraIconContainer, {
                                    borderWidth: isHighContrast ? 4 : 3,
                                    borderColor: isHighContrast ? themeColors.borderDivider : '#fff',
                                    shadowOpacity: getContrastShadowOpacity() * 2,
                                }]}>
                                    <Feather name="camera" size={18} color="#fff" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.userName, { 
                            fontSize: fontSize + 10, 
                            color: themeColors.textPrimary,
                            marginBottom: spacing / 4,
                            fontWeight: isHighContrast ? '800' : '700'
                        }]}>
                            {formMethods.watch('name') || 'Usuário'}
                        </Text>
                        <Text style={[styles.userEmail, { 
                            fontSize: fontSize - 2, 
                            color: themeColors.textSecondary,
                            fontWeight: isHighContrast ? '600' : '400'
                        }]}>
                            {user?.email || ''}
                        </Text>
                    </View>

                    <View style={[styles.cardContainer, { 
                        marginHorizontal: spacing, 
                        marginTop: spacing,
                        borderRadius: spacing,
                        padding: spacing,
                        backgroundColor: themeColors.cardBackground,
                        borderWidth: isHighContrast ? 2 : 0,
                        borderColor: isHighContrast ? themeColors.borderDivider : 'transparent',
                        shadowOpacity: getContrastShadowOpacity(),
                    }]}>
                        <View style={[styles.cardHeader, { 
                            gap: spacing / 2, 
                            marginBottom: spacing,
                            paddingBottom: spacing,
                            borderBottomWidth: getContrastBorderWidth(),
                            borderBottomColor: isHighContrast ? themeColors.borderDivider : '#f0f0f0'
                        }]}>
                            <Feather name="user" size={20} color={ColorsPalette.light['coral.600']} />
                            <Text style={[styles.cardTitle, { 
                                fontSize: fontSize + 4, 
                                color: themeColors.textPrimary,
                                fontWeight: isHighContrast ? '700' : '600'
                            }]}>
                                Informações Pessoais
                            </Text>
                        </View>

                        <FormProvider {...formMethods}>
                            <View style={[{ gap: spacing / 3 }]}>
                                <EasemindInputController
                                    name="name"
                                    label={'Nome completo'}
                                    placeholder="Seu nome"
                                    editable={isEditing}
                                    fontSize={fontSize}
                                    rules={{ required: 'Nome é obrigatório' }}
                                />
                                <EasemindInputController
                                    name="email"
                                    label={'E-mail'}
                                    placeholder="email@example.com"
                                    editable={isEditing}
                                    fontSize={fontSize}
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
                                            fontSize={fontSize}
                                            keyboardType="numeric"
                                            maxLength={14}
                                        />
                                    )}
                                />
                            </View>
                        </FormProvider>
                    </View>

                    <View style={[{ padding: spacing, gap: spacing / 2 }]}>
                        {isEditing ? (
                            <View style={[styles.editActionsContainer, { gap: spacing }]}>
                                <EasemindButton
                                    variant="outlined"
                                    onPress={handleCancelEdit}
                                    disabled={isSaving}
                                    style={{ flex: 1 }}
                                >
                                    Cancelar
                                </EasemindButton>
                                
                                <EasemindButton
                                    variant="primary"
                                    onPress={formMethods.handleSubmit(handleSaveProfile)}
                                    disabled={isSaving || !formMethods.formState.isValid}
                                    loading={isSaving}
                                    style={{ flex: 1 }}
                                >
                                    Salvar
                                </EasemindButton>
                            </View>
                        ) : (
                            <EasemindButton
                                variant="secondary"
                                onPress={() => setIsEditing(true)}
                                icon={<Feather name="edit-2" size={20} color={ColorsPalette.light['coral.600']} />}
                                fullWidth
                            >
                                Editar perfil
                            </EasemindButton>
                        )}
                        
                        <EasemindButton
                            variant="ghost"
                            onPress={handleLogout}
                            icon={<Feather name="log-out" size={20} color={ColorsPalette.light['coral.600']} />}
                            fullWidth
                        >
                            Sair da conta
                        </EasemindButton>
                    </View>
                </ScrollView>
                <FeedbackAnimation />
            </SafeAreaView>
            </ScreenFadeIn>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    profileSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImageContainer: {
        position: 'relative',
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
        fontWeight: '700',
    },
    userEmail: {
        fontWeight: '400',
    },
    cardContainer: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cardTitle: {
        fontWeight: '600',
    },
    editActionsContainer: {
        flexDirection: 'row',
    },
});

export default ProfileScreen;