import { useAuth } from '@/shared/contexts';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { maskDocument } from '@/shared/helpers/maskDocument';
import { useFeedbackAnimation } from '@/shared/hooks/useFeedbackAnimation';
import { EasemindButton } from '@/shared/ui/Button';
import { EasemindInput } from '@/shared/ui/Input/Input';
import { EasemindInputController } from '@/shared/ui/Input/InputController';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
    const { user, updateUser, updateUserProfileImage, logout } = useAuth();
    const { showFeedback, FeedbackAnimation } = useFeedbackAnimation();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

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

            // Solicitar permissão
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                showFeedback("error");
                return;
            }

            // Selecionar imagem
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

            // Preparar o arquivo para envio
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
        updateUser({ name: data.name, email: data.email, document: data.document }).then(() => {
            showFeedback("success");
        }).catch(_ => {
            showFeedback("error");
        });

        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/account-access');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            showFeedback("error");
        }
    };

    return (
        <>
            <SafeAreaView style={styles.container} >
                <View style={styles.header}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Perfil</Text>
                </View>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.profileSection}>
                        <TouchableOpacity onPress={handleEditProfileImage} disabled={isUploadingImage}>
                            <View style={styles.profileImage}>
                                {isUploadingImage ? (
                                    <ActivityIndicator size="large" color={ColorsPalette.light['coral.400']} />
                                ) : user && user.image ? (
                                    <Image source={{ uri: user.image }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                                ) : (
                                    <MaterialIcons name="camera-enhance" size={50} color={ColorsPalette.light['coral.200']} />
                                )}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.userName}>{formMethods.watch('name')}</Text>
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
                                        label={'Documento'}
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

                    <View style={styles.actionsSection}>
                        {isEditing ? (
                            <EasemindButton color="primary" variant="contained" onPress={formMethods.handleSubmit(handleSaveProfile)}>
                                Salvar alterações
                            </EasemindButton>
                        ) : (
                            <EasemindButton color="tertiary" variant="outlined" onPress={() => setIsEditing(true)} styles={{ borderColor: ColorsPalette.light['coral.400'], borderWidth: 0 }}>
                                Permitir edição da conta
                            </EasemindButton>
                        )}
                        <EasemindButton color="secondary" variant="outlined" onPress={handleLogout} styles={{ marginTop: 10 }}>
                            Sair da conta
                        </EasemindButton>
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
        backgroundColor: '#FFF',
    },
    header: {
        paddingTop: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorsPalette.light['coral.900'],
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 15,
        color: '#333',
    },
    formSection: {
        paddingHorizontal: 20,
        gap: 0,
    },
    actionsSection: {
        padding: 20,
        marginTop: 'auto',
    },
});

export default ProfileScreen;