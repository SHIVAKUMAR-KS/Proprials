import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProperties } from '../../stores/propertyStore';
import { useAuth } from '../../stores/authStore';
import { useNotifications } from '../../stores/notificationStore';
import { theme } from '../../constants/theme';
import PropertyCard from '../../components/PropertyCard';
import StatCard from '../../components/StatCard';
import { useInvestments } from '../../stores/investmentStore';
import { useWallet } from '../../stores/walletStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { properties, isLoading, fetchProperties } = useProperties();
  const { investments } = useInvestments();
  const { wallet } = useWallet();
  const { unreadCount } = useNotifications();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments.reduce(
    (sum, inv) => sum + (inv.amount * inv.expectedReturn) / 100,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Text style={styles.subtitle}>Find your next investment</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Invested"
            value={`$${totalInvested.toLocaleString()}`}
            icon="💰"
            color={theme.colors.primary}
          />
          <StatCard
            title="Expected Returns"
            value={`$${totalReturns.toLocaleString()}`}
            icon="📈"
            color={theme.colors.success}
          />
          <StatCard
            title="Wallet Balance"
            value={`$${wallet?.balance.toLocaleString() || '0'}`}
            icon="💳"
            color={theme.colors.secondary}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Properties</Text>
            <TouchableOpacity onPress={() => router.push('/ai-assistant')}>
              <Ionicons name="sparkles" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {isLoading && properties.length === 0 ? (
            <Text style={styles.loadingText}>Loading properties...</Text>
          ) : properties.length === 0 ? (
            <Text style={styles.emptyText}>No properties available</Text>
          ) : (
            properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  greeting: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  statsContainer: {
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.xl,
  },
});


