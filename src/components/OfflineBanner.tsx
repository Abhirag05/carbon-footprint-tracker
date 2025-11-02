import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Banner } from 'react-native-paper';

interface OfflineBannerProps {
    visible: boolean;
    onDismiss?: () => void;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible, onDismiss }) => {
    if (!visible) {
        return null;
    }

    return (
        <Banner
            visible={visible}
            icon="wifi-off"
            style={styles.banner}
            contentStyle={styles.content}
        >
            <View style={styles.textContainer}>
                <Text style={styles.title}>You're offline</Text>
                <Text style={styles.subtitle}>
                    Your activities will be saved locally and synced when you're back online.
                </Text>
            </View>
        </Banner>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#FF9800',
        elevation: 4,
    },
    content: {
        paddingVertical: 8,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.9,
    },
});

export default OfflineBanner;
