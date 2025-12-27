import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';
import AnimatedButton from '../../components/common/AnimatedButton';
import { AetherLogo } from '../../components/icons/Icons';

const WelcomeScreen = ({ onLogin, onSignup }: { onLogin: () => void; onSignup: () => void }) => {
    const { colors } = useTheme();
    return (
        <Layout style={{ paddingHorizontal: 20 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}>
                {/* Decorative Elements */}
                <View style={{ position: 'absolute', top: 20, right: 30, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '15' }} />
                <View style={{ position: 'absolute', top: 80, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '10' }} />

                {/* Logo & Main Title */}
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ marginBottom: 20 }}>
                        <AetherLogo size={90} />
                    </View>
                    <Text style={{ fontSize: 32, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 }}>Welcome to Aether</Text>
                    <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center', marginTop: 12, lineHeight: 22, paddingHorizontal: 20 }}>
                        Your Distinguished Companion for Automated Trading Excellence
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={{ paddingBottom: 40, gap: 12 }}>
                <AnimatedButton onPress={onSignup}>
                    <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>Begin Your Ascent</Text>
                        <Text style={{ fontSize: 11, color: colors.grayDark, marginTop: 2 }}>Join in 60 seconds flat</Text>
                    </LinearGradient>
                </AnimatedButton>
                <TouchableOpacity onPress={onLogin} style={{ paddingVertical: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: colors.gray }}>Already enlightened? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Sign In</Text></Text>
                </TouchableOpacity>
            </View>
        </Layout>
    );
};

export default WelcomeScreen;
