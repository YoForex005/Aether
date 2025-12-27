import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';
import { AetherLogo } from '../../components/icons/Icons';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const { colors } = useTheme();
    const logoScale = useRef(new Animated.Value(0.5)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 50 }),
            Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
        setTimeout(onComplete, 2000);
    }, []);

    return (
        <Layout style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity }}>
                <AetherLogo size={100} />
            </Animated.View>
            <Animated.Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 20, letterSpacing: 6, opacity: logoOpacity }}>AETHER</Animated.Text>
            <Animated.Text style={{ fontSize: 12, color: colors.gray, marginTop: 8, opacity: logoOpacity }}>Trading Intelligence</Animated.Text>
        </Layout>
    );
};

export default SplashScreen;

