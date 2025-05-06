import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { icons } from "../constants/icons";

let showAlertFunction;

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState({
        visible: false,
        type: 'info',
        message: '',
    });

    showAlertFunction = (type, message) => {
        setAlertState({
            visible: true,
            type,
            message,
        });
        setTimeout(() => {
            setAlertState(prev => ({
                ...prev,
                visible: false,
            }));
        }, 3000);
    };

    return (
        <>
            {children}
            {alertState.visible && (
                <CustomAlert
                    type={alertState.type}
                    message={alertState.message}
                />
            )}
        </>
    );
};

const CustomAlert = ({ type, message }) => {
    const typeConfig = {
        warning: {
            borderColor: '#ffa502',
            iconColor: '#ce8500',
            textColor: '#ce8500',
            closeBg: '#ffd080',
        },
        success: {
            borderColor: '#4BB543',
            iconColor: '#4BB543',
            textColor: '#4BB543',
            closeBg: '#e2f7e1',
        },
        error: {
            borderColor: '#ff3333',
            iconColor: '#ff3333',
            textColor: '#ff3333',
            closeBg: '#ffdddd',
        },
        info: {
            borderColor: '#2f80ed',
            iconColor: '#2f80ed',
            textColor: '#2f80ed',
            closeBg: '#e0e9ff',
        },
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <View style={[styles.container,{borderLeftColor: config.borderColor,}]}>
            <View style={styles.iconContainer}>
                <Image
                    source={icons[type] || icons.info}
                    style={[styles.icon, { tintColor: config.iconColor }]}
                    resizeMode="contain"
                />
            </View>
            <Text style={[styles.message, { color: config.textColor }]}>
                {message}
            </Text>
        </View>
    );
};

export const showAlert = (type, message) => {
    if (showAlertFunction) {
        showAlertFunction(type, message);
    }
};

const styles = StyleSheet.create({
    container: {
        opacity: 0.85,
        position: 'absolute',
        top: 440, 
        bottom: 380,
        left: 110,
        right: 110,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
        borderLeftWidth: 4,
        paddingLeft: 50,
        paddingRight: 30,
        paddingVertical: 15,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1000, 
    },
    iconContainer: {
        position: 'absolute',
        left: 15,
    },
    icon: {
        width: 24,
        height: 24,
    },
    message: {
        fontSize: 14,
        flex: 1,
    },
    closeButtonContainer: {
        position: 'absolute',
        right: 15,
        padding: 5,
        borderRadius: 15,
    },
    closeIcon: {
        width: 16,
        height: 16,
    },
});