import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';

import {
    WalletNavIcon,
    SettingsNavIcon,
    DepositIcon,
    WithdrawIcon,
    ShieldIcon,
    TransferNavIcon,
    HomeNavIcon,
    ChartNavIcon
} from '../../components/icons/Icons';
import { Screen } from '../../types';

const WalletScreen = ({ kycLevel, onNavigate }: { kycLevel: number; onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');

    // Sample data - would come from backend
    const balance = 6886.08;
    const walletAddress = 'TRx8f7K2mN3pQ9vL1wE5hJ6cD4bA0tY2sF';

    const depositHistory = [
        { id: 1, amount: 2500.00, network: 'USDT (TRC20)', status: 'Completed', date: '2024-01-15' },
        { id: 2, amount: 1000.00, network: 'USDT (TRC20)', status: 'Completed', date: '2024-01-10' },
        { id: 3, amount: 500.00, network: 'BTC', status: 'Completed', date: '2024-01-05' },
    ];
    const withdrawalHistory = [
        { id: 1, amount: 500.00, network: 'USDT (TRC20)', status: 'Processing', date: '2024-01-18' },
        { id: 2, amount: 350.00, network: 'USDT (TRC20)', status: 'Completed', date: '2024-01-08' },
    ];

    // Calculate stats
    const totalDeposits = depositHistory.reduce((sum, tx) => sum + tx.amount, 0);
    const totalWithdrawals = withdrawalHistory.reduce((sum, tx) => sum + tx.amount, 0);
    const pendingCount = withdrawalHistory.filter(tx => tx.status === 'Processing').length;
    const completedDeposits = depositHistory.filter(tx => tx.status === 'Completed').length;

    const canDeposit = kycLevel >= 1;
    const canWithdraw = kycLevel >= 2;

    const handleDeposit = () => {
        // if (!canDeposit) {
        //     Alert.alert('KYC Required', 'Level 1 verification is required to deposit funds.', [
        //         { text: 'Cancel' },
        //         { text: 'Verify Now', onPress: () => onNavigate('kycForm') }
        //     ]);
        //     return;
        // }
        onNavigate('deposit');
    };

    const handleWithdraw = () => {
        // if (!canWithdraw) {
        //     Alert.alert('KYC Level 2 Required', 'Complete Level 2 verification to withdraw funds.', [
        //         { text: 'Cancel' },
        //         { text: 'Upgrade KYC', onPress: () => onNavigate('kycForm') }
        //     ]);
        //     return;
        // }
        onNavigate('withdraw');
    };

    const copyAddress = () => {
        Alert.alert('Address Copied', 'Wallet address copied to clipboard');
    };

    // Stat Card Component
    const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
        <View style={{ flex: 1, backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: color, marginTop: 4 }}>{value}</Text>
        </View>
    );

    // Transaction Item Component
    const TransactionItem = ({ amount, network, status, date, isWithdrawal }: { amount: number; network: string; status: string; date: string; isWithdrawal?: boolean }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isWithdrawal ? colors.red + '15' : colors.green + '15', alignItems: 'center', justifyContent: 'center' }}>
                {isWithdrawal ? <WithdrawIcon color={colors.red} /> : <DepositIcon color={colors.green} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{network}</Text>
                <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: isWithdrawal ? colors.red : colors.green }}>{isWithdrawal ? '-' : '+'}${amount.toFixed(2)}</Text>
                <Text style={{ fontSize: 11, color: status === 'Completed' ? colors.green : colors.lavender, marginTop: 2 }}>{status}</Text>
            </View>
        </View>
    );

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>Wallet</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {kycLevel < 2 && (
                        <TouchableOpacity onPress={() => onNavigate('kycForm')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lavender + '15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                            <ShieldIcon size={14} />
                            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.lavender, marginLeft: 4 }}>KYC L{kycLevel}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Balance Card - Dark Theme for Better Contrast */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <LinearGradient colors={isDark ? [colors.cardDark, '#1a1a2e'] : ['#2d2d3a', '#1a1a2e']} style={{ borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
                        {/* Decorative */}
                        <View style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lavender + '15' }} />
                        <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '10' }} />

                        {/* Card Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                                    <WalletNavIcon active />
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>Wallet</Text>
                            </View>
                            <TouchableOpacity onPress={() => setActiveTab(activeTab === 'deposits' ? 'withdrawals' : 'deposits')} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                                <SettingsNavIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Balance */}
                        <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>AVAILABLE BALANCE</Text>
                        <Text style={{ fontSize: 42, fontWeight: '700', color: colors.white, marginTop: 4 }}>${balance.toFixed(2)}</Text>

                        {/* Monthly Stats */}
                        <View style={{ flexDirection: 'row', marginTop: 20, gap: 20 }}>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ fontSize: 11, color: colors.gray }}>This Month</Text>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.green }}>+$2,500.00</Text>
                            </View>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Pending</Text>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.lavender }}>$500.00</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
                            <TouchableOpacity
                                style={{ flex: 1, backgroundColor: colors.lavender, borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: canDeposit ? 1 : 0.6 }}
                                onPress={handleDeposit}
                            >
                                <DepositIcon color={colors.black} />
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>Deposit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', opacity: canWithdraw ? 1 : 0.5 }}
                                onPress={handleWithdraw}
                            >
                                <WithdrawIcon color={colors.white} />
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {/* Quick Stats */}
                <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, gap: 10 }}>
                    <StatCard label="Total Deposits" value={`$${totalDeposits.toFixed(0)}`} color={colors.green} />
                    <StatCard label="Withdrawn" value={`$${totalWithdrawals.toFixed(0)}`} color={colors.red} />
                    <StatCard label="Pending" value={pendingCount.toString()} color={colors.lavender} />
                </View>

                {/* Payment Gateway Info */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green + '15', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldIcon size={20} />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>Secure Payment Gateway</Text>
                                <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Instant crypto processing</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: colors.lavenderBg, borderRadius: 10, padding: 12 }}>
                            <Text style={{ fontSize: 12, color: colors.grayDark, lineHeight: 18 }}>Deposits and withdrawals are processed securely through our integrated payment gateway. No manual transfers required.</Text>
                        </View>
                    </View>
                </View>

                {/* KYC Notice */}
                {kycLevel < 2 && (
                    <TouchableOpacity
                        style={{ marginHorizontal: 16, marginBottom: 20, backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lavender + '33' }}
                        onPress={() => onNavigate('kycForm')}
                    >
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldIcon size={20} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>
                                {kycLevel === 0 ? 'Complete KYC Level 1' : 'Upgrade to KYC Level 2'}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>
                                {kycLevel === 0 ? 'Required for deposits' : 'Required for withdrawals'}
                            </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: colors.lavender, fontWeight: '600' }}>Verify</Text>
                    </TouchableOpacity>
                )}

                {/* Crypto Networks Info */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Supported Networks</Text>
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.green + '15', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.green }}>T</Text>
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>USDT (TRC20)</Text>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Recommended - Low fees</Text>
                            </View>
                            <View style={{ backgroundColor: colors.green + '15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                <Text style={{ fontSize: 10, fontWeight: '600', color: colors.green }}>Primary</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.lavender }}>E</Text>
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>USDT (ERC20)</Text>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Ethereum network</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F7931A22', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#F7931A' }}>B</Text>
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>BTC</Text>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Bitcoin network</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Transaction History Tabs */}
                <View style={{ marginHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: colors.grayLight + '22', borderRadius: 12, padding: 4, marginBottom: 16 }}>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === 'deposits' ? colors.cardDark : 'transparent', alignItems: 'center' }}
                            onPress={() => setActiveTab('deposits')}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'deposits' ? colors.textPrimary : colors.gray }}>Deposits</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === 'withdrawals' ? colors.cardDark : 'transparent', alignItems: 'center' }}
                            onPress={() => setActiveTab('withdrawals')}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'withdrawals' ? colors.textPrimary : colors.gray }}>Withdrawals</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Transaction List */}
                    {activeTab === 'deposits' ? (
                        depositHistory.length > 0 ? (
                            depositHistory.map((tx) => (
                                <TransactionItem key={tx.id} amount={tx.amount} network={tx.network} status={tx.status} date={tx.date} />
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                <Text style={{ fontSize: 14, color: colors.gray }}>No deposit history</Text>
                            </View>
                        )
                    ) : (
                        withdrawalHistory.length > 0 ? (
                            withdrawalHistory.map((tx) => (
                                <TransactionItem key={tx.id} amount={tx.amount} network={tx.network} status={tx.status} date={tx.date} isWithdrawal />
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                <Text style={{ fontSize: 14, color: colors.gray }}>No withdrawal history</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><WalletNavIcon active /></View></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default WalletScreen;
