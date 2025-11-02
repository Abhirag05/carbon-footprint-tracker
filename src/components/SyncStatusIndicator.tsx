import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SyncStatus } from '../services/syncService';

interface SyncStatusIndicatorProps {
    status: SyncStatus;
    pendingCount?: number;
    compact?: boolean;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
    status,
    pendingCount = 0,
    compact = false,
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'synced':
                return {
                    icon: '✓',
                    text: 'Synced',
                    color: '#4CAF50',
                    showSpinner: false,
                };
            case 'syncing':
                return {
                    icon: '',
                    text: 'Syncing...',
                    color: '#2196F3',
                    showSpinner: true,
                };
            case 'pending':
                return {
                    icon: '⏱',
                    text: pendingCount > 0 ? `${pendingCount} pending` : 'Pending',
                    color: '#FF9800',
                    showSpinner: false,
                };
            case 'error':
                return {
                    icon: '⚠',
                    text: 'Sync error',
                    color: '#F44336',
                    showSpinner: false,
                };
            default:
                return {
                    icon: '?',
                    text: 'Unknown',
                    color: '#9E9E9E',
                    showSpinner: false,
                };
        }
    };

    const config = getStatusConfig();

    if (compact) {
        return (
            <View style={[styles.compactContainer, { backgroundColor: config.color + '20' }]}>
                {config.showSpinner ? (
                    <ActivityIndicator size={12} color={config.color} />
                ) : (
                    <Text style={[styles.compactIcon, { color: config.color }]}>{config.icon}</Text>
                )}
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: config.color + '15' }]}>
            {config.showSpinner ? (
                <ActivityIndicator size={16} color={config.color} style={styles.spinner} />
            ) : (
                <Text style={[styles.icon, { color: config.color }]}>{config.icon}</Text>
            )}
            <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    compactContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 14,
        marginRight: 6,
        fontWeight: 'bold',
    },
    compactIcon: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
    spinner: {
        marginRight: 6,
    },
});

export default SyncStatusIndicator;
