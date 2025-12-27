import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import { BackIcon, ConstructionIcon } from '../components/Icons';

const PlaceholderScreen = ({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) => {
    const { colors, isDark } = useTheme();
    return (
        <Layout style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <TouchableOpacity onPress={onBack} style={{ position: 'absolute', top: 50, left: 16 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }}>
                    <BackIcon dark={isDark} />
                </View>
            </TouchableOpacity>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center' }}>
                <ConstructionIcon size={40} color={colors.lavender} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginTop: 24 }}>{title}</Text>
            <Text style={{ fontSize: 14, color: colors.gray, marginTop: 8, textAlign: 'center' }}>{subtitle}</Text>
            <AnimatedButton style={{ marginTop: 32, width: '100%' }} onPress={onBack}>
                <View style={{ backgroundColor: colors.lavender, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.black }}>Go Back</Text>
                </View>
            </AnimatedButton>
        </Layout>
    );
};

export default PlaceholderScreen;
