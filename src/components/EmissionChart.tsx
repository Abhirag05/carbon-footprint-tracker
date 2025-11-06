import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { EmissionData, ChartPeriod, ChartType } from '../types';

interface EmissionChartProps {
  data: EmissionData[];
  period: ChartPeriod;
  chartType: ChartType;
}

const EmissionChart: React.FC<EmissionChartProps> = ({ data, period, chartType }) => {
  const screenWidth = Dimensions.get('window').width;

  // Format data for chart display
  const formatChartData = () => {
    if (data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Limit data points and format labels based on period to avoid congestion
    let skipLabels = 1;

    switch (period) {
      case 'day':
        // For day view, show only last 24 hours with hourly intervals
        // If more than 12 data points, show every other label
        if (sortedData.length > 12) {
          skipLabels = Math.ceil(sortedData.length / 12);
        }
        break;
      case 'week':
        // Week view is fine, show all 7 days
        skipLabels = 1;
        break;
      case 'month':
        // For month view, always show all 12 months (Jan to Dec)
        skipLabels = 1;
        break;
    }

    // Format labels based on period
    const labels = sortedData.map((item, index) => {
      // Only show label at intervals to avoid congestion
      if (index % skipLabels !== 0 && index !== sortedData.length - 1) {
        return '';
      }

      const date = new Date(item.date);

      switch (period) {
        case 'day':
          // Show hour (12am, 6am, 12pm, etc.)
          return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        case 'week':
          // Show day of week (Mon, Tue, etc.)
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        case 'month':
          // Show month names (Jan, Feb, Mar, etc.) - always show all 12 months
          return date.toLocaleDateString('en-US', { month: 'short' });
        case 'year':
          // Show month (Jan, Feb, etc.)
          return date.toLocaleDateString('en-US', { month: 'short' });
        default:
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    });

    const values = sortedData.map((item) => item.value);

    return {
      labels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(155, 3, 2, ${opacity})`, // Red color
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartData = formatChartData();

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(155, 3, 2, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#9b0302',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines
      stroke: '#e0e0e0',
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 11,
      fontWeight: '500',
    },
  };

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No emission data available</Text>
          <Text style={styles.emptySubtext}>Start tracking activities to see your carbon footprint</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={260}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withDots={data.length <= 15}
        withShadow={false}
        yAxisSuffix=" kg"
        yAxisInterval={1}
        fromZero={true}
        segments={4}
        verticalLabelRotation={period === 'month' && data.length > 20 ? 30 : 0}
        xLabelsOffset={-10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default EmissionChart;
