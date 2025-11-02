import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface InsightRecommendation {
  id: string;
  category: 'transportation' | 'energy' | 'food' | 'waste';
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  impact: 'high' | 'medium' | 'low';
}

interface InsightCardProps {
  recommendation: InsightRecommendation;
}

const InsightCard: React.FC<InsightCardProps> = ({ recommendation }) => {
  const getIconColor = () => {
    switch (recommendation.category) {
      case 'transportation':
        return '#1976d2';
      case 'energy':
        return '#f57c00';
      case 'food':
        return '#388e3c';
      case 'waste':
        return '#7b1fa2';
      default:
        return '#666';
    }
  };

  const getImpactColor = () => {
    switch (recommendation.impact) {
      case 'high':
        return '#2e7d32';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#1976d2';
      default:
        return '#666';
    }
  };

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={recommendation.icon}
            size={32}
            color={getIconColor()}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{recommendation.title}</Text>
          <Text style={styles.description}>{recommendation.description}</Text>
          <View style={styles.impactBadge}>
            <Text style={[styles.impactText, { color: getImpactColor() }]}>
              {recommendation.impact.toUpperCase()} IMPACT
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  impactBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  impactText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default InsightCard;
