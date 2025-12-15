import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../stores/authStore';
import { theme } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/input';

export default function KYCScreen() {
  const { user, refreshUser } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    // Simulate KYC submission
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'KYC Submitted',
        'Your KYC verification has been submitted. You will be notified once it is reviewed.',
        [{ text: 'OK', onPress: () => refreshUser() }]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>KYC Verification</Text>
        <Text style={styles.subtitle}>
          Complete your Know Your Customer verification to start investing
        </Text>
      </View>

      <View style={styles.statusSection}>
        <Text style={styles.statusLabel}>Current Status</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                user?.kycStatus === 'verified'
                  ? theme.colors.success + '20'
                  : user?.kycStatus === 'rejected'
                  ? theme.colors.error + '20'
                  : theme.colors.warning + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  user?.kycStatus === 'verified'
                    ? theme.colors.success
                    : user?.kycStatus === 'rejected'
                    ? theme.colors.error
                    : theme.colors.warning,
              },
            ]}
          >
            {user?.kycStatus?.toUpperCase() || 'PENDING'}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <Input
          label="Full Name"
          value={user?.name || ''}
          editable={false}
        />
        <Input
          label="Email"
          value={user?.email || ''}
          editable={false}
        />
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {user?.kycStatus !== 'verified' && (
          <Button
            title="Submit KYC"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          />
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Required Documents:</Text>
          <Text style={styles.infoText}>• Government-issued ID</Text>
          <Text style={styles.infoText}>• Proof of address</Text>
          <Text style={styles.infoText}>• Bank statement (optional)</Text>
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
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statusSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statusLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  form: {
    marginTop: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  infoBox: {
    backgroundColor: theme.colors.info + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  infoTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.xs,
  },
});


