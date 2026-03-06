import { useAuth } from '@/shared/contexts';
import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { EasemindButton } from '@/shared/ui/Button';
import { EasemindInputController } from '@/shared/ui/Input/InputController';
import { EasemindTabSelector } from '@/shared/ui/TabSelector';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { TextInput } from 'react-native-paper';

const AccountAccessScreen = () => {
    const { login, signUp, user, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loginForm = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const registerForm = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            registerEmail: "",
            registerPassword: "",
        }
    });

    useEffect(() => {
        if (user && !authLoading) {
            router.replace('/(protected)/thermometer');
        }
    }, [user, authLoading]);

    const handleLogin = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        const result = await login(data.email.toLowerCase().trim(), data.password);

        setIsLoading(false);

        if (!result.success) {
            Alert.alert(
                'Erro de login',
                result.message || 'Verifique seu e-mail e senha e tente novamente.',
            );
        }
    };

    const handleRegister = async (data: { name: string; registerEmail: string; registerPassword: string }) => {
        setIsLoading(true);
        const result = await signUp(
            data.name.trim(),
            data.registerEmail.toLowerCase().trim(),
            data.registerPassword,
        );
        setIsLoading(false);

        if (result.success) {
            setActiveTab('login');
            registerForm.reset();
            Alert.alert('Conta criada', result.message || 'Cadastro realizado com sucesso! Faça login para continuar.');
        } else {
            Alert.alert(
                'Erro ao cadastrar',
                result.message || 'Verifique os dados e tente novamente.',
            );
        }
    };

    const handleTabChange = (name: string) => {
        setActiveTab(name);
        loginForm.reset();
        registerForm.reset();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Image
                        source={require('@/assets/images/logo-auth.png')}
                        style={{ width: 100, height: 111, marginTop: 20, marginBottom: 30 }}
                    />
                    <Text style={styles.title}>Cuidando da sua saúde cognitiva.</Text>

                    <EasemindTabSelector tabs={[{ label: 'Login', name: 'login' }, { label: 'Crie uma conta', name: 'register' }]} activeTab={activeTab} onTabChange={handleTabChange} />
                    {activeTab === 'login' ? (
                        <FormProvider {...loginForm} key="login-form">
                            <View style={styles.formContainer}>
                                <EasemindInputController
                                    name="email"
                                    label="Digite o seu e-mail"
                                    placeholder="email@example.com"
                                    keyboardType="email-address"
                                    rules={{
                                        required: "E-mail obrigatório",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "E-mail é inválido"
                                        }
                                    }}
                                />
                                <EasemindInputController
                                    name="password"
                                    label="Digite a sua senha"
                                    placeholder="********"
                                    secureTextEntry={!showPassword}
                                    type="password"
                                    rules={{ required: "Senha é obrigatória" }}
                                    right={
                                        <TextInput.Icon
                                            icon={() => <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />
                                <EasemindButton
                                    variant="primary"
                                    onPress={loginForm.handleSubmit(handleLogin)}
                                    disabled={isLoading || !loginForm.formState.isValid}
                                    loading={isLoading}>
                                    Entrar
                                </EasemindButton>
                            </View>
                        </FormProvider>
                    ) : (
                        <FormProvider {...registerForm} key="register-form">
                            <View style={styles.formContainer}>
                                <EasemindInputController
                                    name="name"
                                    label="Nome"
                                    placeholder="Seu nome"
                                    rules={{ required: "Nome é obrigatório" }}
                                />
                                <EasemindInputController
                                    name="registerEmail"
                                    label="Digite o e-mail"
                                    placeholder="email@example.com"
                                    keyboardType="email-address"
                                    rules={{
                                        required: "E-mail é obrigatório",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "E-mail é inválido"
                                        }
                                    }}
                                />
                                <EasemindInputController
                                    name="registerPassword"
                                    label="Digite a senha"
                                    placeholder="********"
                                    secureTextEntry={!showRegisterPassword}
                                    type="password"
                                    rules={{ required: "Senha é obrigatória" }}
                                    right={
                                        <TextInput.Icon
                                            icon={() => <Feather name={showRegisterPassword ? "eye-off" : "eye"} size={20} color="gray" />}
                                            onPress={() => setShowRegisterPassword(!showRegisterPassword)}
                                        />
                                    }
                                />
                                <EasemindButton
                                    variant="primary"
                                    onPress={registerForm.handleSubmit(handleRegister)}
                                    disabled={isLoading || !registerForm.formState.isValid}
                                    loading={isLoading}>
                                    Criar conta
                                </EasemindButton>
                            </View>
                        </FormProvider>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        alignItems: 'center',
        paddingTop: 100,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
    previewButton: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: ColorsPalette.light['coral.300'],
        borderRadius: 8,
    },
    previewButtonText: {
        fontSize: 14,
        color: ColorsPalette.light['coral.600'],
    },
});

export default AccountAccessScreen;