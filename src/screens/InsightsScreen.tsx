import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InsightsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Insights Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InsightsScreen;
