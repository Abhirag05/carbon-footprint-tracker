import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  Button,
  Portal,
  Dialog,
  Chip,
  IconButton,
  Searchbar,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useActivity } from '../context/ActivityContext';
import ActivityCard from '../components/ActivityCard';
import OfflineBanner from '../components/OfflineBanner';
import { Activity, ActivityType } from '../types';
import { ACTIVITY_TYPES } from '../constants/activityTypes';

const ActivityLogScreen: React.FC = () => {
  const { activities, loading, refreshActivities, deleteActivity, setFilters, filters, isConnected } = useActivity();

  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  // Filter states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate);
  const [selectedType, setSelectedType] = useState<ActivityType | undefined>(filters.type);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters to activities
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Apply date range filter
    if (startDate) {
      filtered = filtered.filter(
        (activity) => new Date(activity.date) >= startDate
      );
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (activity) => new Date(activity.date) <= endOfDay
      );
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter((activity) => activity.type === selectedType);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.type.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          JSON.stringify(activity.metadata).toLowerCase().includes(query)
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [activities, startDate, endDate, selectedType, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshActivities();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeletePress = (activityId: string) => {
    setActivityToDelete(activityId);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (activityToDelete) {
      try {
        await deleteActivity(activityToDelete);
        setDeleteDialogVisible(false);
        setActivityToDelete(null);
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setActivityToDelete(null);
  };

  const handleActivityPress = (activity: Activity) => {
    // Navigate to activity details or edit screen (future enhancement)
    console.log('Activity pressed:', activity.id);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleTypeFilter = (type: ActivityType) => {
    if (selectedType === type) {
      setSelectedType(undefined);
    } else {
      setSelectedType(type);
    }
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedType(undefined);
    setSearchQuery('');
    setFilters({});
  };

  const hasActiveFilters = startDate || endDate || selectedType || searchQuery.trim();

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {hasActiveFilters ? 'No activities match your filters' : 'No activities yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        {hasActiveFilters
          ? 'Try adjusting your filters'
          : 'Start tracking your carbon footprint by adding activities'}
      </Text>
      {hasActiveFilters && (
        <Button mode="outlined" onPress={handleClearFilters} style={styles.clearButton}>
          Clear Filters
        </Button>
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Offline Banner */}
      <OfflineBanner visible={!isConnected} />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search activities..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          {/* Date Range Filters */}
          <View style={styles.dateFilters}>
            <View style={styles.dateFilterItem}>
              <Text style={styles.filterLabel}>From:</Text>
              <Button
                mode="outlined"
                onPress={() => setShowStartDatePicker(true)}
                style={styles.dateButton}
                compact
              >
                {startDate ? startDate.toLocaleDateString() : 'Select'}
              </Button>
              {startDate && (
                <IconButton
                  icon="close"
                  size={16}
                  onPress={() => setStartDate(undefined)}
                />
              )}
            </View>

            <View style={styles.dateFilterItem}>
              <Text style={styles.filterLabel}>To:</Text>
              <Button
                mode="outlined"
                onPress={() => setShowEndDatePicker(true)}
                style={styles.dateButton}
                compact
              >
                {endDate ? endDate.toLocaleDateString() : 'Select'}
              </Button>
              {endDate && (
                <IconButton
                  icon="close"
                  size={16}
                  onPress={() => setEndDate(undefined)}
                />
              )}
            </View>
          </View>

          {/* Type Filter Chips */}
          <View style={styles.typeFilters}>
            <Chip
              selected={selectedType === ACTIVITY_TYPES.TRANSPORTATION}
              onPress={() => handleTypeFilter(ACTIVITY_TYPES.TRANSPORTATION as ActivityType)}
              style={styles.chip}
              icon="car"
              selectedColor="#ffffff"
              theme={{
                colors: {
                  secondaryContainer: '#0c2d55',
                  onSecondaryContainer: '#ffffff',
                },
              }}
            >
              Transport
            </Chip>
            <Chip
              selected={selectedType === ACTIVITY_TYPES.ENERGY}
              onPress={() => handleTypeFilter(ACTIVITY_TYPES.ENERGY as ActivityType)}
              style={styles.chip}
              icon="lightning-bolt"
              selectedColor="#ffffff"
              theme={{
                colors: {
                  secondaryContainer: '#0c2d55',
                  onSecondaryContainer: '#ffffff',
                },
              }}
            >
              Energy
            </Chip>
            <Chip
              selected={selectedType === ACTIVITY_TYPES.FOOD}
              onPress={() => handleTypeFilter(ACTIVITY_TYPES.FOOD as ActivityType)}
              style={styles.chip}
              icon="food-apple"
              selectedColor="#ffffff"
              theme={{
                colors: {
                  secondaryContainer: '#0c2d55',
                  onSecondaryContainer: '#ffffff',
                },
              }}
            >
              Food
            </Chip>
            <Chip
              selected={selectedType === ACTIVITY_TYPES.WASTE}
              onPress={() => handleTypeFilter(ACTIVITY_TYPES.WASTE as ActivityType)}
              style={styles.chip}
              icon="delete"
              selectedColor="#ffffff"
              theme={{
                colors: {
                  secondaryContainer: '#0c2d55',
                  onSecondaryContainer: '#ffffff',
                },
              }}
            >
              Waste
            </Chip>
          </View>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              mode="text"
              onPress={handleClearFilters}
              style={styles.clearFiltersButton}
              compact
            >
              Clear All Filters
            </Button>
          )}
        </View>

        {/* Activity List */}
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              onPress={handleActivityPress}
              onDelete={handleDeletePress}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            maximumDate={endDate || new Date()}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={startDate}
            maximumDate={new Date()}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Portal>
          <Dialog visible={deleteDialogVisible} onDismiss={handleDeleteCancel}>
            <Dialog.Title>Delete Activity</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to delete this activity? This action cannot be undone.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDeleteCancel}>Cancel</Button>
              <Button onPress={handleDeleteConfirm} textColor="#d32f2f">
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  dateFilterItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dateButton: {
    flex: 1,
  },
  typeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    marginRight: 0,
  },
  clearFiltersButton: {
    alignSelf: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearButton: {
    marginTop: 8,
  },
});

export default ActivityLogScreen;
