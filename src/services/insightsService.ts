/**
 * Insights Service for generating personalized recommendations
 */

import { Activity, getEmissionsByCategory, compareWithPreviousPeriod, Period } from './calculationService';
import { ACTIVITY_TYPES, ActivityType } from '../constants/activityTypes';
import { InsightRecommendation } from '../components/InsightCard';

export interface AchievementMessage {
    id: string;
    title: string;
    message: string;
    icon: string;
    category: ActivityType;
}

/**
 * Recommendation database by category
 */
const RECOMMENDATIONS = {
    transportation: [
        {
            id: 'trans-1',
            title: 'Switch to Public Transit',
            description: 'Using buses or trains can reduce your carbon footprint by up to 45% compared to driving alone.',
            icon: 'bus' as const,
            impact: 'high' as const,
        },
        {
            id: 'trans-2',
            title: 'Try Carpooling',
            description: 'Share rides with colleagues or friends to cut your transportation emissions in half.',
            icon: 'car-multiple' as const,
            impact: 'high' as const,
        },
        {
            id: 'trans-3',
            title: 'Bike or Walk Short Distances',
            description: 'For trips under 3 km, consider biking or walking. It\'s zero emissions and great for your health!',
            icon: 'bike' as const,
            impact: 'medium' as const,
        },
        {
            id: 'trans-4',
            title: 'Consider an Electric Vehicle',
            description: 'Electric vehicles produce 70% less emissions than gasoline cars over their lifetime.',
            icon: 'car-electric' as const,
            impact: 'high' as const,
        },
        {
            id: 'trans-5',
            title: 'Combine Errands',
            description: 'Plan your trips to combine multiple errands and reduce overall driving distance.',
            icon: 'map-marker-path' as const,
            impact: 'medium' as const,
        },
        {
            id: 'trans-6',
            title: 'Work from Home',
            description: 'If possible, work remotely a few days per week to eliminate commute emissions.',
            icon: 'home-account' as const,
            impact: 'high' as const,
        },
    ],
    energy: [
        {
            id: 'energy-1',
            title: 'Switch to LED Bulbs',
            description: 'LED bulbs use 75% less energy than traditional bulbs and last 25 times longer.',
            icon: 'lightbulb-on-outline' as const,
            impact: 'medium' as const,
        },
        {
            id: 'energy-2',
            title: 'Unplug Devices',
            description: 'Unplug electronics when not in use. Phantom power can account for 10% of your electricity bill.',
            icon: 'power-plug-off' as const,
            impact: 'low' as const,
        },
        {
            id: 'energy-3',
            title: 'Adjust Your Thermostat',
            description: 'Lower heating by 1°C in winter or raise cooling by 1°C in summer to save 10% on energy.',
            icon: 'thermostat' as const,
            impact: 'high' as const,
        },
        {
            id: 'energy-4',
            title: 'Use Energy-Efficient Appliances',
            description: 'Choose ENERGY STAR certified appliances to reduce electricity consumption by 30%.',
            icon: 'washing-machine' as const,
            impact: 'high' as const,
        },
        {
            id: 'energy-5',
            title: 'Install Solar Panels',
            description: 'Solar panels can reduce your home energy emissions by up to 80% over their lifetime.',
            icon: 'solar-panel' as const,
            impact: 'high' as const,
        },
        {
            id: 'energy-6',
            title: 'Improve Insulation',
            description: 'Better insulation reduces heating and cooling needs, cutting energy use by up to 20%.',
            icon: 'home-thermometer' as const,
            impact: 'medium' as const,
        },
    ],
    food: [
        {
            id: 'food-1',
            title: 'Reduce Meat Consumption',
            description: 'Eating less red meat can reduce your food-related emissions by up to 50%.',
            icon: 'food-apple' as const,
            impact: 'high' as const,
        },
        {
            id: 'food-2',
            title: 'Choose Plant-Based Proteins',
            description: 'Beans, lentils, and tofu have 10x lower emissions than beef per gram of protein.',
            icon: 'sprout' as const,
            impact: 'high' as const,
        },
        {
            id: 'food-3',
            title: 'Buy Local and Seasonal',
            description: 'Local, seasonal produce reduces transportation emissions and supports local farmers.',
            icon: 'store' as const,
            impact: 'medium' as const,
        },
        {
            id: 'food-4',
            title: 'Reduce Food Waste',
            description: 'Plan meals and store food properly. Food waste accounts for 8% of global emissions.',
            icon: 'food-off' as const,
            impact: 'medium' as const,
        },
        {
            id: 'food-5',
            title: 'Try Meatless Mondays',
            description: 'Going meat-free one day per week can save the equivalent of driving 1,160 miles per year.',
            icon: 'calendar-check' as const,
            impact: 'medium' as const,
        },
        {
            id: 'food-6',
            title: 'Choose Sustainable Seafood',
            description: 'Opt for wild-caught fish over farmed, and avoid overfished species.',
            icon: 'fish' as const,
            impact: 'low' as const,
        },
    ],
    waste: [
        {
            id: 'waste-1',
            title: 'Start Composting',
            description: 'Composting organic waste prevents methane emissions from landfills and creates nutrient-rich soil.',
            icon: 'compost' as const,
            impact: 'medium' as const,
        },
        {
            id: 'waste-2',
            title: 'Recycle Properly',
            description: 'Recycling aluminum saves 95% of the energy needed to make new cans from raw materials.',
            icon: 'recycle' as const,
            impact: 'medium' as const,
        },
        {
            id: 'waste-3',
            title: 'Use Reusable Bags',
            description: 'Bring reusable bags when shopping to reduce plastic waste and production emissions.',
            icon: 'bag-personal' as const,
            impact: 'low' as const,
        },
        {
            id: 'waste-4',
            title: 'Avoid Single-Use Plastics',
            description: 'Choose reusable water bottles, coffee cups, and food containers to reduce plastic waste.',
            icon: 'bottle-soda' as const,
            impact: 'medium' as const,
        },
        {
            id: 'waste-5',
            title: 'Repair Instead of Replace',
            description: 'Fix broken items instead of buying new ones to reduce manufacturing emissions.',
            icon: 'tools' as const,
            impact: 'medium' as const,
        },
        {
            id: 'waste-6',
            title: 'Buy Second-Hand',
            description: 'Purchasing used items reduces demand for new production and associated emissions.',
            icon: 'tag-multiple' as const,
            impact: 'low' as const,
        },
    ],
};

