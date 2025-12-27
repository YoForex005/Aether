import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';

import {
    BackIcon,
    HomeNavIcon,
    WalletNavIcon,
    TransferNavIcon,
    ChartNavIcon,
    SettingsNavIcon
} from '../../components/icons/Icons';
import { Screen } from '../../types';

const TradesScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'open' | 'pending' | 'history'>('open');

    // Mock Data
    const trades = {
        open: [
            { id: 1, pair: 'XAU/USD', type: 'BUY', size: '0.50', entry: '2024.50', current: '2029.42', profit: 245.80, time: '2024.05.15 14:30' },
            { id: 2, pair: 'EUR/USD', type: 'SELL', size: '0.20', entry: '1.0892', current: '1.0908', profit: -32.40, time: '2024.05.16 09:15' },
            { id: 3, pair: 'GBP/JPY', type: 'BUY', size: '1.00', entry: '192.45', current: '192.80', profit: 350.00, time: '2024.05.16 10:45' },
        ],
        pending: [
            { id: 4, pair: 'USD/JPY', type: 'BUY LIMIT', size: '0.50', entry: '155.20', current: '155.80', status: 'Placed', time: '2024.05.16 11:00' },
            { id: 5, pair: 'NAS100', type: 'SELL STOP', size: '0.10', entry: '18450.00', current: '18500.00', status: 'Placed', time: '2024.05.16 12:20' },
        ],
        history: [
            { id: 6, pair: 'BTC/USD', type: 'BUY', size: '0.10', entry: '65200.00', exit: '66500.00', profit: 1300.00, closed: '2024.05.14 18:00' },
            { id: 7, pair: 'EUR/GBP', type: 'SELL', size: '0.30', entry: '0.8650', exit: '0.8620', profit: 90.00, closed: '2024.05.14 15:30' },
            { id: 8, pair: 'US30', type: 'BUY', size: '0.20', entry: '39500.00', exit: '39450.00', profit: -100.00, closed: '2024.05.13 20:15' },
        ]
    };

    const activeTrades = trades[activeTab];

    const getTotalProfit = () => {
        if (activeTab === 'open') {
            return activeTrades.reduce((acc, trade) => acc + (trade.profit || 0), 0);
        }
        return 0;
    };

    const totalProfit = getTotalProfit();

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 }}>
                <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('home')}>
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>Trades</Text>
            </View>

            {/* Total Profit (Only for Open Trades) */}
            {activeTab === 'open' && (
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <LinearGradient colors={[colors.cardDark, colors.cardLight]} style={{ borderRadius: 20, padding: 20 }}>
                        <Text style={{ fontSize: 13, color: colors.gray }}>Total P/L</Text>
                        <Text style={{ fontSize: 32, fontWeight: '700', color: totalProfit >= 0 ? colors.green : colors.red }}>
                            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                <Text style={{ fontSize: 11, color: colors.white }}>Margin: $1,250.00</Text>
                            </View>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                <Text style={{ fontSize: 11, color: colors.white }}>Level: 998%</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            )}

            {/* Tabs */}
            <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                {['open', 'pending', 'history'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: activeTab === tab ? colors.lavender : 'transparent' }}
                        onPress={() => setActiveTab(tab as any)}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab ? colors.black : colors.gray, textTransform: 'capitalize' }}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Trades List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}>
                {activeTrades.map((trade: any) => (
                    <View key={trade.id} style={{ backgroundColor: isDark ? 'rgba(30, 30, 45, 0.65)' : colors.white, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : colors.grayLight + '33' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginRight: 8 }}>{trade.pair}</Text>
                                    <View style={{ backgroundColor: trade.type.includes('BUY') ? (isDark ? 'rgba(76, 175, 80, 0.1)' : colors.green + '15') : (isDark ? 'rgba(244, 67, 54, 0.1)' : colors.red + '15'), paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: trade.type.includes('BUY') ? colors.green : colors.red }}>{trade.type}</Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 12, color: colors.gray }}>{trade.size} Lots • {trade.time}</Text>
                            </View>
                            {/* Profit/Loss or Status */}
                            {activeTab !== 'pending' ? (
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: trade.profit >= 0 ? colors.green : colors.red }}>
                                        {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                                    </Text>
                                    <Text style={{ fontSize: 11, color: colors.grayLight }}>USD</Text>
                                </View>
                            ) : (
                                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.lavender }}>{trade.status}</Text>
                            )}
                        </View>

                        {/* Details */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255, 255, 255, 0.04)' : colors.grayLight + '22' }}>
                            <View>
                                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Entry Price</Text>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>{trade.entry}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>{activeTab === 'history' ? 'Close Price' : 'Current Price'}</Text>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'history' ? colors.textPrimary : (trade.current > trade.entry ? colors.green : colors.red) }}>
                                    {activeTab === 'history' ? trade.exit : trade.current}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Empty State */}
                {activeTrades.length === 0 && (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ color: colors.gray, textAlign: 'center' }}>No trades found</Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><ChartNavIcon active /></View></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default TradesScreen;
