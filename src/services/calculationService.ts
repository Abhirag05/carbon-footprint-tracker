/**
 * Calculation Service for Carbon Emission Calculations
 */

import {
    TRANSPORTATION_FACTORS,
    ENERGY_FACTORS,
    FOOD_FACTORS,
    WASTE_FACTORS,
} from '../utils/emissionFactors';
import {
    ACTIVITY_TYPES,
    TRANSPORTATION_MODES,
    FUEL_TYPES,
    FLIGHT_TYPES,
    ENERGY_SOURCES,
    FOOD_CATEGORIES,
    WASTE_TYPES,
    ActivityType,
} from '../constants/activityTypes';
import {
    TransportationData,
    EnergyData,
    FoodData,
    WasteData,
} from '../utils/validators';

// Activity interface
export interface Activity {
    id: string;
    userId: string;
    type: ActivityType;
    date: Date;
    emissions: number;
    details: TransportationData | EnergyData | FoodData | WasteData;
    createdAt: Date;
    syncStatus?: string;
}

// Period type for filtering
export type Period = 'day' | 'week' | 'month' | 'year';

/**
 * Calculate emissions for transportation activities
 */
const calculateTransportationEmissions = (details: TransportationData): number => {
    const { mode, distance, fuelType, flightType } = details;

    switch (mode) {
        case TRANSPORTATION_MODES.CAR:
            if (fuelType === FUEL_TYPES.GASOLINE) {
                return distance * TRANSPORTATION_FACTORS.car.gasoline;
            } else if (fuelType === FUEL_TYPES.DIESEL) {
                return distance * TRANSPORTATION_FACTORS.car.diesel;
            } else if (fuelType === FUEL_TYPES.ELECTRIC) {
                return distance * TRANSPORTATION_FACTORS.car.electric;
            } else if (fuelType === FUEL_TYPES.HYBRID) {
                return distance * TRANSPORTATION_FACTORS.car.hybrid;
            }
            return distance * TRANSPORTATION_FACTORS.car.gasoline; // Default

        case TRANSPORTATION_MODES.BUS:
            return distance * TRANSPORTATION_FACTORS.bus;

        case TRANSPORTATION_MODES.TRAIN:
            return distance * TRANSPORTATION_FACTORS.train;

        case TRANSPORTATION_MODES.PLANE:
            if (flightType === FLIGHT_TYPES.DOMESTIC) {
                return distance * TRANSPORTATION_FACTORS.plane.domestic;
            } else if (flightType === FLIGHT_TYPES.INTERNATIONAL) {
                return distance * TRANSPORTATION_FACTORS.plane.international;
            }
            return distance * TRANSPORTATION_FACTORS.plane.domestic; // Default

        case TRANSPORTATION_MODES.BIKE:
            return distance * TRANSPORTATION_FACTORS.bike;

        case TRANSPORTATION_MODES.WALK:
            return distance * TRANSPORTATION_FACTORS.walk;

        case TRANSPORTATION_MODES.MOTORCYCLE:
            return distance * TRANSPORTATION_FACTORS.motorcycle;

        case TRANSPORTATION_MODES.SUBWAY:
            return distance * TRANSPORTATION_FACTORS.subway;

        default:
            return 0;
    }
};

/**
 * Calculate emissions for energy activities
 */
const calculateEnergyEmissions = (details: EnergyData): number => {
    const { source, amount } = details;

    switch (source) {
        case ENERGY_SOURCES.ELECTRICITY:
            return amount * ENERGY_FACTORS.electricity;

        case ENERGY_SOURCES.NATURAL_GAS:
            return amount * ENERGY_FACTORS.naturalGas;

        case ENERGY_SOURCES.HEATING_OIL:
            return amount * ENERGY_FACTORS.heating.oil;

        case ENERGY_SOURCES.HEATING_GAS:
            return amount * ENERGY_FACTORS.heating.gas;

        case ENERGY_SOURCES.HEATING_ELECTRIC:
            return amount * ENERGY_FACTORS.heating.electric;

        case ENERGY_SOURCES.HEATING_COAL:
            return amount * ENERGY_FACTORS.heating.coal;

        case ENERGY_SOURCES.SOLAR:
            return amount * ENERGY_FACTORS.solar;

        case ENERGY_SOURCES.WIND:
            return amount * ENERGY_FACTORS.wind;

        default:
            return 0;
    }
};

