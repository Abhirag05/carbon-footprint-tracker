import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { Activity, ActivityType } from '../types';
import { lightHaptic, heavyHaptic } from '../utils/haptics';
import { colors, spacing, shadows, borderRadius } from '../theme/theme';

interface ActivityCardProps {
  activity: Activity;
  onPress?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress, onDelete }) => {
  const getActivityIcon = (type: ActivityType): string => {
    switch (type) {
      case 'transportation':
        return 'car';
      case 'energy':
        return 'lightning-bolt';
      case 'food':
        return 'food-apple';
      case 'waste':
        return 'delete';
      default:
        return 'help-circle';
    }
  };

  const getActivityColor = (type: ActivityType): string => {
    switch (type) {
      case 'transportation':
        return '#1976d2';
      case 'energy':
        return '#f57c00';
      case 'food':
        return '#388e3c';
      case 'waste':
        return '#7b1fa2';
      default:
        return '#757575';
    }
  };

  const formatDate = (date: Date): string => {
    const activityDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    activityDate.setHours(0, 0, 0, 0);

    if (activityDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (activityDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const getActivityDetails = (): string => {
    if (!activity.metadata) return activity.description;

    const meta = activity.metadata;

    switch (activity.type) {
      case 'transportation':
        if (meta.mode && meta.distance) {
          return `${meta.mode.charAt(0).toUpperCase() + meta.mode.slice(1)} - ${meta.distance} km`;
        }
        break;
      case 'energy':
        if (meta.source && meta.amount) {
          return `${meta.source.charAt(0).toUpperCase() + meta.source.slice(1)} - ${meta.amount} kWh`;
        }
        break;
      case 'food':
        if (meta.mealType) {
          const itemCount = meta.foodItems?.length || 0;
          return `${meta.mealType.charAt(0).toUpperCase() + meta.mealType.slice(1)} - ${itemCount} item(s)`;
        }
        break;
      case 'waste':
        if (meta.wasteType && meta.weight) {
          return `${meta.wasteType.charAt(0).toUpperCase() + meta.wasteType.slice(1)} - ${meta.weight} kg`;
        }
        break;
    }

    return activity.description;
  };

  const handleDelete = () => {
    heavyHaptic();
    onDelete?.(activity.id);
  };

  const handlePress = () => {
    lightHaptic();
    onPress?.(activity);
  };

  const renderRightActions = () => (
    <View style={styles.deleteAction}>
      <IconButton
        icon="delete"
        iconColor="#fff"
        size={24}
        onPress={handleDelete}
      />
    </View>
  );

  const cardContent = (
    <Card style={styles.card} mode="elevated">
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: getActivityColor(activity.type) }]}>
              <IconButton
                icon={getActivityIcon(activity.type)}
                iconColor="#fff"
                size={20}
              />
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.activityType}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </Text>
              <Text style={styles.activityDetails} numberOfLines={1}>
                {getActivityDetails()}
              </Text>
              <Text style={styles.activityDate}>{formatDate(activity.date)}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.emissionValue}>{activity.emissionKg.toFixed(1)}</Text>
            <Text style={styles.emissionUnit}>kg CO₂</Text>
            {!activity.synced && (
              <View style={styles.syncBadge}>
                <Text style={styles.syncBadgeText}>Pending</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  // Only wrap with Swipeable if onDelete is provided
  if (onDelete) {
    return (
      <Swipeable
        renderRightActions={renderRightActions}
        overshootRight={false}
        rightThreshold={40}
      >
        {cardContent}
      </Swipeable>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoSection: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.placeholder,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  emissionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
  },
  emissionUnit: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  syncBadge: {
    backgroundColor: colors.pending,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  syncBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
});

export default ActivityCard;
