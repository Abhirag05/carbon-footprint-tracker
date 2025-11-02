/**
 * Validation and Sanitization Utilities
 */

import {
    ACTIVITY_TYPES,
    TRANSPORTATION_MODES,
    FUEL_TYPES,
    FLIGHT_TYPES,
    ENERGY_SOURCES,
    FOOD_CATEGORIES,
    MEAL_TYPES,
    WASTE_TYPES,
    ActivityType,
} from '../constants/activityTypes';

// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (min 8 characters)
export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

// Number validation
export const isPositiveNumber = (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
};

export const isNonNegativeNumber = (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
};

// String sanitization
export const sanitizeString = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};

// Activity type validation
export const isValidActivityType = (type: string): type is ActivityType => {
    return Object.values(ACTIVITY_TYPES).includes(type as ActivityType);
};

// Transportation activity validation
export interface TransportationData {
    mode: string;
    distance: number;
    fuelType?: string;
    flightType?: string;
}

export const validateTransportationActivity = (
    data: TransportationData
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate mode
    if (!Object.values(TRANSPORTATION_MODES).includes(data.mode as any)) {
        errors.push('Invalid transportation mode');
    }

    // Validate distance
    if (!isPositiveNumber(data.distance)) {
        errors.push('Distance must be a positive number');
    }

    // Validate fuel type for cars
    if (data.mode === TRANSPORTATION_MODES.CAR) {
        if (!data.fuelType || !Object.values(FUEL_TYPES).includes(data.fuelType as any)) {
            errors.push('Valid fuel type is required for car transportation');
        }
    }

    // Validate flight type for planes
    if (data.mode === TRANSPORTATION_MODES.PLANE) {
        if (!data.flightType || !Object.values(FLIGHT_TYPES).includes(data.flightType as any)) {
            errors.push('Valid flight type is required for plane transportation');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Energy activity validation
export interface EnergyData {
    source: string;
    amount: number;
    duration?: number;
}

export const validateEnergyActivity = (
    data: EnergyData
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate source
    if (!Object.values(ENERGY_SOURCES).includes(data.source as any)) {
        errors.push('Invalid energy source');
    }

    // Validate amount
    if (!isPositiveNumber(data.amount)) {
        errors.push('Amount must be a positive number');
    }

    // Validate duration if provided
    if (data.duration !== undefined && !isNonNegativeNumber(data.duration)) {
        errors.push('Duration must be a non-negative number');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Food activity validation
export interface FoodData {
    mealType: string;
    foodItems: Array<{ category: string; servings: number }>;
}

export const validateFoodActivity = (
    data: FoodData
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate meal type
    if (!Object.values(MEAL_TYPES).includes(data.mealType as any)) {
        errors.push('Invalid meal type');
    }

    // Validate food items
    if (!Array.isArray(data.foodItems) || data.foodItems.length === 0) {
        errors.push('At least one food item is required');
    } else {
        data.foodItems.forEach((item, index) => {
            if (!Object.values(FOOD_CATEGORIES).includes(item.category as any)) {
                errors.push(`Invalid food category at item ${index + 1}`);
            }
            if (!isPositiveNumber(item.servings)) {
                errors.push(`Servings must be a positive number at item ${index + 1}`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Waste activity validation
export interface WasteData {
    wasteType: string;
    weight: number;
}

export const validateWasteActivity = (
    data: WasteData
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate waste type
    if (!Object.values(WASTE_TYPES).includes(data.wasteType as any)) {
        errors.push('Invalid waste type');
    }

    // Validate weight
    if (!isPositiveNumber(data.weight)) {
        errors.push('Weight must be a positive number');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

// Generic activity validation
export const validateActivity = (
    type: ActivityType,
    details: any
): { valid: boolean; errors: string[] } => {
    switch (type) {
        case ACTIVITY_TYPES.TRANSPORTATION:
            return validateTransportationActivity(details);
        case ACTIVITY_TYPES.ENERGY:
            return validateEnergyActivity(details);
        case ACTIVITY_TYPES.FOOD:
            return validateFoodActivity(details);
        case ACTIVITY_TYPES.WASTE:
            return validateWasteActivity(details);
        default:
            return { valid: false, errors: ['Invalid activity type'] };
    }
};

// Date validation
export const isValidDate = (date: any): boolean => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};

export const isFutureDate = (date: Date): boolean => {
    return date.getTime() > Date.now();
};
