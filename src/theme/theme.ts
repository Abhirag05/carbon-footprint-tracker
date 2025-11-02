import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationLightTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

/**
 * Custom color palette for the Carbon Footprint Tracker app
 */
export const colors = {
    primary: '#9b0302',
    primaryDark: '#7a0201',
    primaryLight: '#c41f1e',
    secondary: '#0c2d55',
    secondaryDark: '#081f3d',
    secondaryLight: '#1a4a7e',
    accent: '#FF9800',
    error: '#F44336',
    warning: '#FF9800',
    success: '#9b0302',
    info: '#0c2d55',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    divider: '#E0E0E0',

    // Emission category colors
    transportation: '#0c2d55',
    energy: '#FF9800',
    food: '#9b0302',
    waste: '#9C27B0',

    // Chart colors
    chartPrimary: '#9b0302',
    chartSecondary: '#0c2d55',
    chartTertiary: '#FF9800',
    chartQuaternary: '#9C27B0',

    // Status colors
    synced: '#9b0302',
    pending: '#FF9800',
    offline: '#757575',
};

/**
 * Spacing scale for consistent layout
 */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

/**
 * Typography scale
 */
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        lineHeight: 36,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body1: {
        fontSize: 16,
        fontWeight: 'normal' as const,
        lineHeight: 24,
    },
    body2: {
        fontSize: 14,
        fontWeight: 'normal' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: 'normal' as const,
        lineHeight: 16,
    },
    button: {
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        textTransform: 'uppercase' as const,
    },
};

/**
 * Border radius scale
 */
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
};

/**
 * Shadow presets
 */
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
};

/**
 * Custom React Native Paper theme
 */
export const paperTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: colors.primary,
        primaryContainer: colors.primaryLight,
        secondary: colors.secondary,
        secondaryContainer: colors.secondaryLight,
        tertiary: colors.accent,
        error: colors.error,
        errorContainer: '#FFEBEE',
        background: colors.background,
        surface: colors.surface,
        surfaceVariant: '#F5F5F5',
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onBackground: colors.text,
        onSurface: colors.text,
        outline: colors.divider,
    },
    roundness: borderRadius.md,
};

/**
 * Custom React Navigation theme
 */
export const navigationTheme = {
    ...NavigationLightTheme,
    colors: {
        ...NavigationLightTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.divider,
        notification: colors.accent,
    },
};

/**
 * Animation durations (in milliseconds)
 */
export const animations = {
    fast: 150,
    normal: 250,
    slow: 350,
};

/**
 * Common styles used across the app
 */
export const commonStyles = {
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    row: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
    },
    spaceBetween: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: spacing.md,
    },
};

export default {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    paperTheme,
    navigationTheme,
    animations,
    commonStyles,
};
