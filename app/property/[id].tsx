import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProperties } from '../../stores/propertyStore';
import { useInvestments } from '../../stores/investmentStore';
import { useWallet } from '../../stores/walletStore';
import { theme } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/input';
import StatCard from '../../components/StatCard';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProperty } = useProperties();
  const { createInvestment, isLoading: investmentLoading } = useInvestments();
  const { wallet } = useWallet();
  const [shares, setShares] = useState('');
  const [showInvestForm, setShowInvestForm] = useState(false);

  const property = getProperty(id!);

  useEffect(() => {
    if (!property) {
      Alert.alert('Error', 'Property not found');
      router.back();
    }
  }, [property]);

  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleInvest = async () => {
    const sharesNum = parseInt(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of shares');
      return;
    }

    if (sharesNum > property.availableShares) {
      Alert.alert('Insufficient Shares', 'Not enough shares available');
      return;
    }

    const amount = sharesNum * property.pricePerShare;
    if (!wallet || wallet.balance < amount) {
      Alert.alert('Insufficient Balance', 'Please add funds to your wallet');
      return;
    }

    try {
      await createInvestment(property.id, sharesNum);
      Alert.alert('Success', 'Investment created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create investment');
    }
  };

  const investmentProgress =
    ((property.totalShares - property.availableShares) / property.totalShares) * 100;
  const totalInvestment = parseInt(shares) * property.pricePerShare || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: property.images[0] || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{property.category}</Text>
          </View>
        </View>

        <Text style={styles.location}>📍 {property.location}</Text>

        <Text style={styles.description}>{property.description}</Text>

        <View style={styles.stats}>
          <StatCard
            title="Expected Return"
            value={`${property.expectedReturn}%`}
            icon="📈"
            color={theme.colors.success}
          />
          <StatCard
            title="Duration"
            value={`${property.duration} months`}
            icon="⏱️"
            color={theme.colors.info}
          />
          <StatCard
            title="Price per Share"
            value={`$${property.pricePerShare}`}
            icon="💰"
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Investment Progress</Text>
            <Text style={styles.progressPercent}>{investmentProgress.toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${investmentProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {property.availableShares} of {property.totalShares} shares available
          </Text>
        </View>

        {showInvestForm ? (
          <View style={styles.investForm}>
            <Input
              label="Number of Shares"
              placeholder="Enter number of shares"
              value={shares}
              onChangeText={setShares}
              keyboardType="number-pad"
            />
            {shares && !isNaN(parseInt(shares)) && (
              <View style={styles.investmentSummary}>
                <Text style={styles.summaryText}>
                  Total Investment: ${totalInvestment.toLocaleString()}
                </Text>
                <Text style={styles.summarySubtext}>
                  Expected Return: ${(totalInvestment * property.expectedReturn / 100).toLocaleString()}
                </Text>
              </View>
            )}
            <View style={styles.investButtons}>
              <Button
                title="Invest Now"
                onPress={handleInvest}
                loading={investmentLoading}
                style={styles.investButton}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setShowInvestForm(false);
                  setShares('');
                }}
                variant="outline"
                style={styles.investButton}
              />
            </View>
          </View>
        ) : (
          <Button
            title="Invest in this Property"
            onPress={() => setShowInvestForm(true)}
            style={styles.investButton}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.border,
  },
  details: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h1,
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
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  stats: {
    marginBottom: theme.spacing.lg,
  },
  progressSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    ...theme.typography.h3,
  },
  progressPercent: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  investForm: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  investmentSummary: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  summarySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  investButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  investButton: {
    flex: 1,
  },
  loadingText: {
    ...theme.typography.body,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
});


