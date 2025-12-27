import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';
import AnimatedButton from '../../components/common/AnimatedButton';

import {
    BackIcon,
    ChartNavIcon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    SettingsNavIcon,
    ShieldIcon
} from '../../components/icons/Icons';
import { Screen } from '../../types';

const WithdrawScreen = ({ kycStatus, onNavigate }: { kycStatus: string; onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [selectedNetwork, setSelectedNetwork] = useState('trc20');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const isVerified = kycStatus === 'approved';
    const availableBalance = 6886.08;

    const networks = [
        { id: 'trc20', name: 'USDT (TRC20)', fee: '1.00', recommended: true },
        { id: 'erc20', name: 'USDT (ERC20)', fee: '15.00', recommended: false },
        { id: 'btc', name: 'Bitcoin (BTC)', fee: '5.00', recommended: false },
    ];

    const selectedNetworkData = networks.find(n => n.id === selectedNetwork);
    const fee = parseFloat(selectedNetworkData?.fee || '0');
    const withdrawAmount = parseFloat(amount || '0');
    const youReceive = Math.max(0, withdrawAmount - fee);

    const handleWithdraw = () => {
        if (!isVerified) {
            Alert.alert('Verification Required', 'Complete Level 2 KYC to withdraw.', [
                { text: 'Cancel' },
                { text: 'Verify Now', onPress: () => onNavigate('kycForm') }
            ]);
            return;
        }
        if (!amount || withdrawAmount < 50) {
            Alert.alert('Invalid Amount', 'Minimum withdrawal is $50');
            return;
        }
        if (!address || address.length < 20) {
            Alert.alert('Invalid Address', 'Please enter a valid wallet address');
            return;
        }
        Alert.alert('Success', 'Withdrawal request submitted! Processing time: 24-48 hours.', [
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
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>Withdraw Funds</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* KYC Warning */}
                {!isVerified && (
                    <TouchableOpacity style={{ marginHorizontal: 16, marginBottom: 20, backgroundColor: colors.red + '15', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.red + '33' }} onPress={() => onNavigate('kycForm')}>
                        <ShieldIcon size={24} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.red }}>Level 2 Verification Required</Text>
                            <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Complete KYC to unlock withdrawals</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.red }}>Verify</Text>
                    </TouchableOpacity>
                )}

                {/* Available Balance */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <View style={{ backgroundColor: colors.lavenderBg, borderRadius: 14, padding: 16, alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: colors.gray }}>Available Balance</Text>
                        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 4 }}>${availableBalance.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Network Selection */}
                <View style={{ marginHorizontal: 16, marginBottom: 20, opacity: isVerified ? 1 : 0.5 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Select Network</Text>
                    {networks.map((network) => (
                        <TouchableOpacity
                            key={network.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: isDark ? colors.cardDark : colors.white,
                                borderRadius: 14,
                                padding: 14,
                                marginBottom: 8,
                                borderWidth: 2,
                                borderColor: selectedNetwork === network.id ? colors.lavender : colors.grayLight + '33'
                            }}
                            onPress={() => isVerified && setSelectedNetwork(network.id)}
                            disabled={!isVerified}
                        >
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: network.recommended ? colors.green + '15' : colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '700', color: network.recommended ? colors.green : colors.lavender }}>{network.name.charAt(0)}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>{network.name}</Text>
                                <Text style={{ fontSize: 11, color: colors.gray }}>Fee: ${network.fee}</Text>
                            </View>
                            <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: selectedNetwork === network.id ? colors.lavender : colors.grayLight, alignItems: 'center', justifyContent: 'center' }}>
                                {selectedNetwork === network.id && <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: colors.lavender }} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Amount Input */}
                <View style={{ marginHorizontal: 16, marginBottom: 20, opacity: isVerified ? 1 : 0.5 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Withdrawal Amount</Text>
                    <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.grayLight }}>$</Text>
                            <TextInput
                                style={{ flex: 1, fontSize: 28, fontWeight: '700', color: colors.black, marginLeft: 4 }}
                                placeholder="0.00"
                                placeholderTextColor={colors.grayLight}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                editable={isVerified}
                            />
                            <TouchableOpacity onPress={() => isVerified && setAmount(availableBalance.toString())} style={{ backgroundColor: colors.lavender + '22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.lavender }}>MAX</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 11, color: colors.gray, marginTop: 8 }}>Minimum: $50</Text>
                    </View>
                </View>

                {/* Wallet Address */}
                <View style={{ marginHorizontal: 16, marginBottom: 20, opacity: isVerified ? 1 : 0.5 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Recipient Wallet Address</Text>
                    <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <TextInput
                            style={{ height: 48, fontSize: 13, color: colors.black, paddingHorizontal: 12 }}
                            placeholder="Enter your wallet address"
                            placeholderTextColor={colors.grayLight}
                            value={address}
                            onChangeText={setAddress}
                            editable={isVerified}
                        />
                    </View>
                    <Text style={{ fontSize: 11, color: colors.gray, marginTop: 8 }}>Make sure to enter the correct {selectedNetworkData?.name} address</Text>
                </View>

                {/* Fee Summary */}
                <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                    <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, color: colors.gray }}>Withdrawal Amount</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>${amount || '0.00'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, color: colors.gray }}>Network Fee</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.red }}>-${selectedNetworkData?.fee}</Text>
                        </View>
                        <View style={{ borderTopWidth: 1, borderTopColor: colors.grayLight + '33', paddingTop: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>You Receive</Text>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.green }}>${youReceive.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Processing Info */}
                <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
                    <View style={{ backgroundColor: colors.lavenderBg, borderRadius: 14, padding: 14 }}>
                        <Text style={{ fontSize: 11, color: colors.grayDark, lineHeight: 16 }}>Withdrawals are processed within 24-48 hours. You will receive an email confirmation once your withdrawal is complete.</Text>
                    </View>
                </View>

                {/* Withdraw Button */}
                <View style={{ marginHorizontal: 16 }}>
                    <AnimatedButton onPress={handleWithdraw} disabled={!isVerified}>
                        <LinearGradient colors={isVerified ? [colors.lavender, colors.lavenderLight] : [colors.grayLight, colors.gray]} style={{ borderRadius: 14, paddingVertical: 18, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: isVerified ? colors.black : colors.white }}>{isVerified ? 'Submit Withdrawal' : 'Verification Required'}</Text>
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

export default WithdrawScreen;
