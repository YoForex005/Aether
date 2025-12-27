import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';

import {
    BackIcon,
    ChartNavIcon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    SettingsNavIcon,
    SignalIcon,
    ChartSquareIcon,
    BarChartIcon,
    WalletTwoToneIcon
} from '../../components/icons/Icons';
import { Screen } from '../../types';

const TransferScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    // Sample ongoing trades data
    const activeTrades = [
        { id: 1, plan: 'GROWTH', amount: 2500, startDate: '2024-01-10', daysLeft: 22, profit: 175.00, roi: 7.0 },
        { id: 2, plan: 'PRO', amount: 5000, startDate: '2024-01-05', daysLeft: 17, profit: 425.00, roi: 8.5 },
    ];

    // Sample trade history data
    const tradeHistory = [
        { id: 1, plan: 'STARTER', amount: 1000, startDate: '2023-12-01', endDate: '2023-12-31', profit: 50.00, status: 'Completed' },
        { id: 2, plan: 'GROWTH', amount: 2500, startDate: '2023-11-15', endDate: '2023-12-15', profit: 175.00, status: 'Completed' },
        { id: 3, plan: 'ELITE', amount: 10000, startDate: '2023-10-01', endDate: '2023-10-31', profit: 1200.00, status: 'Completed' },
    ];

    const totalActiveAmount = activeTrades.reduce((sum, t) => sum + t.amount, 0);
    const totalActiveProfit = activeTrades.reduce((sum, t) => sum + t.profit, 0);
    const avgROI = activeTrades.length > 0 ? activeTrades.reduce((sum, t) => sum + t.roi, 0) / activeTrades.length : 0;

    // Trade Card Component
    const ActiveTradeCard = ({ trade }: { trade: typeof activeTrades[0] }) => (
        <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                        <ChartSquareIcon size={20} color={colors.lavender} />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{trade.plan} Plan</Text>
                        <Text style={{ fontSize: 11, color: colors.gray }}>Started {trade.startDate}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: colors.green + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>Active</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <View>
                    <Text style={{ fontSize: 11, color: colors.gray }}>Invested</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>${trade.amount.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: colors.gray }}>Days Left</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.lavender }}>{trade.daysLeft}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 11, color: colors.gray }}>Earnings</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.green }}>+${trade.profit.toFixed(2)}</Text>
                </View>
            </View>
            {/* Progress Bar */}
            <View style={{ marginTop: 12 }}>
                <View style={{ height: 4, backgroundColor: colors.grayLight + '33', borderRadius: 2 }}>
                    <View style={{ width: `${((30 - trade.daysLeft) / 30) * 100}%`, height: 4, backgroundColor: colors.lavender, borderRadius: 2 }} />
                </View>
                <Text style={{ fontSize: 10, color: colors.gray, marginTop: 4 }}>{Math.round(((30 - trade.daysLeft) / 30) * 100)}% complete</Text>
            </View>
        </View>
    );

    // History Card Component
    const HistoryTradeCard = ({ trade }: { trade: typeof tradeHistory[0] }) => (
        <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.grayLight + '22', alignItems: 'center', justifyContent: 'center' }}>
                        <ChartSquareIcon size={18} color={colors.gray} />
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{trade.plan} Plan</Text>
                        <Text style={{ fontSize: 10, color: colors.gray }}>{trade.startDate} - {trade.endDate}</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.green }}>+${trade.profit.toFixed(2)}</Text>
                    <Text style={{ fontSize: 10, color: colors.gray }}>${trade.amount.toLocaleString()} invested</Text>
                </View>
            </View>
        </View>
    );

    // Lifetime earnings calculation
    const lifetimeEarnings = tradeHistory.reduce((sum, t) => sum + t.profit, 0) + totalActiveProfit;
    const totalCompletedTrades = tradeHistory.length;
    const winRate = 100; // All trades profitable

    return (
        <Layout>
            {/* Premium Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('home')}>
                        <BackIcon dark={isDark} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 14 }}>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary }}>Trading History</Text>
                        <Text style={{ fontSize: 12, color: colors.gray }}>Track your performance</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('mt5Account')}>
                    <ChartSquareIcon color={colors.lavender} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Main Stats Card - Dark Theme for Better Contrast */}
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                    <LinearGradient colors={isDark ? [colors.cardDark, '#1a1a2e'] : ['#2d2d3a', '#1a1a2e']} style={{ borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative' }}>
                        {/* Decorative */}
                        <View style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lavender + '15' }} />
                        <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '10' }} />

                        {/* Main Stats Row */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                            <View>
                                <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>TOTAL INVESTED</Text>
                                <Text style={{ fontSize: 36, fontWeight: '700', color: colors.white, marginTop: 6 }}>${totalActiveAmount.toLocaleString()}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>MONTHLY PROFIT</Text>
                                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.green, marginTop: 6 }}>+${totalActiveProfit.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Stats Pills */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 6, fontWeight: '500' }}>Active Plans</Text>
                                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.white }}>{activeTrades.length}</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 6, fontWeight: '500' }}>Avg. ROI</Text>
                                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.lavender }}>{avgROI.toFixed(1)}%</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 6, fontWeight: '500' }}>Win Rate</Text>
                                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.green }}>{winRate}%</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Lifetime Earnings Card */}
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center' }}>
                                    <WalletTwoToneIcon color={colors.green} size={24} />
                                </View>
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>Lifetime Earnings</Text>
                                    <Text style={{ fontSize: 22, fontWeight: '700', color: colors.green }}>${lifetimeEarnings.toFixed(2)}</Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: colors.green + '22', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>+{totalCompletedTrades + activeTrades.length} trades</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={{ flex: 1, backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                    <ChartSquareIcon size={14} />
                                </View>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Completed</Text>
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>{totalCompletedTrades}</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.green + '15', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                                    <BarChartIcon size={14} color={colors.green} />
                                </View>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Active</Text>
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary }}>{activeTrades.length}</Text>
                        </View>
                    </View>
                </View>

                {/* Tab Switcher */}
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: colors.grayLight + '22', borderRadius: 12, padding: 4 }}>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: activeTab === 'active' ? colors.cardDark : 'transparent', alignItems: 'center' }}
                            onPress={() => setActiveTab('active')}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'active' ? colors.textPrimary : colors.gray }}>Active ({activeTrades.length})</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: activeTab === 'history' ? colors.cardDark : 'transparent', alignItems: 'center' }}
                            onPress={() => setActiveTab('history')}
                        >
                            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'history' ? colors.textPrimary : colors.gray }}>History ({tradeHistory.length})</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={{ marginHorizontal: 16 }}>
                    {activeTab === 'active' ? (
                        activeTrades.length > 0 ? (
                            <>
                                {activeTrades.map((trade) => (
                                    <ActiveTradeCard key={trade.id} trade={trade} />
                                ))}
                                {/* Invest More CTA */}
                                <TouchableOpacity
                                    style={{ borderWidth: 2, borderColor: colors.lavender, borderStyle: 'dashed', borderRadius: 16, padding: 20, alignItems: 'center', marginTop: 8 }}
                                    onPress={() => onNavigate('plans')}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.lavender }}>+ Start New Investment</Text>
                                    <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>Browse available plans</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <ChartSquareIcon size={32} color={colors.lavender} />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>No Active Investments</Text>
                                <Text style={{ fontSize: 13, color: colors.gray, marginTop: 4, textAlign: 'center' }}>Start investing to see your trades here</Text>
                                <TouchableOpacity style={{ marginTop: 20, backgroundColor: colors.lavender, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }} onPress={() => onNavigate('plans')}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>Browse Plans</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    ) : (
                        tradeHistory.length > 0 ? (
                            <>
                                <View style={{ marginBottom: 12 }}>
                                    <Text style={{ fontSize: 13, color: colors.gray }}>Total earned: <Text style={{ fontWeight: '700', color: colors.green }}>${tradeHistory.reduce((sum, t) => sum + t.profit, 0).toFixed(2)}</Text></Text>
                                </View>
                                {tradeHistory.map((trade) => (
                                    <HistoryTradeCard key={trade.id} trade={trade} />
                                ))}
                            </>
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>No Trade History</Text>
                                <Text style={{ fontSize: 13, color: colors.gray, marginTop: 4 }}>Completed trades will appear here</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><TransferNavIcon /></View></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default TransferScreen;
