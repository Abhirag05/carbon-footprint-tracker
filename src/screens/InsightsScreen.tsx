import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Title, SegmentedButtons } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useActivity } from '../context/ActivityContext';
import {
  Activity as CalcActivity,
  getEmissionsByCategory,
  compareWithPreviousPeriod,
  Period,
} from '../services/calculationService';
import {
  generateRecommendations,
  generateAchievements,
} from '../services/insightsService';
import InsightCard from '../components/InsightCard';
import OfflineBanner from '../components/OfflineBanner';
import { Activity } from '../types';

const InsightsScreen: React.FC = () => {
  const { activities, loading, refreshActivities, isConnected } = useActivity();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

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

  // Get emissions by category
  const categoryBreakdown = useMemo(
    () => getEmissionsByCategory(calcActivities),
    [calcActivities]
  );

  // Generate recommendations
  const recommendations = useMemo(
    () => generateRecommendations(calcActivities, 6),
    [calcActivities]
  );

  // Generate achievements
  const achievements = useMemo(
    () => generateAchievements(calcActivities, selectedPeriod),
    [calcActivities, selectedPeriod]
  );

  // Compare with previous period
  const comparison = useMemo(
    () => compareWithPreviousPeriod(calcActivities, selectedPeriod),
    [calcActivities, selectedPeriod]
  );

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    const colors = {
      transportation: '#0c2d55',
      energy: '#f57c00',
      food: '#9b0302',
      waste: '#7b1fa2',
    };

    const labels = {
      transportation: 'Transport',
      energy: 'Energy',
      food: 'Food',
      waste: 'Waste',
    };

    return Object.entries(categoryBreakdown)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        name: labels[category as keyof typeof labels],
        population: value,
        color: colors[category as keyof typeof colors],
        legendFontColor: '#333',
        legendFontSize: 12,
      }));
  }, [categoryBreakdown]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshActivities();
    } finally {
      setRefreshing(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;

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
          <Title style={styles.headerTitle}>Insights & Recommendations</Title>
          <Text style={styles.headerSubtitle}>
            Personalized tips to reduce your carbon footprint
          </Text>
        </View>

        {activities.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={48}
                color="#999"
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>No insights yet</Text>
              <Text style={styles.emptySubtext}>
                Start tracking activities to get personalized recommendations
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Period Selector */}
            <View style={styles.periodSelector}>
              <SegmentedButtons
                value={selectedPeriod}
                onValueChange={(value) => setSelectedPeriod(value as Period)}
                buttons={[
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ]}
                theme={{
                  colors: {
                    secondaryContainer: '#0c2d55',
                    onSecondaryContainer: '#ffffff',
                    onSurface: '#0c2d55',
                  },
                }}
              />
            </View>

            {/* Comparison Card */}
            <Card style={styles.comparisonCard} elevation={2}>
              <Card.Content>
                <Text style={styles.comparisonLabel}>
                  Compared to previous {selectedPeriod}
                </Text>
                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonValue}>
                      {comparison.current.toFixed(1)}
                    </Text>
                    <Text style={styles.comparisonUnit}>kg CO₂</Text>
                    <Text style={styles.comparisonPeriod}>Current</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={
                      comparison.change < 0
                        ? 'arrow-down-circle'
                        : comparison.change > 0
                          ? 'arrow-up-circle'
                          : 'minus-circle'
                    }
                    size={32}
                    color={
                      comparison.change < 0
                        ? '#9b0302'
                        : comparison.change > 0
                          ? '#d32f2f'
                          : '#666'
                    }
                  />
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonValue}>
                      {comparison.previous.toFixed(1)}
                    </Text>
                    <Text style={styles.comparisonUnit}>kg CO₂</Text>
                    <Text style={styles.comparisonPeriod}>Previous</Text>
                  </View>
                </View>
                {comparison.percentageChange !== 0 && (
                  <Text
                    style={[
                      styles.changeText,
                      {
                        color: comparison.percentageChange < 0 ? '#9b0302' : '#d32f2f',
                      },
                    ]}
                  >
                    {comparison.percentageChange > 0 ? '+' : ''}
                    {comparison.percentageChange.toFixed(1)}% change
                  </Text>
                )}
              </Card.Content>
            </Card>

            {/* Achievements */}
            {achievements.length > 0 && (
              <View style={styles.achievementsContainer}>
                <Title style={styles.sectionTitle}>🎉 Achievements</Title>
                {achievements.map((achievement) => (
                  <Card key={achievement.id} style={styles.achievementCard} elevation={2}>
                    <Card.Content style={styles.achievementContent}>
                      <MaterialCommunityIcons
                        name={achievement.icon as any}
                        size={40}
                        color="#ffd700"
                      />
                      <View style={styles.achievementText}>
                        <Text style={styles.achievementTitle}>
                          {achievement.title}
                        </Text>
                        <Text style={styles.achievementMessage}>
                          {achievement.message}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}

            {/* Pie Chart */}
            {pieChartData.length > 0 && (
              <View style={styles.chartContainer}>
                <Title style={styles.sectionTitle}>Emissions by Category</Title>
                <Card style={styles.chartCard} elevation={2}>
                  <Card.Content>
                    <PieChart
                      data={pieChartData}
                      width={screenWidth - 64}
                      height={220}
                      chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </Card.Content>
                </Card>
              </View>
            )}

            {/* Recommendations */}
            <View style={styles.recommendationsContainer}>
              <Title style={styles.sectionTitle}>Personalized Tips</Title>
              <Text style={styles.sectionSubtitle}>
                Based on your activity patterns
              </Text>
              {recommendations.map((recommendation) => (
                <InsightCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))}
            </View>
          </>
        )}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9b0302',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  periodSelector: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  comparisonCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  comparisonUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  comparisonPeriod: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  achievementsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  achievementCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fffbf0',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  achievementMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chartContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#9b0302',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  recommendationsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyCard: {
    margin: 16,
    padding: 32,
    borderRadius: 8,
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: 16,
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
  },
});

export default InsightsScreen;
