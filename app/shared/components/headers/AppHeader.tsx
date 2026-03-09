import { useAuth } from '@/data-access';
import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { Feather } from "@expo/vector-icons";
import { Image } from 'expo-image';
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/AntDesign";
import { ThermometerModal } from '../ThermometerModal';

export const AppHeader = ({ title = '', onThermometerUpdate }: { title?: string; onThermometerUpdate?: () => void }) => {
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenThermometer = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleSave = () => {
        onThermometerUpdate?.();
    };

    return (
        <>
            <SafeAreaView
                edges={['top']}
                style={{
                    backgroundColor: ColorsPalette.light['coral.900'],
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                }}>
                    <TouchableOpacity>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: ColorsPalette.light['coral.200'], borderRadius: 25, width: 50, height: 50 }}>
                            {user && user.image ? <Image source={{ uri: user.image }} cachePolicy="disk"
                                contentFit="cover"
                                transition={150} style={{ width: 50, height: 50, borderRadius: 25 }} /> : <MaterialIcons name="user" size={25} color={ColorsPalette.light['coral.800']} />}
                        </View>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: ColorsPalette.light['coral.50'] }}>{title}</Text>
                    <TouchableOpacity onPress={handleOpenThermometer}>
                        <Feather name="plus-circle" size={24} color={ColorsPalette.light['coral.50']} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ThermometerModal visible={modalVisible} onClose={handleCloseModal} onSave={handleSave} />
        </>
    );
};