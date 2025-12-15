import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInvestments } from '../../stores/investmentStore';
import { theme } from '../../constants/theme';
import StatCard from '../../components/StatCard';

export default function InvestmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getInvestment } = useInvestments();

  const investment = getInvestment(id!);

  useEffect(() => {
    if (!investment) {
      Alert.alert('Error', 'Investment not found');
      router.back();
    }
  }, [investment]);

  if (!investment) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const expectedReturnAmount = (investment.amount * investment.expectedReturn) / 100;
  const totalReturn = investment.amount + expectedReturnAmount;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Investment Details</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                investment.status === 'active'
                  ? theme.colors.success + '20'
                  : theme.colors.textSecondary + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  investment.status === 'active'
                    ? theme.colors.success
                    : theme.colors.textSecondary,
              },
            ]}
          >
            {investment.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {investment.property && (
        <View style={styles.propertySection}>
          <Text style={styles.sectionTitle}>Property</Text>
          <Text style={styles.propertyTitle}>{investment.property.title}</Text>
          <Text style={styles.propertyLocation}>
            📍 {investment.property.location}
          </Text>
        </View>
      )}

      <View style={styles.stats}>
        <StatCard
          title="Investment Amount"
          value={`$${investment.amount.toLocaleString()}`}
          icon="💰"
          color={theme.colors.primary}
        />
        <StatCard
          title="Shares Owned"
          value={investment.shares.toLocaleString()}
          icon="📊"
          color={theme.colors.secondary}
        />
        <StatCard
          title="Expected Return"
          value={`${investment.expectedReturn}%`}
          icon="📈"
          color={theme.colors.success}
        />
        <StatCard
          title="Expected Returns"
          value={`$${expectedReturnAmount.toLocaleString()}`}
          icon="💵"
          color={theme.colors.info}
        />
        <StatCard
          title="Total Expected Value"
          value={`$${totalReturn.toLocaleString()}`}
          icon="🎯"
          color={theme.colors.warning}
        />
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Purchase Date</Text>
          <Text style={styles.infoValue}>
            {new Date(investment.purchaseDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Investment ID</Text>
          <Text style={styles.infoValue}>{investment.id}</Text>
        </View>
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
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  propertySection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  propertyTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  propertyLocation: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  stats: {
    marginBottom: theme.spacing.lg,
  },
  infoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  loadingText: {
    ...theme.typography.body,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
});


