import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import { Screen } from '../types';
import {
    BackIcon,
    ChartNavIcon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    SettingsNavIcon,
    ShieldIcon,
    SignalIcon
} from '../components/Icons';

const PlansScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [botStatus, setBotStatus] = useState<{ [key: number]: boolean }>({
        1: false, 2: true, 3: false, 4: false // Sample: GROWTH plan is active
    });

    const plans = [
        {
            id: 1,
            tier: 'STARTER',
            amount: 1000,
            returns: 5,
            monthly: 50,
            color: colors.gray,
            features: ['Fixed 5% monthly return', 'Minimum 30 days lock', 'Withdraw anytime after']
        },
        {
            id: 2,
            tier: 'GROWTH',
            amount: 2500,
            returns: 7,
            monthly: 175,
            color: colors.lavender,
            features: ['Fixed 7% monthly return', 'Priority support', 'Flexible lock period']
        },
        {
            id: 3,
            tier: 'PRO',
            amount: 5000,
            returns: 8.5,
            monthly: 425,
            color: colors.lavender,
            popular: true,
            features: ['Fixed 8.5% monthly return', 'VIP support access', 'Auto-compound option']
        },
        {
            id: 4,
            tier: 'ELITE',
            amount: 10000,
            returns: 12,
            monthly: 1200,
            color: colors.green,
            featured: true,
            features: ['Highest 12% return', 'Dedicated account manager', 'Zero early withdrawal fee']
        },
    ];

    const handleSelectPlan = (planId: number) => {
        setSelectedPlan(planId);
    };

    // Check if any bot is currently active
    const activeBotId = Object.entries(botStatus).find(([_, isActive]) => isActive)?.[0];
    const hasActiveBot = activeBotId !== undefined;

    // User's available balance (would come from backend in real app)
    const userBalance = 6886.08;

    const handleBotToggle = (planId: number, currentStatus: boolean) => {
        const plan = plans.find(p => p.id === planId);

        if (currentStatus) {
            // Bot is currently ON, user wants to turn it OFF
            Alert.alert(
                'Stop Trading Bot?',
                `Are you sure you want to turn OFF the ${plan?.tier} trading bot?\n\nThis will cut off all ongoing trades for this plan. Any trades in progress may result in losses.\n\nThis action cannot be undone.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Turn Off',
                        style: 'destructive',
                        onPress: () => {
                            setBotStatus(prev => ({ ...prev, [planId]: false }));
                            Alert.alert('Bot Stopped', `${plan?.tier} trading bot has been stopped. All ongoing trades have been closed.`);
                        }
                    }
                ]
            );
        } else {
            // Bot is currently OFF, user wants to turn it ON
            // First check if user has sufficient balance
            if (userBalance < (plan?.amount || 0)) {
                Alert.alert(
                    'Insufficient Balance',
                    `You need at least $${plan?.amount.toLocaleString()} to activate the ${plan?.tier} bot.\n\nYour current balance: $${userBalance.toLocaleString()}\n\nPlease deposit more funds to continue.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Deposit Now', onPress: () => onNavigate('deposit') }
                    ]
                );
                return;
            }

            // Check if another bot is already active
            if (hasActiveBot) {
                const activePlan = plans.find(p => p.id === parseInt(activeBotId!));
                Alert.alert(
                    'Switch Trading Bot?',
                    `You already have the ${activePlan?.tier} bot running.\n\nOnly 1 bot can be active at a time. Switching to ${plan?.tier} will stop the ${activePlan?.tier} bot.\n\nYour request will be sent to admin for approval.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Request Switch',
                            onPress: () => {
                                Alert.alert(
                                    'Request Submitted',
                                    `Your request to switch from ${activePlan?.tier} to ${plan?.tier} bot has been sent to admin.\n\nYou will receive an approval confirmation via email within 24 hours.`,
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Activate Trading Bot?',
                    `Activate the ${plan?.tier} trading bot?\n\nMinimum Investment: $${plan?.amount.toLocaleString()}\nYour Balance: $${userBalance.toLocaleString()}\n\nYour request will be reviewed by admin.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Submit Request',
                            onPress: () => {
                                Alert.alert(
                                    'Request Submitted',
                                    `Your request to activate the ${plan?.tier} trading bot has been sent to admin for approval.\n\nYou will receive a confirmation via email within 24 hours. Once approved, trades will begin within 5 hours.`,
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    ]
                );
            }
        }
    };

    const handleInvest = () => {
        if (selectedPlan) {
            onNavigate('deposit');
        } else {
            Alert.alert('Select a Plan', 'Please select an investment plan to continue.');
        }
    };

    return (
        <Layout>
            {/* Premium Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('home')}>
                        <BackIcon dark={isDark} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 14 }}>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary }}>Trading Bots</Text>
                        <Text style={{ fontSize: 12, color: colors.gray }}>AI-Powered Automation</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('settings')}>
                    <SettingsNavIcon />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
                {/* Bot Status Overview - Dark Theme */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <LinearGradient colors={isDark ? [colors.cardDark, '#1a1a2e'] : ['#2d2d3a', '#1a1a2e']} style={{ borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative' }}>
                        {/* Decorative circles */}
                        <View style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lavender + '15' }} />
                        <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '10' }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <View>
                                <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>ACTIVE BOT</Text>
                                <Text style={{ fontSize: 42, fontWeight: '700', color: colors.white, marginTop: 4 }}>{hasActiveBot ? '1' : '0'}<Text style={{ fontSize: 22, color: colors.gray }}> / 1</Text></Text>
                            </View>
                            <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <ChartNavIcon />
                            </View>
                        </View>

                        <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                            <Text style={{ fontSize: 12, color: colors.grayLight, textAlign: 'center', lineHeight: 18 }}>Only 1 bot can be active • Admin approval required • Trades start within 5 hours</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Available Balance */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 12, color: colors.gray }}>Available Balance</Text>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>${userBalance.toLocaleString()}</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: colors.lavender, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }} onPress={() => onNavigate('deposit')}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.black }}>+ Add Funds</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section Title */}
                <View style={{ marginHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>Investment Plans</Text>
                    <View style={{ backgroundColor: hasActiveBot ? colors.green + '15' : colors.grayLight + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: hasActiveBot ? colors.green : colors.gray }}>{hasActiveBot ? '1 Active' : 'None Active'}</Text>
                    </View>
                </View>

                {/* Plans */}
                <View style={{ paddingHorizontal: 16 }}>
                    {plans.map((plan) => {
                        const isActive = botStatus[plan.id];
                        const isLocked = hasActiveBot && !isActive; // Locked if another bot is active
                        return (
                            <View
                                key={plan.id}
                                style={{
                                    backgroundColor: colors.cardDark,
                                    borderRadius: 20,
                                    padding: 20,
                                    marginBottom: 16,
                                    borderWidth: isActive ? 2 : 1,
                                    borderColor: isActive ? colors.green : isLocked ? colors.grayLight + '66' : colors.grayLight + '33',
                                    position: 'relative',
                                    overflow: 'visible',
                                    opacity: isLocked ? 0.7 : 1
                                }}
                            >
                                {/* Status Badge */}
                                <View style={{ position: 'absolute', top: -10, left: 16, backgroundColor: isActive ? colors.green : isLocked ? colors.grayDark : colors.gray, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, zIndex: 1 }}>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.white }}>{isActive ? 'ACTIVE' : isLocked ? 'LOCKED' : 'AVAILABLE'}</Text>
                                </View>

                                {/* Best Value / Popular Badges */}
                                {plan.featured && (
                                    <View style={{ position: 'absolute', top: -10, right: 16, backgroundColor: colors.green, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, zIndex: 1 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.white }}>BEST VALUE</Text>
                                    </View>
                                )}
                                {plan.popular && (
                                    <View style={{ position: 'absolute', top: -10, right: 16, backgroundColor: colors.lavender, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, zIndex: 1 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: colors.black }}>POPULAR</Text>
                                    </View>
                                )}

                                {/* Header Row */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, marginTop: 8 }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: plan.color, marginRight: 8 }} />
                                            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gray, letterSpacing: 1 }}>{plan.tier}</Text>
                                        </View>
                                        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.textPrimary }}>${plan.amount.toLocaleString()}</Text>
                                        <Text style={{ fontSize: 11, color: colors.gray }}>Investment</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontSize: 32, fontWeight: '700', color: plan.color }}>{plan.returns}%</Text>
                                        <Text style={{ fontSize: 11, color: colors.gray }}>monthly</Text>
                                    </View>
                                </View>

                                {/* Monthly Earnings */}
                                <View style={{ backgroundColor: isActive ? colors.green + '15' : colors.lavenderBg, borderRadius: 12, padding: 14, marginBottom: 14 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: colors.grayDark }}>Monthly Earnings</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.green }}>+${plan.monthly.toLocaleString()}</Text>
                                    </View>
                                </View>

                                {/* Bot Toggle */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                                    <View>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>Trading Bot</Text>
                                        <Text style={{ fontSize: 11, color: colors.gray }}>{isActive ? 'Bot is running' : 'Bot is stopped'}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: 60,
                                            height: 32,
                                            borderRadius: 16,
                                            backgroundColor: isActive ? colors.green : colors.grayLight,
                                            padding: 3,
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => handleBotToggle(plan.id, isActive)}
                                    >
                                        <View style={{
                                            width: 26,
                                            height: 26,
                                            borderRadius: 13,
                                            backgroundColor: colors.white,
                                            alignSelf: isActive ? 'flex-end' : 'flex-start',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontSize: 10, fontWeight: '700', color: isActive ? colors.green : colors.gray }}>{isActive ? 'ON' : 'OFF'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Activation Info */}
                                {isActive && (
                                    <View style={{ marginTop: 12, backgroundColor: colors.green + '10', borderRadius: 10, padding: 10 }}>
                                        <Text style={{ fontSize: 10, color: colors.green, textAlign: 'center' }}>Trades are active and running</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {/* Warning Notice */}
                    <View style={{ backgroundColor: colors.red + '10', borderRadius: 14, padding: 16, marginTop: 8, borderWidth: 1, borderColor: colors.red + '22' }}>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.red, marginBottom: 6 }}>Important Notice</Text>
                        <Text style={{ fontSize: 11, color: colors.grayDark, lineHeight: 16 }}>Turning OFF a bot will immediately stop all ongoing trades for that plan. Any trades in progress may result in losses. This action cannot be undone.</Text>
                    </View>

                    {/* How It Works */}
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 20, padding: 20, marginTop: 16 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>How It Works</Text>
                        <View style={{ gap: 14 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <ChartNavIcon />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, color: colors.gray, marginBottom: 2 }}>Step 1</Text>
                                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>Select a plan that fits your investment</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <ShieldIcon size={18} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, color: colors.gray, marginBottom: 2 }}>Step 2</Text>
                                    <Text style={{ fontSize: 13, color: colors.grayLight }}>Submit request for admin approval</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <SignalIcon size={18} color={colors.lavender} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, color: colors.gray, marginBottom: 2 }}>Step 3</Text>
                                    <Text style={{ fontSize: 13, color: colors.grayLight }}>Bot starts trading within 5 hours</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <WalletNavIcon />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, color: colors.gray, marginBottom: 2 }}>Step 4</Text>
                                    <Text style={{ fontSize: 13, color: colors.grayLight }}>Returns credited to wallet monthly</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed Bottom CTA */}
            <View style={{ position: 'absolute', bottom: 70, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.lavenderBg }}>
                <TouchableOpacity onPress={() => onNavigate('deposit')}>
                    <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 16, paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>Deposit to Invest</Text>
                        <View style={{ marginLeft: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.black }}>→</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><ChartNavIcon /></View></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default PlansScreen;
