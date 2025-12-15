import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import StatCard from '../../components/StatCard';
import { theme } from '../../constants/theme';
import { useInvestments } from '../../stores/investmentStore';

export default function PortfolioScreen() {
    const router = useRouter();
    const { investments, isLoading } = useInvestments();

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalShares = investments.reduce((sum, inv) => sum + inv.shares, 0);
    const expectedReturns = investments.reduce(
        (sum, inv) => sum + (inv.amount * inv.expectedReturn) / 100,
        0
    );
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading portfolio...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Portfolio</Text>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.statsContainer}>
                    <StatCard
                        title="Total Invested"
                        value={`$${totalInvested.toLocaleString()}`}
                        icon="💰"
                        color={theme.colors.primary}
                    />
                    <StatCard
                        title="Total Shares"
                        value={totalShares.toLocaleString()}
                        icon="📊"
                        color={theme.colors.secondary}
                    />
                    <StatCard
                        title="Expected Returns"
                        value={`$${expectedReturns.toLocaleString()}`}
                        icon="📈"
                        color={theme.colors.success}
                    />
                    <StatCard
                        title="Active Investments"
                        value={activeInvestments.toString()}
                        icon="✅"
                        color={theme.colors.info}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Investments</Text>
                    {investments.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="briefcase-outline" size={64} color={theme.colors.textSecondary} />
                            <Text style={styles.emptyText}>No investments yet</Text>
                            <Text style={styles.emptySubtext}>
                                Start investing in properties to see them here
                            </Text>
                        </View>
                    ) : (
                        investments.map(investment => (
                            <TouchableOpacity
                                key={investment.id}
                                style={styles.investmentCard}
                                onPress={() => router.push(`/investment/${investment.id}`)}
                            >
                                <View style={styles.investmentHeader}>
                                    <View style={styles.investmentInfo}>
                                        <Text style={styles.investmentTitle} numberOfLines={1}>
                                            {investment.property?.title || 'Property'}
                                        </Text>
                                        <Text style={styles.investmentDate}>
                                            {new Date(investment.purchaseDate).toLocaleDateString()}
                                        </Text>
                                    </View>
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
                                <View style={styles.investmentStats}>
                                    <View style={styles.stat}>
                                        <Text style={styles.statLabel}>Shares</Text>
                                        <Text style={styles.statValue}>{investment.shares}</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Text style={styles.statLabel}>Amount</Text>
                                        <Text style={styles.statValue}>
                                            ${investment.amount.toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Text style={styles.statLabel}>Expected Return</Text>
                                        <Text style={[styles.statValue, { color: theme.colors.success }]}>
                                            {investment.expectedReturn}%
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
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
    statsContainer: {
        marginBottom: theme.spacing.lg,
    },
    section: {
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.md,
    },
    loadingText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        padding: theme.spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xxl,
    },
    emptyText: {
        ...theme.typography.h3,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    emptySubtext: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    investmentCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    investmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    investmentInfo: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    investmentTitle: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.xs,
    },
    investmentDate: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    statusText: {
        ...theme.typography.caption,
        fontWeight: '600',
    },
    investmentStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    statValue: {
        ...theme.typography.body,
        fontWeight: '600',
    },
});


