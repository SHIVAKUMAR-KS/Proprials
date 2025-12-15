import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useWallet } from '../../stores/walletStore';
import { theme } from '../../constants/theme';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import Input from '../../components/input';

export default function WalletScreen() {
  const { wallet, deposit, isLoading } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    try {
      await deposit(amount);
      setDepositAmount('');
      setShowDepositForm(false);
      Alert.alert('Success', 'Deposit completed successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to deposit');
    }
  };

  const recentTransactions = wallet?.transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <StatCard
          title="Available Balance"
          value={`$${wallet?.balance.toLocaleString() || '0'}`}
          icon="💳"
          color={theme.colors.primary}
        />

        {!showDepositForm ? (
          <Button
            title="Add Funds"
            onPress={() => setShowDepositForm(true)}
            style={styles.button}
          />
        ) : (
          <View style={styles.depositForm}>
            <Input
              label="Amount"
              placeholder="Enter amount"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.depositButtons}>
              <Button
                title="Deposit"
                onPress={handleDeposit}
                loading={isLoading}
                style={styles.depositButton}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setShowDepositForm(false);
                  setDepositAmount('');
                }}
                variant="outline"
                style={styles.depositButton}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            recentTransactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionType}>
                      {transaction.type.toUpperCase()}
                    </Text>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.amount > 0
                            ? theme.colors.success
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    ${transaction.amount.toLocaleString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        transaction.status === 'completed'
                          ? theme.colors.success + '20'
                          : transaction.status === 'pending'
                          ? theme.colors.warning + '20'
                          : theme.colors.error + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          transaction.status === 'completed'
                            ? theme.colors.success
                            : transaction.status === 'pending'
                            ? theme.colors.warning
                            : theme.colors.error,
                      },
                    ]}
                  >
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
              </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  button: {
    marginBottom: theme.spacing.lg,
  },
  depositForm: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  depositButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  depositButton: {
    flex: 1,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  transactionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  transactionInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  transactionType: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  transactionDescription: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  transactionAmount: {
    ...theme.typography.h3,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
});


