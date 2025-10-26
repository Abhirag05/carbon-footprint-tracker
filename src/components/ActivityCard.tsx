import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onPress?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress, onDelete }) => {
  return (
    <View style={styles.container}>
      <Text>Activity Card Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default ActivityCard;
