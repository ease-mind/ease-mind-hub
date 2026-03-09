import React, { ReactNode } from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { ColorsPalette } from "../classes/constants/Pallete";
import { useCognitiveSettings } from "@/data-access";

export interface EasemindButtonProps {
    variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    children: ReactNode;
    icon?: ReactNode;
    style?: StyleProp<ViewStyle>;
    fullWidth?: boolean;
}

export function EasemindButton({
    variant = 'primary',
    onPress,
    disabled = false,
    loading = false,
    children,
    icon,
    style,
    fullWidth = false,
}: EasemindButtonProps) {
    const { spacing, fontSize, contrast } = useCognitiveSettings();

    const getVariantStyles = () => {
        const isHighContrast = contrast === 'high';
        const borderWidth = isHighContrast ? 2 : 1;
        
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: ColorsPalette.light['coral.600'],
                    borderWidth,
                    borderColor: isHighContrast ? ColorsPalette.light['coral.800'] : ColorsPalette.light['coral.600'],
                    textColor: '#fff',
                };
            case 'secondary':
                return {
                    backgroundColor: ColorsPalette.light['coral.50'],
                    borderWidth,
                    borderColor: isHighContrast ? ColorsPalette.light['coral.600'] : ColorsPalette.light['coral.200'],
                    textColor: ColorsPalette.light['coral.600'],
                };
            case 'outlined':
                return {
                    backgroundColor: '#fff',
                    borderWidth,
                    borderColor: isHighContrast ? '#666' : '#e0e0e0',
                    textColor: '#666',
                };
            case 'ghost':
                return {
                    backgroundColor: '#fff',
                    borderWidth,
                    borderColor: isHighContrast ? ColorsPalette.light['coral.600'] : ColorsPalette.light['coral.200'],
                    textColor: ColorsPalette.light['coral.600'],
                };
            default:
                return {
                    backgroundColor: ColorsPalette.light['coral.600'],
                    borderWidth,
                    borderColor: isHighContrast ? ColorsPalette.light['coral.800'] : ColorsPalette.light['coral.600'],
                    textColor: '#fff',
                };
        }
    };

    const getDisabledStyles = () => {
        const isHighContrast = contrast === 'high';
        
        if (isHighContrast) {
            return {
                backgroundColor: '#cccccc',
                borderColor: '#666',
                borderWidth: 2,
                textColor: '#333',
            };
        }
        
        return null;
    };

    const variantStyles = getVariantStyles();
    const isDisabled = disabled || loading;
    const isHighContrast = contrast === 'high';
    const disabledStyles = getDisabledStyles();

    return (
        <TouchableOpacity
            style={[
                buttonStyles.button,
                {
                    paddingVertical: spacing,
                    paddingHorizontal: spacing * 1.5,
                    borderRadius: spacing,
                    gap: spacing / 2,
                    backgroundColor: variantStyles.backgroundColor,
                    borderWidth: variantStyles.borderWidth,
                    borderColor: variantStyles.borderColor,
                },
                fullWidth && buttonStyles.fullWidth,
                isDisabled && !isHighContrast && buttonStyles.disabled,
                isDisabled && isHighContrast && disabledStyles && {
                    backgroundColor: disabledStyles.backgroundColor,
                    borderColor: disabledStyles.borderColor,
                    borderWidth: disabledStyles.borderWidth,
                },
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator 
                    size="small" 
                    color={isDisabled && isHighContrast && disabledStyles ? disabledStyles.textColor : variantStyles.textColor} 
                />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            buttonStyles.buttonText,
                            {
                                fontSize,
                                color: isDisabled && isHighContrast && disabledStyles ? disabledStyles.textColor : variantStyles.textColor,
                                fontWeight: isHighContrast ? '700' : '600',
                            },
                            isDisabled && !isHighContrast && buttonStyles.disabledText,
                        ]}
                    >
                        {children}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const buttonStyles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    buttonText: {
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.6,
    },
    disabledText: {
        color: '#999',
    },
});
