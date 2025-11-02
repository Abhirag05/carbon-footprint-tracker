import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityType } from '../types';
import {
  ACTIVITY_TYPES,
  TRANSPORTATION_MODES,
  FUEL_TYPES,
  FLIGHT_TYPES,
  ENERGY_SOURCES,
  FOOD_CATEGORIES,
  MEAL_TYPES,
  WASTE_TYPES,
} from '../constants/activityTypes';
import {
  TransportationData,
  EnergyData,
  FoodData,
  WasteData,
} from '../utils/validators';
import { calculateEmissions } from '../services/calculationService';

interface ActivityFormProps {
  activityType: ActivityType;
  onSubmit: (data: { type: ActivityType; date: Date; details: any }) => void;
  initialValues?: { date?: Date; details?: any };
  loading?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activityType, onSubmit, initialValues, loading = false }) => {
  const [date, setDate] = useState<Date>(initialValues?.date || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [estimatedEmissions, setEstimatedEmissions] = useState<number>(0);

  // Transportation state
  const [transportMode, setTransportMode] = useState<string>('car');
  const [distance, setDistance] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('gasoline');
  const [flightType, setFlightType] = useState<string>('domestic');

  // Energy state
  const [energySource, setEnergySource] = useState<string>('electricity');
  const [energyAmount, setEnergyAmount] = useState<string>('');

  // Food state
  const [mealType, setMealType] = useState<string>('lunch');
  const [foodItems, setFoodItems] = useState<Array<{ category: string; servings: number }>>([]);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('chicken');
  const [servings, setServings] = useState<string>('1');

  // Waste state
  const [wasteType, setWasteType] = useState<string>('general');
  const [wasteWeight, setWasteWeight] = useState<string>('');

  // Calculate emissions in real-time
  useEffect(() => {
    try {
      let details: any = {};
      
      switch (activityType) {
        case ACTIVITY_TYPES.TRANSPORTATION:
          if (distance) {
            details = {
              mode: transportMode,
              distance: parseFloat(distance),
            };
            // Only add optional fields if they apply
            if (transportMode === 'car') {
              details.fuelType = fuelType;
            }
            if (transportMode === 'plane') {
              details.flightType = flightType;
            }
          }
          break;
        
        case ACTIVITY_TYPES.ENERGY:
          if (energyAmount) {
            details = {
              source: energySource,
              amount: parseFloat(energyAmount),
            };
          }
          break;
        
        case ACTIVITY_TYPES.FOOD:
          if (foodItems.length > 0) {
            details = {
              mealType,
              foodItems,
            };
          }
          break;
        
        case ACTIVITY_TYPES.WASTE:
          if (wasteWeight) {
            details = {
              wasteType,
              weight: parseFloat(wasteWeight),
            };
          }
          break;
      }

      if (Object.keys(details).length > 0) {
        const emissions = calculateEmissions(activityType, details);
        setEstimatedEmissions(emissions);
      } else {
        setEstimatedEmissions(0);
      }
    } catch (error) {
      setEstimatedEmissions(0);
    }
  }, [activityType, transportMode, distance, fuelType, flightType, energySource, energyAmount, mealType, foodItems, wasteType, wasteWeight]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddFoodItem = () => {
    const servingNum = parseFloat(servings);
    if (servingNum > 0) {
      setFoodItems([...foodItems, { category: selectedFoodCategory, servings: servingNum }]);
      setServings('1');
    }
  };

  const handleRemoveFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    let details: any = {};

    switch (activityType) {
      case ACTIVITY_TYPES.TRANSPORTATION:
        details = {
          mode: transportMode,
          distance: parseFloat(distance),
        };
        // Only add optional fields if they apply
        if (transportMode === 'car') {
          details.fuelType = fuelType;
        }
        if (transportMode === 'plane') {
          details.flightType = flightType;
        }
        break;
      
      case ACTIVITY_TYPES.ENERGY:
        details = {
          source: energySource,
          amount: parseFloat(energyAmount),
        };
        break;
      
      case ACTIVITY_TYPES.FOOD:
        details = {
          mealType,
          foodItems,
        };
        break;
      
      case ACTIVITY_TYPES.WASTE:
        details = {
          wasteType,
          weight: parseFloat(wasteWeight),
        };
        break;
    }

    onSubmit({ type: activityType, date, details });
  };

  const isFormValid = () => {
    switch (activityType) {
      case ACTIVITY_TYPES.TRANSPORTATION:
        return distance && parseFloat(distance) > 0;
      case ACTIVITY_TYPES.ENERGY:
        return energyAmount && parseFloat(energyAmount) > 0;
      case ACTIVITY_TYPES.FOOD:
        return foodItems.length > 0;
      case ACTIVITY_TYPES.WASTE:
        return wasteWeight && parseFloat(wasteWeight) > 0;
      default:
        return false;
    }
  };

  const renderTransportationFields = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Transportation Mode</Text>
      <SegmentedButtons
        value={transportMode}
        onValueChange={setTransportMode}
        buttons={[
          { value: 'car', label: 'Car' },
          { value: 'bus', label: 'Bus' },
          { value: 'train', label: 'Train' },
          { value: 'plane', label: 'Plane' },
        ]}
        style={styles.segmentedButtons}
      />
      <SegmentedButtons
        value={transportMode}
        onValueChange={setTransportMode}
        buttons={[
          { value: 'bike', label: 'Bike' },
          { value: 'walk', label: 'Walk' },
          { value: 'motorcycle', label: 'Moto' },
          { value: 'subway', label: 'Subway' },
        ]}
        style={styles.segmentedButtons}
      />

      {transportMode === 'car' && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>Fuel Type</Text>
          <SegmentedButtons
            value={fuelType}
            onValueChange={setFuelType}
            buttons={[
              { value: 'gasoline', label: 'Gasoline' },
              { value: 'diesel', label: 'Diesel' },
              { value: 'electric', label: 'Electric' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
            style={styles.segmentedButtons}
          />
        </>
      )}

      {transportMode === 'plane' && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>Flight Type</Text>
          <SegmentedButtons
            value={flightType}
            onValueChange={setFlightType}
            buttons={[
              { value: 'domestic', label: 'Domestic' },
              { value: 'international', label: 'International' },
            ]}
            style={styles.segmentedButtons}
          />
        </>
      )}

      <TextInput
        label="Distance (km)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
    </>
  );

  const renderEnergyFields = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Energy Source</Text>
      <SegmentedButtons
        value={energySource}
        onValueChange={setEnergySource}
        buttons={[
          { value: 'electricity', label: 'Electric' },
          { value: 'naturalGas', label: 'Gas' },
          { value: 'heatingOil', label: 'Oil' },
        ]}
        style={styles.segmentedButtons}
      />
      <SegmentedButtons
        value={energySource}
        onValueChange={setEnergySource}
        buttons={[
          { value: 'solar', label: 'Solar' },
          { value: 'wind', label: 'Wind' },
          { value: 'heatingCoal', label: 'Coal' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Amount (kWh)"
        value={energyAmount}
        onChangeText={setEnergyAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
    </>
  );

  const renderFoodFields = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Meal Type</Text>
      <SegmentedButtons
        value={mealType}
        onValueChange={setMealType}
        buttons={[
          { value: 'breakfast', label: 'Breakfast' },
          { value: 'lunch', label: 'Lunch' },
          { value: 'dinner', label: 'Dinner' },
          { value: 'snack', label: 'Snack' },
        ]}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>Add Food Items</Text>
      <SegmentedButtons
        value={selectedFoodCategory}
        onValueChange={setSelectedFoodCategory}
        buttons={[
          { value: 'beef', label: 'Beef' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'pork', label: 'Pork' },
          { value: 'lamb', label: 'Lamb' },
        ]}
        style={styles.segmentedButtons}
      />
      <SegmentedButtons
        value={selectedFoodCategory}
        onValueChange={setSelectedFoodCategory}
        buttons={[
          { value: 'fishFarmed', label: 'Fish' },
          { value: 'eggs', label: 'Eggs' },
          { value: 'cheese', label: 'Cheese' },
          { value: 'milk', label: 'Milk' },
        ]}
        style={styles.segmentedButtons}
      />
      <SegmentedButtons
        value={selectedFoodCategory}
        onValueChange={setSelectedFoodCategory}
        buttons={[
          { value: 'vegetables', label: 'Veggies' },
          { value: 'fruits', label: 'Fruits' },
          { value: 'rice', label: 'Rice' },
          { value: 'tofu', label: 'Tofu' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.foodItemRow}>
        <TextInput
          label="Servings"
          value={servings}
          onChangeText={setServings}
          keyboardType="numeric"
          mode="outlined"
          style={styles.servingsInput}
        />
        <Button mode="contained" onPress={handleAddFoodItem} style={styles.addButton}>
          Add
        </Button>
      </View>

      {foodItems.length > 0 && (
        <View style={styles.foodItemsList}>
          <Text variant="titleSmall" style={styles.sectionTitle}>Selected Items:</Text>
          {foodItems.map((item, index) => (
            <Chip
              key={index}
              onClose={() => handleRemoveFoodItem(index)}
              style={styles.chip}
            >
              {item.category}: {item.servings} serving(s)
            </Chip>
          ))}
        </View>
      )}
    </>
  );

  const renderWasteFields = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Waste Type</Text>
      <SegmentedButtons
        value={wasteType}
        onValueChange={setWasteType}
        buttons={[
          { value: 'general', label: 'General' },
          { value: 'recyclingPaper', label: 'Paper' },
          { value: 'recyclingPlastic', label: 'Plastic' },
        ]}
        style={styles.segmentedButtons}
      />
      <SegmentedButtons
        value={wasteType}
        onValueChange={setWasteType}
        buttons={[
          { value: 'recyclingGlass', label: 'Glass' },
          { value: 'compost', label: 'Compost' },
          { value: 'electronic', label: 'E-Waste' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Weight (kg)"
        value={wasteWeight}
        onChangeText={setWasteWeight}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dateSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Activity Date</Text>
        <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          {date.toLocaleDateString()}
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      {activityType === ACTIVITY_TYPES.TRANSPORTATION && renderTransportationFields()}
      {activityType === ACTIVITY_TYPES.ENERGY && renderEnergyFields()}
      {activityType === ACTIVITY_TYPES.FOOD && renderFoodFields()}
      {activityType === ACTIVITY_TYPES.WASTE && renderWasteFields()}

      {estimatedEmissions > 0 && (
        <View style={styles.emissionsPreview}>
          <Text variant="titleMedium">Estimated Emissions</Text>
          <Text variant="headlineMedium" style={styles.emissionsValue}>
            {estimatedEmissions.toFixed(2)} kg CO₂
          </Text>
        </View>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
        loading={loading}
        style={styles.submitButton}
      >
        Save Activity
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  foodItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  servingsInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    marginTop: 8,
  },
  foodItemsList: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 8,
  },
  emissionsPreview: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  emissionsValue: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ActivityForm;
