import { Dimensions, Platform, PixelRatio } from 'react-native';

/**
 * Responsive utility functions for adaptive layouts
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale size based on screen width
 */
export const scaleWidth = (size: number): number => {
    return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale size based on screen height
 */
export const scaleHeight = (size: number): number => {
    return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Scale font size with moderate scaling
 */
export const scaleFontSize = (size: number): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;

    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Get screen dimensions
 */
export const getScreenDimensions = () => {
    return {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    };
};

/**
 * Check if device is a tablet
 */
export const isTablet = (): boolean => {
    const pixelDensity = PixelRatio.get();
    const adjustedWidth = SCREEN_WIDTH * pixelDensity;
    const adjustedHeight = SCREEN_HEIGHT * pixelDensity;

    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    }

    return (
        (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) ||
        (SCREEN_WIDTH >= 768)
    );
};

/**
 * Check if device is a small phone
 */
export const isSmallDevice = (): boolean => {
    return SCREEN_WIDTH < 375 || SCREEN_HEIGHT < 667;
};

/**
 * Get responsive padding based on device size
 */
export const getResponsivePadding = () => {
    if (isTablet()) {
        return 24;
    }
    if (isSmallDevice()) {
        return 12;
    }
    return 16;
};

/**
 * Get responsive font sizes
 */
export const responsiveFontSizes = {
    h1: scaleFontSize(32),
    h2: scaleFontSize(28),
    h3: scaleFontSize(24),
    h4: scaleFontSize(20),
    body1: scaleFontSize(16),
    body2: scaleFontSize(14),
    caption: scaleFontSize(12),
    button: scaleFontSize(14),
};

/**
 * Get number of columns for grid layouts
 */
export const getGridColumns = (): number => {
    if (isTablet()) {
        return 3;
    }
    if (SCREEN_WIDTH >= 414) {
        return 2;
    }
    return 1;
};

/**
 * Get card width for horizontal scrolling
 */
export const getCardWidth = (margin: number = 16): number => {
    if (isTablet()) {
        return (SCREEN_WIDTH - margin * 4) / 3;
    }
    return SCREEN_WIDTH - margin * 2;
};

/**
 * Check if device has notch (iPhone X and newer)
 */
export const hasNotch = (): boolean => {
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        (SCREEN_HEIGHT >= 812 || SCREEN_WIDTH >= 812)
    );
};

/**
 * Get safe area insets
 */
export const getSafeAreaInsets = () => {
    if (hasNotch()) {
        return {
            top: 44,
            bottom: 34,
        };
    }
    return {
        top: Platform.OS === 'ios' ? 20 : 0,
        bottom: 0,
    };
};

export default {
    scaleWidth,
    scaleHeight,
    scaleFontSize,
    getScreenDimensions,
    isTablet,
    isSmallDevice,
    getResponsivePadding,
    responsiveFontSizes,
    getGridColumns,
    getCardWidth,
    hasNotch,
    getSafeAreaInsets,
};
