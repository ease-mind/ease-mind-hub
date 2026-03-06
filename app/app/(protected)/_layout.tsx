import { CognitiveSettingsProvider, useAuth } from '@/shared/contexts';
import { EasemindTabBar } from '@/shared/ui/TabBar';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProtectedLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <CognitiveSettingsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs
                tabBar={() => <EasemindTabBar />}
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: Platform.select({
                        ios: { position: 'absolute' },
                        default: {},
                    }),
                }}>
                <Tabs.Screen name="thermometer" options={{ title: 'Termômetro' }} />
                <Tabs.Screen name="tasks" options={{ title: 'Tarefas' }} />
                <Tabs.Screen name="config" options={{ title: 'Configurações' }} />
                <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
            </Tabs>
        </GestureHandlerRootView>
        </CognitiveSettingsProvider>
    );
}