/**
 * Generate personalized recommendations based on user's highest emission categories
 */
export const generateRecommendations = (
    activities: Activity[],
    maxRecommendations: number = 6
): InsightRecommendation[] => {
    if (activities.length === 0) {
        // Return general recommendations if no activities
        return [
            { ...RECOMMENDATIONS.transportation[0], category: ACTIVITY_TYPES.TRANSPORTATION },
            { ...RECOMMENDATIONS.energy[0], category: ACTIVITY_TYPES.ENERGY },
            { ...RECOMMENDATIONS.food[0], category: ACTIVITY_TYPES.FOOD },
        ];
    }

    // Get emissions by category
    const categoryBreakdown = getEmissionsByCategory(activities);

    // Sort categories by emissions (highest first)
    const sortedCategories = Object.entries(categoryBreakdown)
        .sort(([, a], [, b]) => b - a)
        .map(([category]) => category as ActivityType);

    const recommendations: InsightRecommendation[] = [];
    const recommendationsPerCategory = Math.ceil(maxRecommendations / sortedCategories.length);

    // Generate recommendations for each category, prioritizing highest emitters
    sortedCategories.forEach((category) => {
        const categoryRecs = RECOMMENDATIONS[category] || [];
        const selectedRecs = categoryRecs
            .slice(0, recommendationsPerCategory)
            .map((rec) => ({
                ...rec,
                category,
            }));
        recommendations.push(...selectedRecs);
    });

    // Return up to maxRecommendations
    return recommendations.slice(0, maxRecommendations);
};

/**
 * Detect emission reductions and generate achievement messages
 */
export const generateAchievements = (
    activities: Activity[],
    period: Period = 'week'
): AchievementMessage[] => {
    const achievements: AchievementMessage[] = [];

    // Compare with previous period
    const comparison = compareWithPreviousPeriod(activities, period);

    // Check for overall reduction
    if (comparison.percentageChange <= -10) {
        achievements.push({
            id: 'achievement-overall',
            title: 'Great Progress!',
            message: `You've reduced your emissions by ${Math.abs(comparison.percentageChange).toFixed(1)}% compared to last ${period}. Keep it up!`,
            icon: 'trophy',
            category: ACTIVITY_TYPES.TRANSPORTATION, // Generic
        });
    }

    // Check for category-specific reductions
    const currentBreakdown = getEmissionsByCategory(
        activities.filter((a) => {
            const date = new Date(a.date);
            const now = new Date();
            const periodStart = new Date();

            if (period === 'week') {
                periodStart.setDate(now.getDate() - 7);
            } else if (period === 'month') {
                periodStart.setMonth(now.getMonth() - 1);
            }

            return date >= periodStart && date <= now;
        })
    );

    const previousBreakdown = getEmissionsByCategory(
        activities.filter((a) => {
            const date = new Date(a.date);
            const now = new Date();
            const periodStart = new Date();
            const periodEnd = new Date();

            if (period === 'week') {
                periodEnd.setDate(now.getDate() - 7);
                periodStart.setDate(periodEnd.getDate() - 7);
            } else if (period === 'month') {
                periodEnd.setMonth(now.getMonth() - 1);
                periodStart.setMonth(periodEnd.getMonth() - 1);
            }

            return date >= periodStart && date <= periodEnd;
        })
    );

    // Check each category for improvements
    Object.keys(currentBreakdown).forEach((category) => {
        const categoryType = category as ActivityType;
        const current = currentBreakdown[categoryType];
        const previous = previousBreakdown[categoryType];

        if (previous > 0) {
            const categoryChange = ((current - previous) / previous) * 100;

            if (categoryChange <= -10) {
                const categoryNames = {
                    transportation: 'Transportation',
                    energy: 'Energy',
                    food: 'Food',
                    waste: 'Waste',
                };

                const icons = {
                    transportation: 'car',
                    energy: 'lightning-bolt',
                    food: 'food',
                    waste: 'delete',
                };

                achievements.push({
                    id: `achievement-${category}`,
                    title: `${categoryNames[categoryType]} Champion!`,
                    message: `You've cut your ${categoryNames[categoryType].toLowerCase()} emissions by ${Math.abs(categoryChange).toFixed(1)}%!`,
                    icon: icons[categoryType],
                    category: categoryType,
                });
            }
        }
    });

    return achievements;
};

/**
 * Get category with highest emissions
 */
export const getHighestEmissionCategory = (activities: Activity[]): ActivityType | null => {
    if (activities.length === 0) return null;

    const breakdown = getEmissionsByCategory(activities);
    const sorted = Object.entries(breakdown).sort(([, a], [, b]) => b - a);

    return sorted[0][0] as ActivityType;
};
