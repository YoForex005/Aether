import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';

import {
    BackIcon,
    ChartNavIcon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    SettingsNavIcon,
    ShieldIcon,
    LockIcon,
    BellIcon,
    ChatIcon,
    UserIcon,
    SunIcon,
    MoonIcon
} from '../../components/icons/Icons';
import { UserConst } from '../../types/user';
import { Screen } from '../../types';

const SettingsScreen = ({ kycStatus, onNavigate }: { kycStatus: string; onNavigate: (s: Screen) => void }) => {
    const isVerified = kycStatus === 'approved';
    // Use useTheme to access current theme state and setter
    const { colors, themeMode, setThemeMode, isDark } = useTheme();

    // Profile Menu Item Component
    const MenuItem = ({ icon, title, subtitle, onPress, badge }: { icon: React.ReactNode; title: string; subtitle: string; onPress?: () => void; badge?: string }) => (
        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.grayLight + '22' }}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{title}</Text>
                <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{subtitle}</Text>
            </View>
            {badge ? (
                <View style={{ backgroundColor: colors.lavender + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.lavender }}>{badge}</Text>
                </View>
            ) : (
                <Text style={{ fontSize: 16, color: colors.grayLight }}>›</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.grayLight + '33' }} onPress={() => onNavigate('home')}>
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <BellIcon dark={isDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.grayLight + '33' }}>
                        <ChatIcon />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Profile Avatar Section - Tappable to edit */}
                <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 24 }} onPress={() => onNavigate('personalData')} activeOpacity={0.8}>
                    {/* Decorative circles */}
                    <View style={{ position: 'absolute', top: 10, left: 60, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.lavender + '44' }} />
                    <View style={{ position: 'absolute', top: 40, right: 80, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.lavender + '33' }} />
                    <View style={{ position: 'absolute', bottom: 60, left: 100, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lavenderLight + '44' }} />

                    {/* Avatar */}
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.lavender + '44' }}>
                        <Text style={{ fontSize: 40, fontWeight: '700', color: colors.lavender }}>U</Text>
                    </View>

                    {/* Name */}
                    UserConst.updateProfile(res.data.data);

                                        <Text
    style={{
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 16
    }}
>
    {UserConst.name || "User Namess"}
</Text>

                    {/* Username Badge */}
                    <View style={{ backgroundColor: colors.lavender + '15', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 8 }}>
                        <Text style={{ fontSize: 13, color: colors.grayDark }}>@aether_user</Text>
                    </View>

                    {/* Edit hint */}
                    <Text style={{ fontSize: 11, color: colors.lavender, marginTop: 8 }}>Tap to edit profile</Text>

                    {/* Verification Badge */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: isVerified ? colors.green + '15' : colors.red + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                        <ShieldIcon size={14} />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: isVerified ? colors.green : colors.red, marginLeft: 6 }}>{isVerified ? 'Verified Account' : 'Unverified'}</Text>
                    </View>
                </TouchableOpacity>

                {/* Menu Items */}
                <View style={{ paddingHorizontal: 16 }}>
                    <MenuItem
                        icon={<UserIcon />}
                        title="Personal Data"
                        subtitle="View and edit your profile"
                        onPress={() => onNavigate('personalData')}
                    />

                    <MenuItem
                        icon={<ShieldIcon size={20} />}
                        title="Identity Verification"
                        subtitle="KYC for withdrawals"
                        onPress={() => onNavigate('kycForm')}
                        badge={isVerified ? 'Done' : undefined}
                    />

                    <MenuItem
                        icon={<ChartNavIcon />}
                        title="My Investments"
                        subtitle="Active plans and returns"
                        onPress={() => onNavigate('plans')}
                    />

                    <MenuItem
                        icon={<TransferNavIcon />}
                        title="Transactions"
                        subtitle="Deposits and withdrawals"
                        onPress={() => onNavigate('home')}
                    />

                    <MenuItem
                        icon={<LockIcon size={20} />}
                        title="Security"
                        subtitle="Password and 2FA settings"
                        onPress={() => onNavigate('security')}
                    />

                    <MenuItem
                        icon={<SettingsNavIcon />}
                        title="Account Settings"
                        subtitle="Preferences and notifications"
                        onPress={() => onNavigate('accountSettings')}
                    />

                    {/* Theme Appearance Section */}
                    <View style={{ marginTop: 8, marginBottom: 12 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.gray, marginBottom: 12 }}>APPEARANCE</Text>
                        <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                                    {isDark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
                                </View>
                                <View style={{ flex: 1, marginLeft: 14 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>Theme Mode</Text>
                                    <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>
                                        {themeMode === 'system' ? 'Following device settings' : themeMode === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
                                    </Text>
                                </View>
                            </View>

                            {/* Theme Toggle Buttons */}
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: themeMode === 'system' ? colors.lavender : colors.grayLight + '22',
                                        borderRadius: 12,
                                        paddingVertical: 12,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => setThemeMode('system')}
                                >
                                    <SettingsNavIcon />
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: themeMode === 'system' ? colors.black : colors.gray, marginTop: 4 }}>System</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: themeMode === 'light' ? colors.lavender : colors.grayLight + '22',
                                        borderRadius: 12,
                                        paddingVertical: 12,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => setThemeMode('light')}
                                >
                                    <SunIcon size={20} color={themeMode === 'light' ? colors.black : colors.gray} />
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: themeMode === 'light' ? colors.black : colors.gray, marginTop: 4 }}>Light</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: themeMode === 'dark' ? colors.lavender : colors.grayLight + '22',
                                        borderRadius: 12,
                                        paddingVertical: 12,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => setThemeMode('dark')}
                                >
                                    <MoonIcon size={20} color={themeMode === 'dark' ? colors.black : colors.gray} />
                                    <Text style={{ fontSize: 11, fontWeight: '600', color: themeMode === 'dark' ? colors.black : colors.gray, marginTop: 4 }}>Dark</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                    <TouchableOpacity
                        style={{ backgroundColor: colors.red + '15', borderRadius: 16, padding: 16, alignItems: 'center' }}
                        onPress={() => Alert.alert('Logout', 'Are you sure you want to log out?', [{ text: 'Cancel' }, { text: 'Logout', style: 'destructive'  }])}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.red }}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><SettingsNavIcon /></View></TouchableOpacity>
            </View>
        </Layout>
    );
};

export default SettingsScreen;
