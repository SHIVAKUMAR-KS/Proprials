import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Property } from '../types';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  const investmentProgress =
    ((property.totalShares - property.availableShares) / property.totalShares) *
    100;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: property.images[0] || 'https://via.placeholder.com/300' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {property.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{property.category}</Text>
          </View>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          📍 {property.location}
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{property.expectedReturn}%</Text>
            <Text style={styles.statLabel}>Expected Return</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{property.duration}mo</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>${property.pricePerShare}</Text>
            <Text style={styles.statLabel}>Per Share</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${investmentProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {investmentProgress.toFixed(0)}% Funded
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>
            ${property.price.toLocaleString()}
          </Text>
          <Text style={styles.shares}>
            {property.availableShares} shares available
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width - theme.spacing.lg * 2;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.border,
  },
  content: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h3,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  location: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  shares: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});


