/**
 * Emission Factors for Carbon Footprint Calculations
 * All values are in kg CO2 equivalent per unit
 */

// Transportation emission factors (kg CO2e per km)
export const TRANSPORTATION_FACTORS = {
    car: {
        gasoline: 0.192,      // Average gasoline car
        diesel: 0.171,        // Average diesel car
        electric: 0.053,      // Electric car (grid average)
        hybrid: 0.109,        // Hybrid car
    },
    bus: 0.089,             // Public bus per passenger
    train: 0.041,           // Train per passenger
    plane: {
        domestic: 0.255,      // Domestic flight per passenger
        international: 0.195, // International flight per passenger
    },
    bike: 0,                // Zero emissions
    walk: 0,                // Zero emissions
    motorcycle: 0.103,      // Motorcycle
    subway: 0.028,          // Subway/metro per passenger
} as const;

// Energy emission factors (kg CO2e per kWh or unit)
export const ENERGY_FACTORS = {
    electricity: 0.475,     // Grid electricity per kWh (global average)
    naturalGas: 0.185,      // Natural gas per kWh
    heating: {
        oil: 0.298,           // Heating oil per kWh
        gas: 0.185,           // Gas heating per kWh
        electric: 0.475,      // Electric heating per kWh
        coal: 0.354,          // Coal heating per kWh
    },
    solar: 0.048,           // Solar panel lifecycle per kWh
    wind: 0.011,            // Wind turbine lifecycle per kWh
} as const;

// Food emission factors (kg CO2e per kg of food)
export const FOOD_FACTORS = {
    beef: 27.0,             // Beef
    lamb: 39.2,             // Lamb
    pork: 12.1,             // Pork
    chicken: 6.9,           // Chicken
    fish: {
        farmed: 5.1,          // Farmed fish
        wild: 2.9,            // Wild-caught fish
    },
    eggs: 4.8,              // Eggs
    dairy: {
        milk: 1.9,            // Milk
        cheese: 13.5,         // Cheese
        yogurt: 2.2,          // Yogurt
        butter: 12.1,         // Butter
    },
    vegetables: 0.4,        // Average vegetables
    fruits: 0.5,            // Average fruits
    grains: {
        rice: 2.7,            // Rice
        wheat: 1.4,           // Wheat products
        oats: 0.9,            // Oats
    },
    legumes: 0.9,           // Beans, lentils
    nuts: 0.3,              // Nuts
    plantBased: {
        tofu: 2.0,            // Tofu
        tempeh: 1.6,          // Tempeh
        seitan: 1.2,          // Seitan
    },
} as const;

// Waste emission factors (kg CO2e per kg of waste)
export const WASTE_FACTORS = {
    general: 0.5,           // General waste to landfill
    recycling: {
        paper: -0.8,          // Recycling paper (negative = avoided emissions)
        plastic: -1.5,        // Recycling plastic
        glass: -0.3,          // Recycling glass
        metal: -2.0,          // Recycling metal
    },
    compost: -0.1,          // Composting organic waste (avoided emissions)
    electronic: 1.2,        // Electronic waste
    hazardous: 2.5,         // Hazardous waste
} as const;

// Activity type constants
export const ACTIVITY_TYPES = {
    TRANSPORTATION: 'transportation',
    ENERGY: 'energy',
    FOOD: 'food',
    WASTE: 'waste',
} as const;

// Transportation modes
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

// Fuel types for vehicles
export const FUEL_TYPES = {
    GASOLINE: 'gasoline',
    DIESEL: 'diesel',
    ELECTRIC: 'electric',
    HYBRID: 'hybrid',
} as const;

// Energy sources
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

// Waste types
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

// Type exports for TypeScript
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
export type TransportationMode = typeof TRANSPORTATION_MODES[keyof typeof TRANSPORTATION_MODES];
export type FuelType = typeof FUEL_TYPES[keyof typeof FUEL_TYPES];
export type EnergySource = typeof ENERGY_SOURCES[keyof typeof ENERGY_SOURCES];
export type WasteType = typeof WASTE_TYPES[keyof typeof WASTE_TYPES];
