import * as DocumentPicker from "expo-document-picker";
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { api } from "@/data-access";

const handleUploadFile = async (type: 'image' | 'file') => {
    if (type === 'image') {
        const { status } = await requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Conceda acesso à galeria para trocar a foto.');
            return;
        }
    }

    const file = (type === 'image') ? await launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
    }) :
        await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
    if (file.canceled) return;

    const selectedFile = file.assets?.[0] || file;
    if (!selectedFile || !selectedFile.uri) {
        Alert.alert("Erro", (type === 'image') ? "Não foi possível obter a imagem." : "Não foi possível obter o arquivo selecionado.");
        return;
    }

    return selectedFile;
}

export const useUploadFile = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (type: 'image' | 'file', uploadEndpoint: string = '/upload') => {
        try {
            const selectedFile = await handleUploadFile(type);
            if (!selectedFile) return;

            setIsUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            const fileName = 'name' in selectedFile && selectedFile.name 
                ? selectedFile.name 
                : `${type}-${Date.now()}.${type === 'image' ? 'jpg' : 'pdf'}`;
            
            const file = {
                uri: selectedFile.uri,
                type: selectedFile.mimeType || (type === 'image' ? 'image/jpeg' : 'application/pdf'),
                name: fileName,
            };

            formData.append('file', file as any);

            const response = await api.post(uploadEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = (progressEvent.loaded / progressEvent.total) * 100;
                        setUploadProgress(progress);
                    }
                },
            });

            return response.data.url || response.data.fileUrl;
        } catch (error: any) {
            if (error && error?.message?.includes('user canceled')) {
                console.log('Seleção de arquivo cancelada');
            } else {
                console.error('Upload error:', error);
                Alert.alert("Erro", "Não foi possível enviar o arquivo. Tente novamente.");
            }
            throw error;
        } finally {
            setUploadProgress(0);
            setIsUploading(false);
        }
    }

    return { uploadProgress, isUploading, uploadFile };
}

