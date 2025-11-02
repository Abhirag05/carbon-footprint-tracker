/**
 * Activity Type Constants and Enums
 */

export const ACTIVITY_TYPES = {
    TRANSPORTATION: 'transportation',
    ENERGY: 'energy',
    FOOD: 'food',
    WASTE: 'waste',
} as const;

export const TRANSPORTATION_MODES = {
    CAR: 'car',
    BUS: 'bus',
    TRAIN: 'train',
    PLANE: 'plane',
    BIKE: 'bike',
    WALK: 'walk',
    MOTORCYCLE: 'motorcycle',
    SUBWAY: 'subway',
} as const;

export const FUEL_TYPES = {
    GASOLINE: 'gasoline',
    DIESEL: 'diesel',
    ELECTRIC: 'electric',
    HYBRID: 'hybrid',
} as const;

export const FLIGHT_TYPES = {
    DOMESTIC: 'domestic',
    INTERNATIONAL: 'international',
} as const;

export const ENERGY_SOURCES = {
    ELECTRICITY: 'electricity',
    NATURAL_GAS: 'naturalGas',
    HEATING_OIL: 'heatingOil',
    HEATING_GAS: 'heatingGas',
    HEATING_ELECTRIC: 'heatingElectric',
    HEATING_COAL: 'heatingCoal',
    SOLAR: 'solar',
    WIND: 'wind',
} as const;

export const FOOD_CATEGORIES = {
    BEEF: 'beef',
    LAMB: 'lamb',
    PORK: 'pork',
    CHICKEN: 'chicken',
    FISH_FARMED: 'fishFarmed',
    FISH_WILD: 'fishWild',
    EGGS: 'eggs',
    MILK: 'milk',
    CHEESE: 'cheese',
    YOGURT: 'yogurt',
    BUTTER: 'butter',
    VEGETABLES: 'vegetables',
    FRUITS: 'fruits',
    RICE: 'rice',
    WHEAT: 'wheat',
    OATS: 'oats',
    LEGUMES: 'legumes',
    NUTS: 'nuts',
    TOFU: 'tofu',
    TEMPEH: 'tempeh',
    SEITAN: 'seitan',
} as const;

export const MEAL_TYPES = {
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    DINNER: 'dinner',
    SNACK: 'snack',
} as const;

export const WASTE_TYPES = {
    GENERAL: 'general',
    RECYCLING_PAPER: 'recyclingPaper',
    RECYCLING_PLASTIC: 'recyclingPlastic',
    RECYCLING_GLASS: 'recyclingGlass',
    RECYCLING_METAL: 'recyclingMetal',
    COMPOST: 'compost',
    ELECTRONIC: 'electronic',
    HAZARDOUS: 'hazardous',
} as const;

// Type exports
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
export type TransportationMode = typeof TRANSPORTATION_MODES[keyof typeof TRANSPORTATION_MODES];
export type FuelType = typeof FUEL_TYPES[keyof typeof FUEL_TYPES];
export type FlightType = typeof FLIGHT_TYPES[keyof typeof FLIGHT_TYPES];
export type EnergySource = typeof ENERGY_SOURCES[keyof typeof ENERGY_SOURCES];
export type FoodCategory = typeof FOOD_CATEGORIES[keyof typeof FOOD_CATEGORIES];
export type MealType = typeof MEAL_TYPES[keyof typeof MEAL_TYPES];
export type WasteType = typeof WASTE_TYPES[keyof typeof WASTE_TYPES];
