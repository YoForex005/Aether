import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import { BackIcon, SettingsNavIcon, BellIcon, EmailIcon } from '../components/Icons';
import { Screen } from '../types';

const AccountSettingsScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const [pushNotifs, setPushNotifs] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    const SettingItem = ({ title, description, value, onToggle }: { title: string; description: string; value: boolean; onToggle: (val: boolean) => void }) => (
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
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>Account Settings</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                            <BellIcon dark={isDark} />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginLeft: 12 }}>Notifications</Text>
                    </View>

                    <SettingItem
                        title="Push Notifications"
                        description="Receive alerts on your device"
                        value={pushNotifs}
                        onToggle={setPushNotifs}
                    />
                    <SettingItem
                        title="Email Notifications"
                        description="Receive transaction updates"
                        value={emailNotifs}
                        onToggle={setEmailNotifs}
                    />
                    <SettingItem
                        title="Marketing Emails"
                        description="Receive news and promotions"
                        value={marketingEmails}
                        onToggle={setMarketingEmails}
                    />
                </View>

                <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                            <SettingsNavIcon />
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginLeft: 12 }}>Preferences</Text>
                    </View>

                    <TouchableOpacity style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.grayLight + '22', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>Language</Text>
                            <Text style={{ fontSize: 13, color: colors.gray }}>English (US)</Text>
                        </View>
                        <BackIcon dark={isDark} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>Currency</Text>
                            <Text style={{ fontSize: 13, color: colors.gray }}>USD ($)</Text>
                        </View>
                        <BackIcon dark={isDark} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Layout>
    );
};

export default AccountSettingsScreen;
