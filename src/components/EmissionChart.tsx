import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmissionData, ChartPeriod, ChartType } from '../types';

interface EmissionChartProps {
  data: EmissionData[];
  period: ChartPeriod;
  chartType: ChartType;
}

const EmissionChart: React.FC<EmissionChartProps> = ({ data, period, chartType }) => {
  return (
    <View style={styles.container}>
      <Text>Emission Chart Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default EmissionChart;
