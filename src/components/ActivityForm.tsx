import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityType, Activity } from '../types';

interface ActivityFormProps {
  activityType: ActivityType;
  onSubmit: (data: Partial<Activity>) => void;
  initialValues?: Partial<Activity>;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ activityType, onSubmit, initialValues }) => {
  return (
    <View style={styles.container}>
      <Text>Activity Form Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default ActivityForm;
