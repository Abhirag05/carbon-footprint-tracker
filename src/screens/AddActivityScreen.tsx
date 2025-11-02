import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SegmentedButtons, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ActivityForm from '../components/ActivityForm';
import OfflineBanner from '../components/OfflineBanner';
import { ACTIVITY_TYPES, ActivityType } from '../constants/activityTypes';
import { useActivity } from '../context/ActivityContext';
import { useAuth } from '../context/AuthContext';
import { calculateEmissions } from '../services/calculationService';
import { validateActivity } from '../utils/validators';

const AddActivityScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addActivity, isConnected } = useActivity();
  const { user } = useAuth();

  const [activityType, setActivityType] = useState<ActivityType>(ACTIVITY_TYPES.TRANSPORTATION);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (data: { type: ActivityType; date: Date; details: any }) => {
    try {
      setLoading(true);

      if (!user) {
        Alert.alert('Error', 'You must be logged in to save activities');
        setLoading(false);
        return;
      }

      // Validate activity data
      const validation = validateActivity(data.type, data.details);
      if (!validation.valid) {
        Alert.alert('Validation Error', validation.errors.join('\n'));
        setLoading(false);
        return;
      }

      // Calculate emissions
      const emissions = calculateEmissions(data.type, data.details);

      // Create activity object
      const activityData = {
        userId: user.id,
        type: data.type,
        description: generateDescription(data.type, data.details),
        emissionKg: emissions,
        date: data.date,
        metadata: data.details,
        synced: false,
      };

      // Save activity using ActivityContext
      await addActivity(activityData);

      // Show success message
      const message = isConnected
        ? 'Activity saved successfully!'
        : 'Activity saved offline. Will sync when online.';

      setSnackbarMessage(message);
      setSnackbarVisible(true);

      // Navigate back to HomeScreen after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error) {
      console.error('Error saving activity:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save activity';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = (type: ActivityType, details: any): string => {
    switch (type) {
      case ACTIVITY_TYPES.TRANSPORTATION:
        return `${details.mode} - ${details.distance} km`;

      case ACTIVITY_TYPES.ENERGY:
        return `${details.source} - ${details.amount} kWh`;

      case ACTIVITY_TYPES.FOOD:
        const itemCount = details.foodItems?.length || 0;
        return `${details.mealType} - ${itemCount} item(s)`;

      case ACTIVITY_TYPES.WASTE:
        return `${details.wasteType} - ${details.weight} kg`;

      default:
        return 'Activity';
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Offline Banner */}
      <OfflineBanner visible={!isConnected} />

      <View style={styles.container}>
        <View style={styles.typeSelector}>
          <SegmentedButtons
            value={activityType}
            onValueChange={(value) => setActivityType(value as ActivityType)}
            buttons={[
              {
                value: ACTIVITY_TYPES.TRANSPORTATION,
                label: 'Transport',
                icon: 'car',
              },
              {
                value: ACTIVITY_TYPES.ENERGY,
                label: 'Energy',
                icon: 'lightning-bolt',
              },
            ]}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#0c2d55',
                onSecondaryContainer: '#ffffff',
                onSurface: '#000000',
              },
            }}
          />
          <SegmentedButtons
            value={activityType}
            onValueChange={(value) => setActivityType(value as ActivityType)}
            buttons={[
              {
                value: ACTIVITY_TYPES.FOOD,
                label: 'Food',
                icon: 'food',
              },
              {
                value: ACTIVITY_TYPES.WASTE,
                label: 'Waste',
                icon: 'delete',
              },
            ]}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#0c2d55',
                onSecondaryContainer: '#ffffff',
                onSurface: '#000000',
              },
            }}
          />
        </View>

        <ActivityForm
          activityType={activityType}
          onSubmit={handleSubmit}
          loading={loading}
        />

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  typeSelector: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
});

export default AddActivityScreen;
