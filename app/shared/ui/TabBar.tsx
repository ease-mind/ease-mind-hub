import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter, useSegments } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const EasemindTabBar = () => {
    const router = useRouter();
    const segments = useSegments();
    const insets = useSafeAreaInsets();

    const tabs: { name: `/${string}`; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
        { name: '/thermometer', label: 'Termômetro', icon: 'thermometer' },
        { name: '/tasks', label: 'Tarefas', icon: 'check-square' },
        { name: '/config', label: 'Configurações', icon: 'settings' },
        { name: '/profile', label: 'Perfil', icon: 'user' },
    ];
    const activeTab = '/' + (segments[1] ?? 'thermometer');

    return (
        <View style={styles.wrapper}>
            <View style={[styles.tabContainer, { paddingBottom: insets.bottom }]}>
                <BlurView intensity={30} tint="light" style={{ ...StyleSheet.flatten(StyleSheet.absoluteFill), borderRadius: 20, overflow: 'hidden' }} />
                {tabs.map((tab, index) => {
                    const isFocused = tab.name === activeTab;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.tabButton}
                            onPress={() => router.replace(tab.name as Href)}
                            activeOpacity={0.7}
                        >
                            {!isFocused ?
                                <>
                                    <Feather
                                        name={tab.icon}
                                        size={24}
                                        color={ColorsPalette.light['coral.900']}
                                    />
                                    <Text
                                        style={{
                                            color: ColorsPalette.light['coral.900'],
                                            fontSize: 12,
                                        }}
                                    >
                                        {tab.label}
                                    </Text>
                                </>
                                :
                                <View style={{ marginTop: 5, alignItems: 'center', width: 55, height: 45, borderRadius: 25, backgroundColor: ColorsPalette.light['coral.800'], justifyContent: 'center' }}>
                                    <Feather
                                        name={tab.icon}
                                        size={22}
                                        color={ColorsPalette.light['coral.100']}
                                    />
                                  
                                </View>
                            }
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(234, 202, 202, 0.85)',
        borderTopWidth: 0,
        elevation: 12,
        justifyContent: 'space-around',
        height: 90,
        alignItems: 'flex-start',
        paddingTop: 15,
        marginHorizontal: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customButton: {
        position: 'absolute',
        top: -25,
        alignSelf: 'center',
        width: 55,
        height: 55,
        zIndex: 20,
        borderRadius: 32,
        backgroundColor: ColorsPalette.light['coral.600'],
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: -1, height: -1 },
        shadowRadius: 3,
    },
    gradient: {
        width: 55,
        height: 55,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});