import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    type?: 'error' | 'warning' | 'info';
    fullScreen?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    onDismiss,
    type = 'error',
    fullScreen = false,
}) => {
    const getIconName = () => {
        switch (type) {
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'error-outline';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'warning':
                return '#FF9800';
            case 'info':
                return '#2196F3';
            default:
                return '#F44336';
        }
    };

    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <View style={[styles.content, { borderLeftColor: getColor() }]}>
                <MaterialIcons name={getIconName()} size={24} color={getColor()} style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {onRetry && (
                            <TouchableOpacity style={styles.button} onPress={onRetry}>
                                <Text style={[styles.buttonText, { color: getColor() }]}>Retry</Text>
                            </TouchableOpacity>
                        )}
                        {onDismiss && (
                            <TouchableOpacity style={styles.button} onPress={onDismiss}>
                                <Text style={styles.buttonText}>Dismiss</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        maxWidth: 400,
    },
    icon: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    message: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    button: {
        marginRight: 16,
        paddingVertical: 4,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
});

export default ErrorMessage;