/**
 * Calculate emissions for food activities
 */
const calculateFoodEmissions = (details: FoodData): number => {
    const { foodItems } = details;
    let totalEmissions = 0;

    foodItems.forEach((item) => {
        const { category, servings } = item;
        let emissionFactor = 0;

        switch (category) {
            case FOOD_CATEGORIES.BEEF:
                emissionFactor = FOOD_FACTORS.beef;
                break;
            case FOOD_CATEGORIES.LAMB:
                emissionFactor = FOOD_FACTORS.lamb;
                break;
            case FOOD_CATEGORIES.PORK:
                emissionFactor = FOOD_FACTORS.pork;
                break;
            case FOOD_CATEGORIES.CHICKEN:
                emissionFactor = FOOD_FACTORS.chicken;
                break;
            case FOOD_CATEGORIES.FISH_FARMED:
                emissionFactor = FOOD_FACTORS.fish.farmed;
                break;
            case FOOD_CATEGORIES.FISH_WILD:
                emissionFactor = FOOD_FACTORS.fish.wild;
                break;
            case FOOD_CATEGORIES.EGGS:
                emissionFactor = FOOD_FACTORS.eggs;
                break;
            case FOOD_CATEGORIES.MILK:
                emissionFactor = FOOD_FACTORS.dairy.milk;
                break;
            case FOOD_CATEGORIES.CHEESE:
                emissionFactor = FOOD_FACTORS.dairy.cheese;
                break;
            case FOOD_CATEGORIES.YOGURT:
                emissionFactor = FOOD_FACTORS.dairy.yogurt;
                break;
            case FOOD_CATEGORIES.BUTTER:
                emissionFactor = FOOD_FACTORS.dairy.butter;
                break;
            case FOOD_CATEGORIES.VEGETABLES:
                emissionFactor = FOOD_FACTORS.vegetables;
                break;
            case FOOD_CATEGORIES.FRUITS:
                emissionFactor = FOOD_FACTORS.fruits;
                break;
            case FOOD_CATEGORIES.RICE:
                emissionFactor = FOOD_FACTORS.grains.rice;
                break;
            case FOOD_CATEGORIES.WHEAT:
                emissionFactor = FOOD_FACTORS.grains.wheat;
                break;
            case FOOD_CATEGORIES.OATS:
                emissionFactor = FOOD_FACTORS.grains.oats;
                break;
            case FOOD_CATEGORIES.LEGUMES:
                emissionFactor = FOOD_FACTORS.legumes;
                break;
            case FOOD_CATEGORIES.NUTS:
                emissionFactor = FOOD_FACTORS.nuts;
                break;
            case FOOD_CATEGORIES.TOFU:
                emissionFactor = FOOD_FACTORS.plantBased.tofu;
                break;
            case FOOD_CATEGORIES.TEMPEH:
                emissionFactor = FOOD_FACTORS.plantBased.tempeh;
                break;
            case FOOD_CATEGORIES.SEITAN:
                emissionFactor = FOOD_FACTORS.plantBased.seitan;
                break;
            default:
                emissionFactor = 0;
        }

        // Assume average serving is 0.2 kg
        totalEmissions += emissionFactor * servings * 0.2;
    });

    return totalEmissions;
};

/**
 * Calculate emissions for waste activities
 */
const calculateWasteEmissions = (details: WasteData): number => {
    const { wasteType, weight } = details;

    switch (wasteType) {
        case WASTE_TYPES.GENERAL:
            return weight * WASTE_FACTORS.general;

        case WASTE_TYPES.RECYCLING_PAPER:
            return weight * WASTE_FACTORS.recycling.paper;

        case WASTE_TYPES.RECYCLING_PLASTIC:
            return weight * WASTE_FACTORS.recycling.plastic;

        case WASTE_TYPES.RECYCLING_GLASS:
            return weight * WASTE_FACTORS.recycling.glass;

        case WASTE_TYPES.RECYCLING_METAL:
            return weight * WASTE_FACTORS.recycling.metal;

        case WASTE_TYPES.COMPOST:
            return weight * WASTE_FACTORS.compost;

        case WASTE_TYPES.ELECTRONIC:
            return weight * WASTE_FACTORS.electronic;

        case WASTE_TYPES.HAZARDOUS:
            return weight * WASTE_FACTORS.hazardous;

        default:
            return 0;
    }
};

