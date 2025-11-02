import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Button, Card, Title, Paragraph, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useActivity } from '../context/ActivityContext';
import {
  getTotalEmissions,
  Activity as CalcActivity,
  Period,
} from '../services/calculationService';
import EmissionChart from '../components/EmissionChart';
import ActivityCard from '../components/ActivityCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import OfflineBanner from '../components/OfflineBanner';
import { EmissionData, Activity, ChartPeriod } from '../types';
import { getPendingActivityCount } from '../services/syncService';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { activities, loading, error, refreshActivities, clearError, syncStatus, isConnected } = useActivity();
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Update pending count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await getPendingActivityCount();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Convert Activity to CalcActivity format
  const convertToCalcActivity = (activity: Activity): CalcActivity => ({
    id: activity.id,
    userId: activity.userId,
    type: activity.type,
    date: activity.date,
    emissions: activity.emissionKg,
    details: activity.metadata as any || {},
    createdAt: activity.createdAt,
    syncStatus: activity.synced ? 'synced' : 'pending',
  });

  const calcActivities = useMemo(
    () => activities.map(convertToCalcActivity),
    [activities]
  );

  // Calculate total emissions for different periods
  const dayTotal = useMemo(() => getTotalEmissions(calcActivities, 'day'), [calcActivities]);
  const weekTotal = useMemo(() => getTotalEmissions(calcActivities, 'week'), [calcActivities]);
  const monthTotal = useMemo(() => getTotalEmissions(calcActivities, 'month'), [calcActivities]);

  // Get recent activities (last 5)
  const recentActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [activities]);

  // Format chart data based on selected period
  const chartData = useMemo((): EmissionData[] => {
    const now = new Date();
    const dataMap = new Map<string, number>();

    // Initialize data points based on period
    if (selectedPeriod === 'day') {
      // Last 24 hours by hour
      for (let i = 23; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(now.getHours() - i, 0, 0, 0);
        const key = date.toISOString().split('T')[0] + 'T' + date.getHours().toString().padStart(2, '0');
        dataMap.set(key, 0);
      }
    } else if (selectedPeriod === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const key = date.toISOString().split('T')[0];
        dataMap.set(key, 0);
      }
    } else if (selectedPeriod === 'month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const key = date.toISOString().split('T')[0];
        dataMap.set(key, 0);
      }
    }

    // Aggregate emissions by date
    activities.forEach((activity) => {
      const activityDate = new Date(activity.date);
      let key: string;

      if (selectedPeriod === 'day') {
        // Group by hour
        key = activityDate.toISOString().split('T')[0] + 'T' + activityDate.getHours().toString().padStart(2, '0');
      } else {
        // Group by day
        key = activityDate.toISOString().split('T')[0];
      }

      if (dataMap.has(key)) {
        dataMap.set(key, (dataMap.get(key) || 0) + activity.emissionKg);
      }
    });

    // Convert map to array and format for chart
    return Array.from(dataMap.entries()).map(([date, value]) => ({
      date,
      value: Math.round(value * 100) / 100,
    }));
  }, [activities, selectedPeriod]);

  const handleRefresh = async () => {
    setRefreshing(true);
    clearError();
    try {
      await refreshActivities();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = () => {
    clearError();
    handleRefresh();
  };

  const handleAddActivity = () => {
    navigation.navigate('AddActivity' as never);
  };

  const handleViewAllActivities = () => {
    navigation.navigate('ActivityLog' as never);
  };

  const handleActivityPress = (activity: Activity) => {
    // Navigate to activity details or edit screen (future enhancement)
    console.log('Activity pressed:', activity.id);
  };

  // Show loading spinner on initial load
  if (loading && activities.length === 0 && !error) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <View style={styles.wrapper}>
      {/* Offline Banner */}
      <OfflineBanner visible={!isConnected} />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Title style={styles.headerTitle}>Carbon Footprint Dashboard</Title>
              <Paragraph style={styles.headerSubtitle}>
                Track your environmental impact
              </Paragraph>
            </View>
            <SyncStatusIndicator status={syncStatus} pendingCount={pendingCount} />
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            onDismiss={clearError}
            type="error"
          />
        )}

        {/* Emission Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryLabel}>Today</Text>
              <Text style={styles.summaryValue}>{dayTotal.toFixed(1)}</Text>
              <Text style={styles.summaryUnit}>kg CO₂</Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryLabel}>This Week</Text>
              <Text style={styles.summaryValue}>{weekTotal.toFixed(1)}</Text>
              <Text style={styles.summaryUnit}>kg CO₂</Text>
            </Card.Content>
          </Card>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryLabel}>This Month</Text>
              <Text style={styles.summaryValue}>{monthTotal.toFixed(1)}</Text>
              <Text style={styles.summaryUnit}>kg CO₂</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as ChartPeriod)}
            buttons={[
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </View>

        {/* Emission Chart */}
        <EmissionChart
          data={chartData}
          period={selectedPeriod}
          chartType="line"
        />

        {/* Quick Action Button */}
        <View style={styles.quickActionContainer}>
          <Button
            mode="contained"
            onPress={handleAddActivity}
            icon="plus"
            style={styles.addButton}
            contentStyle={styles.addButtonContent}
          >
            Add Activity
          </Button>
        </View>

        {/* Recent Activities */}
        <View style={styles.recentActivitiesContainer}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Recent Activities</Title>
            {recentActivities.length > 0 && (
              <TouchableOpacity onPress={handleViewAllActivities}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentActivities.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No activities yet</Text>
                <Text style={styles.emptySubtext}>
                  Start tracking your carbon footprint by adding your first activity
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <FlatList
              data={recentActivities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ActivityCard
                  activity={item}
                  onPress={handleActivityPress}
                />
              )}
              scrollEnabled={false}
              style={styles.activityList}
            />
          )}
        </View>
      </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  summaryUnit: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  periodSelector: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickActionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addButton: {
    borderRadius: 8,
  },
  addButtonContent: {
    paddingVertical: 8,
  },
  recentActivitiesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 16,
    elevation: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  activityList: {
    marginTop: 8,
  },
});

export default HomeScreen;
