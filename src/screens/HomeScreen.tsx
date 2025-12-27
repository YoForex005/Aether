import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import { Screen } from '../types';
import {
    UserAvatarIcon,
    BellIcon,
    ChatIcon,
    ShieldIcon,
    AetherLogo,
    SignalIcon,
    DepositIcon,
    WithdrawIcon,
    MT5Icon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    ChartNavIcon,
    SettingsNavIcon,
    NotificationsIcon,
    AlertIcon,
    PlusIcon
} from '../components/Icons';

const HomeScreen = ({ kycStatus, onNavigate }: { kycStatus: string; onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [balanceVisible, setBalanceVisible] = useState(true);
    const isLocked = kycStatus !== 'approved';

    // Updated Data: Investment Plans with generic tier names
    const investmentPlans = [
        { name: 'STARTER', return: '5%', deposit: '$1,000', color: isDark ? colors.cardDark : 'rgba(0, 0, 0, 0.07)', label: 'Tier 1' },
        { name: 'GROWTH', return: '7%', deposit: '$2,500', color: colors.lavender, label: 'Tier 2' },
        { name: 'PRO', return: '8.5%', deposit: '$5,000', color: colors.lavender, label: 'Tier 3' },
        { name: 'ELITE', return: '12%', deposit: '$10,000', color: colors.green, label: 'Tier 4' },
    ];

    const transactions = [
        { icon: <DepositIcon color={colors.green} />, name: 'Growth Plan', desc: 'Monthly Payout Received', amount: '+$175.00', isPositive: true },
        { icon: <DepositIcon color={isDark ? colors.white : colors.black} />, name: 'Deposit', desc: 'USDT (TRC20)', amount: '+$2,500.00', isPositive: true },
        { icon: <WithdrawIcon color={colors.red} />, name: 'Withdrawal', desc: 'Pending Processing', amount: '-$500.00', isPositive: false },
    ];

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 }}>
                <TouchableOpacity onPress={() => onNavigate('settings')} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? colors.cardLight : colors.white, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                    <UserAvatarIcon color={colors.lavender} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? colors.cardDark : colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                        <BellIcon dark={isDark} />
                        <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lavender, borderWidth: 1.5, borderColor: isDark ? colors.cardDark : colors.white }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? colors.cardDark : colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                        <ChatIcon dark={isDark} />
                        <View style={{ position: 'absolute', top: 8, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lavender, borderWidth: 1.5, borderColor: isDark ? colors.cardDark : colors.white }} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* KYC Warning (Restored) */}
                {isLocked && (
                    <TouchableOpacity style={{ marginHorizontal: 16, marginTop: 4, marginBottom: 12, borderRadius: 14, overflow: 'hidden' }} onPress={() => onNavigate('kycForm')} activeOpacity={0.9}>
                        <LinearGradient colors={['#2a2a3a', '#1a1a2a']} style={{ padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lavender + '33', borderRadius: 14 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldIcon size={20} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.white }}>Verify Identity</Text>
                                <Text style={{ fontSize: 11, color: colors.grayLight }}>Required for withdrawals</Text>
                            </View>
                            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.lavender }}>Verify →</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Main Balance Card */}
                <View style={{ marginHorizontal: 16, marginTop: isLocked ? 0 : 8, marginBottom: 16 }}>
                    <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
                        {/* Card Icons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                                <AetherLogo size={20} />
                            </View>
                            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                                <SignalIcon size={16} color={colors.black} />
                            </View>
                        </View>
                        {/* Balance */}
                        <Text style={{ fontSize: 13, color: colors.grayDark, marginBottom: 4 }}>Total Balance</Text>
                        <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                            <Text style={{ fontSize: 38, fontWeight: '700', color: colors.black }}>{balanceVisible ? '6886.08 €' : '••••••'}</Text>
                        </TouchableOpacity>
                        {/* Decorative Shape */}
                        <View style={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                        <View style={{ position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    </LinearGradient>
                </View>

                {/* Investment Plans (Was Crypto Cards) */}
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginHorizontal: 16, marginBottom: 12 }}>Investment Plans</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} style={{ marginBottom: 20 }}>
                    {investmentPlans.map((plan, idx) => (
                        <TouchableOpacity key={idx} onPress={() => onNavigate('plans')} activeOpacity={0.8}>
                            <View style={{ width: 140, backgroundColor: plan.color, borderRadius: 20, padding: 16, minHeight: 130 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: plan.color === colors.cardDark ? colors.textPrimary : colors.black, opacity: 0.8 }}>{plan.label}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: plan.color === colors.cardDark ? colors.green : colors.black }}>+{plan.return}</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: '700', color: plan.color === colors.cardDark ? colors.textPrimary : colors.black, marginBottom: 4 }}>{plan.deposit}</Text>
                                <Text style={{ fontSize: 11, color: plan.color === colors.cardDark ? colors.gray : 'rgba(0,0,0,0.6)' }}>Monthly Return</Text>
                                <View style={{ marginTop: 'auto', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '600', color: plan.color === colors.cardDark ? colors.textPrimary : colors.black }}>{plan.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* MT5 Account Card (Glassmorphism Pro) */}
                <View style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginHorizontal: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>Trading Account</Text>
                        <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('mt5Account')}>
                            <PlusIcon size={18} color={colors.lavender} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ marginHorizontal: 16 }} onPress={() => onNavigate('mt5Account')} activeOpacity={0.9}>
                        <View style={{ backgroundColor: isDark ? 'rgba(30, 30, 45, 0.7)' : colors.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : colors.grayLight + '33', shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0 : 0.05, shadowRadius: 8, elevation: isDark ? 0 : 2 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <LinearGradient colors={isDark ? ['#2a2a3a', '#1a1a2a'] : [colors.lavender + '15', colors.lavender + '05']} style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : colors.lavender + '22' }}>
                                    <MT5Icon size={22} color={isDark ? undefined : colors.lavender} />
                                </LinearGradient>
                                <View style={{ flex: 1, marginLeft: 14 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>MT5 Live Account</Text>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>FlexyMarketsServer</Text>
                                </View>
                                <View style={{ backgroundColor: isDark ? 'rgba(76, 175, 80, 0.1)' : colors.green + '15', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: isDark ? 'rgba(76, 175, 80, 0.2)' : colors.green + '22' }}>
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>Active</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : colors.grayLight + '15', borderRadius: 16, padding: 14, alignItems: 'center' }}>
                                <View style={{ alignItems: 'center', flex: 1, borderRightWidth: 1, borderRightColor: isDark ? 'rgba(255, 255, 255, 0.06)' : colors.grayLight + '33' }}>
                                    <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Account</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>50012847</Text>
                                </View>
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Equity</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.green }}>$12,450</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Active Trades (Glassmorphism Pro) */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>Active Positions</Text>
                        <TouchableOpacity onPress={() => onNavigate('trades')}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.lavender }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ gap: 10 }}>
                        <View style={{ backgroundColor: isDark ? 'rgba(30, 30, 45, 0.65)' : colors.white, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : colors.grayLight + '33' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: isDark ? 'rgba(76, 175, 80, 0.1)' : colors.green + '15', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, marginRight: 10 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.green }}>BUY</Text>
                                    </View>
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>XAU/USD</Text>
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.green }}>+$245.80</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, color: colors.gray }}>0.5 Lots • Entry: 2024.50</Text>
                                <Text style={{ fontSize: 12, color: colors.grayLight }}>Current: 2029.42</Text>
                            </View>
                        </View>
                        {/* Second Trade */}
                        <View style={{ backgroundColor: isDark ? 'rgba(30, 30, 45, 0.65)' : colors.white, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : colors.grayLight + '33' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ backgroundColor: isDark ? 'rgba(244, 67, 54, 0.1)' : colors.red + '15', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, marginRight: 10 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.red }}>SELL</Text>
                                    </View>
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>EUR/USD</Text>
                                </View>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.red }}>-$32.40</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, color: colors.gray }}>0.2 Lots • Entry: 1.0892</Text>
                                <Text style={{ fontSize: 12, color: colors.grayLight }}>Current: 1.0908</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Transactions (Modernized Pro) */}
                <View style={{ marginHorizontal: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 14 }}>Today</Text>
                    <View style={{ gap: 10 }}>
                        {transactions.map((tx, idx) => (
                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(30, 30, 45, 0.5)' : colors.white, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : colors.grayLight + '33' }}>
                                <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : colors.grayLight + '22', alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent' }}>
                                    {tx.icon}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 }}>{tx.name}</Text>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>{tx.desc}</Text>
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: tx.isPositive ? colors.green : colors.textPrimary }}>{tx.amount}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 20 }} />

            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><HomeNavIcon active /></View></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default HomeScreen;
