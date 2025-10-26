import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Insight } from '../types';

interface InsightCardProps {
  insight: Insight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <View style={styles.container}>
      <Text>Insight Card Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default InsightCard;
