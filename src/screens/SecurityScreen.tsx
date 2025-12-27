import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import { BackIcon, LockIcon, ShieldIcon } from '../components/Icons';
import { Screen } from '../types';

const SecurityScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = useState(true);

    const SecurityItem = ({ title, description, value, onToggle }: { title: string; description: string; value: boolean; onToggle: (val: boolean) => void }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.grayLight + '22' }}>
            <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>{title}</Text>
                <Text style={{ fontSize: 13, color: colors.gray }}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: colors.grayLight, true: colors.lavender }}
                thumbColor={colors.white}
                ios_backgroundColor={colors.grayLight}
            />
        </View>
    );

    return (
        <Layout>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? colors.cardDark : colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }} onPress={() => onNavigate('settings')}>
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>Security</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                            <LockIcon size={20} />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginLeft: 12 }}>Authentication</Text>
                    </View>

                    <SecurityItem
                        title="Biometric Login"
                        description="Use FaceID or Fingerprint to log in"
                        value={biometricEnabled}
                        onToggle={setBiometricEnabled}
                    />
                    <SecurityItem
                        title="Two-Factor Authentication"
                        description="Enable 2FA for withdrawals"
                        value={twoFAEnabled}
                        onToggle={setTwoFAEnabled}
                    />
                </View>

                <TouchableOpacity style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldIcon size={20} />
                        </View>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>Change Password</Text>
                            <Text style={{ fontSize: 13, color: colors.gray }}>Update your login password</Text>
                        </View>
                    </View>
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
            </ScrollView>
        </Layout>
    );
};

export default SecurityScreen;