/**
 * Calculate emissions for any activity type
 */
export const calculateEmissions = (
    type: ActivityType,
    details: TransportationData | EnergyData | FoodData | WasteData
): number => {
    let emissions = 0;

    switch (type) {
        case ACTIVITY_TYPES.TRANSPORTATION:
            emissions = calculateTransportationEmissions(details as TransportationData);
            break;
        case ACTIVITY_TYPES.ENERGY:
            emissions = calculateEnergyEmissions(details as EnergyData);
            break;
        case ACTIVITY_TYPES.FOOD:
            emissions = calculateFoodEmissions(details as FoodData);
            break;
        case ACTIVITY_TYPES.WASTE:
            emissions = calculateWasteEmissions(details as WasteData);
            break;
        default:
            emissions = 0;
    }

    // Round to 2 decimal places
    return Math.round(emissions * 100) / 100;
};

/**
 * Get date range for a given period
 */
const getDateRange = (period: Period): { start: Date; end: Date } => {
    const end = new Date();
    const start = new Date();

    switch (period) {
        case 'day':
            start.setHours(0, 0, 0, 0);
            break;
        case 'week':
            start.setDate(start.getDate() - 7);
            start.setHours(0, 0, 0, 0);
            break;
        case 'month':
            start.setMonth(start.getMonth() - 1);
            start.setHours(0, 0, 0, 0);
            break;
        case 'year':
            start.setFullYear(start.getFullYear() - 1);
            start.setHours(0, 0, 0, 0);
            break;
    }

    return { start, end };
};

/**
 * Filter activities by date range
 */
const filterActivitiesByPeriod = (activities: Activity[], period: Period): Activity[] => {
    const { start, end } = getDateRange(period);
    return activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= start && activityDate <= end;
    });
};

/**
 * Get total emissions for a given period
 */
export const getTotalEmissions = (activities: Activity[], period: Period): number => {
    const filteredActivities = filterActivitiesByPeriod(activities, period);
    const total = filteredActivities.reduce((sum, activity) => sum + activity.emissions, 0);
    return Math.round(total * 100) / 100;
};

/**
 * Get emissions breakdown by category
 */
export const getEmissionsByCategory = (
    activities: Activity[]
): Record<ActivityType, number> => {
    const breakdown: Record<string, number> = {
        [ACTIVITY_TYPES.TRANSPORTATION]: 0,
        [ACTIVITY_TYPES.ENERGY]: 0,
        [ACTIVITY_TYPES.FOOD]: 0,
        [ACTIVITY_TYPES.WASTE]: 0,
    };

    activities.forEach((activity) => {
        breakdown[activity.type] += activity.emissions;
    });

    // Round values
    Object.keys(breakdown).forEach((key) => {
        breakdown[key] = Math.round(breakdown[key] * 100) / 100;
    });

    return breakdown as Record<ActivityType, number>;
};

/**
 * Compare emissions with previous period
 */
export const compareWithPreviousPeriod = (
    activities: Activity[],
    period: Period
): { current: number; previous: number; change: number; percentageChange: number } => {
    const { start: currentStart, end: currentEnd } = getDateRange(period);

    // Calculate previous period dates
    const periodLength = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - periodLength);

    // Filter activities for current period
    const currentActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= currentStart && activityDate <= currentEnd;
    });

    // Filter activities for previous period
    const previousActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= previousStart && activityDate <= previousEnd;
    });

    const currentTotal = currentActivities.reduce((sum, activity) => sum + activity.emissions, 0);
    const previousTotal = previousActivities.reduce(
        (sum, activity) => sum + activity.emissions,
        0
    );

    const change = currentTotal - previousTotal;
    const percentageChange =
        previousTotal > 0 ? ((change / previousTotal) * 100) : 0;

    return {
        current: Math.round(currentTotal * 100) / 100,
        previous: Math.round(previousTotal * 100) / 100,
        change: Math.round(change * 100) / 100,
        percentageChange: Math.round(percentageChange * 100) / 100,
    };
};
