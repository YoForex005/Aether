import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import { Screen } from '../types';
import {
    BackIcon,
    ShieldIcon,
    DepositIcon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    ChartNavIcon,
    SettingsNavIcon
} from '../components/Icons';

const DepositScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [selectedNetwork, setSelectedNetwork] = useState('trc20');
    const [amount, setAmount] = useState('');

    const networks = [
        { id: 'trc20', name: 'USDT (TRC20)', fee: '1.00', recommended: true },
        { id: 'erc20', name: 'USDT (ERC20)', fee: '15.00', recommended: false },
        { id: 'btc', name: 'Bitcoin (BTC)', fee: '5.00', recommended: false },
    ];

    const quickAmounts = [100, 250, 500, 1000, 2500, 5000];
    const selectedNetworkData = networks.find(n => n.id === selectedNetwork);
    const fee = parseFloat(selectedNetworkData?.fee || '0');
    const totalAmount = parseFloat(amount || '0') + fee;

    const handleDeposit = () => {
        if (!amount || parseFloat(amount) < 10) {
            Alert.alert('Invalid Amount', 'Minimum deposit is $10');
            return;
        }
        Alert.alert('Processing', 'Redirecting to payment gateway...', [
            { text: 'OK', onPress: () => onNavigate('wallet') }
        ]);
    };

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.grayLight + '22', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('wallet')}>
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>Deposit Funds</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Network Selection */}
                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Select Network</Text>
                    {networks.map((network) => (
                        <TouchableOpacity
                            key={network.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.cardDark,
                                borderRadius: 14,
                                padding: 16,
                                marginBottom: 10,
                                borderWidth: 2,
                                borderColor: selectedNetwork === network.id ? colors.lavender : colors.grayLight + '33'
                            }}
                            onPress={() => setSelectedNetwork(network.id)}
                        >
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: network.recommended ? colors.green + '15' : colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: network.recommended ? colors.green : colors.lavender }}>{network.name.charAt(0)}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{network.name}</Text>
                                    {network.recommended && (
                                        <View style={{ backgroundColor: colors.green + '15', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 }}>
                                            <Text style={{ fontSize: 9, fontWeight: '600', color: colors.green }}>RECOMMENDED</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Network fee: ${network.fee}</Text>
                            </View>
                            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: selectedNetwork === network.id ? colors.lavender : colors.grayLight, alignItems: 'center', justifyContent: 'center' }}>
                                {selectedNetwork === network.id && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.lavender }} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Amount Input */}
                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Enter Amount</Text>
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.grayLight }}>$</Text>
                            <TextInput
                                style={{ flex: 1, fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginLeft: 4 }}
                                placeholder="0.00"
                                placeholderTextColor={colors.grayLight}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                        <Text style={{ fontSize: 12, color: colors.gray, marginTop: 4 }}>Minimum: $10</Text>
                    </View>

                    {/* Quick Amount Buttons */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                        {quickAmounts.map((amt) => (
                            <TouchableOpacity
                                key={amt}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    backgroundColor: amount === amt.toString() ? colors.lavender : colors.grayLight + '22'
                                }}
                                onPress={() => setAmount(amt.toString())}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '600', color: amount === amt.toString() ? colors.black : colors.gray }}>${amt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Fee Summary */}
                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, color: colors.gray }}>Deposit Amount</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>${amount || '0.00'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ fontSize: 14, color: colors.gray }}>Network Fee</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>${selectedNetworkData?.fee}</Text>
                        </View>
                        <View style={{ borderTopWidth: 1, borderTopColor: colors.grayLight + '33', paddingTop: 12 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>Total</Text>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.lavender }}>${totalAmount.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Gateway Info */}
                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    <View style={{ backgroundColor: colors.lavenderBg, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center' }}>
                        <ShieldIcon size={20} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={{ fontSize: 12, color: colors.grayDark, lineHeight: 18 }}>Payments processed securely via our integrated payment gateway. Funds typically arrive within 5-15 minutes.</Text>
                        </View>
                    </View>
                </View>

                {/* Deposit Button */}
                <View style={{ marginHorizontal: 16 }}>
                    <AnimatedButton onPress={handleDeposit}>
                        <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 14, paddingVertical: 18, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>Proceed to Payment</Text>
                        </LinearGradient>
                    </AnimatedButton>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default DepositScreen;
