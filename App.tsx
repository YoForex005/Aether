import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Animated,
  StatusBar, Dimensions, Platform, KeyboardAvoidingView, useColorScheme
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

// ============ CONSTANTS ============
const SCREEN_WIDTH = 390;
const { width: DEVICE_WIDTH } = Dimensions.get('window');

// Theme type
type ThemeMode = 'system' | 'light' | 'dark';

// Light theme colors
const lightColors = {
  background: '#f5f3ff',
  cardDark: '#ffffff',
  cardLight: '#f8f8fc',
  lavender: '#b8a9f4',
  lavenderLight: '#d4c9f9',
  lavenderBg: '#f5f3ff',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  grayLight: '#9ca3af',
  grayDark: '#4b5563',
  green: '#059669',
  red: '#DC2626',
  // Theme-specific
  textPrimary: '#000000',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  cardBorder: 'rgba(0,0,0,0.06)',
  isDark: false,
};

// Dark theme colors
const darkColors = {
  background: '#0f0f13',
  cardDark: '#1a1a22',
  cardLight: '#25252f',
  lavender: '#b8a9f4',
  lavenderLight: '#d4c9f9',
  lavenderBg: '#1a1a22',
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  grayLight: '#9ca3af',
  grayDark: '#4b5563',
  green: '#10B981',
  red: '#f4a9b8',
  // Theme-specific
  textPrimary: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  border: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.06)',
  isDark: true,
};

// Default colors (for backward compatibility)
const colors = darkColors;

// Theme Context
type ThemeContextType = {
  colors: typeof lightColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: darkColors,
  isDark: true,
  themeMode: 'system',
  setThemeMode: () => { },
});

const useTheme = () => useContext(ThemeContext);

type Screen = 'splash' | 'welcome' | 'login' | 'signup' | 'kycPrompt' | 'kycForm' | 'kycPending' | 'wallet' | 'cardDesign' | 'transactions' | 'deposit' | 'withdraw' | 'mt5Account' | 'trades' | 'home' | 'transfer' | 'plans' | 'settings' | 'personalData';

// ============ REUSABLE LAYOUT COMPONENT ============
const Layout = ({ children, dark = true, style = {} }: { children: React.ReactNode; dark?: boolean; style?: any }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? colors.background : colors.white }}>
      <View style={{ flex: 1, maxWidth: SCREEN_WIDTH, alignSelf: 'center', width: '100%', ...style }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        {children}
      </View>
    </View>
  );
};

// ============ ICONS ============
const AetherLogo = ({ size = 60 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Defs>
      <SvgLinearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={colors.lavender} />
        <Stop offset="1" stopColor={colors.lavenderLight} />
      </SvgLinearGradient>
    </Defs>
    <Circle cx="30" cy="30" r="28" stroke="url(#logoGrad)" strokeWidth="2" fill="none" />
    <Path d="M30 12 L42 42 L30 36 L18 42 Z" fill="url(#logoGrad)" />
    <Circle cx="30" cy="24" r="4" fill={colors.white} />
  </Svg>
);

const BackIcon = ({ dark = false }: { dark?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={dark ? colors.white : colors.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BellIcon = ({ dark = true }: { dark?: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={dark ? colors.grayLight : colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MenuIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16M4 12h16M4 18h16" stroke={colors.grayLight} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ChatIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmailIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.gray} strokeWidth="1.5" />
    <Path d="M22 6l-10 7L2 6" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const LockIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={colors.gray} strokeWidth="1.5" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const UserIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={colors.gray} strokeWidth="1.5" />
    <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

const ShieldIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={colors.lavender + '33'} stroke={colors.lavender} strokeWidth="1.5" />
    <Path d="M9 12l2 2 4-4" stroke={colors.lavender} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DepositIcon = ({ color = colors.white }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WithdrawIcon = ({ color = colors.white }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 20V8m0 0l4 4m-4-4l-4 4M4 4h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);



const HomeNavIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={active ? colors.black : colors.gray} strokeWidth="1.5" fill={active ? colors.black : 'none'} />
  </Svg>
);

const TransferNavIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WalletNavIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="14" rx="2" stroke={active ? colors.black : colors.gray} strokeWidth="1.5" fill={active ? colors.white : 'none'} />
    <Path d="M16 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0" fill={active ? colors.black : colors.gray} />
  </Svg>
);

const ChartNavIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18h18M7 14l4-4 4 4 5-6" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsNavIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={colors.gray} strokeWidth="1.5" />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const AppleIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={colors.white}>
    <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.98-.45-2.05-.48-3 0-.98.48-1.95.55-2.92.4-1.9-1.35-3.48-5.32-1.4-8.9 1.02-1.78 2.85-2.9 4.88-2.9 1.15.02 2.2.8 2.9.8.65 0 1.95-.82 3.28-.75 1.35.1 2.38.7 3.02 1.65-2.65 1.65-2.2 5.55.5 6.65-.55 1.45-1.35 2.85-2.18 4.05-.9 1.32-1.58 2.3-2 1.6zM15.5 6.05c.5-3.05-2.58-5.55-5.35-5.55-.28 3.2 2.7 5.75 5.35 5.55z" />
  </Svg>
);

const AmazonIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={colors.white}>
    <Path d="M15.5 13.5c0 .7-.5 1.3-1.2 1.3H9.7c-.7 0-1.2-.6-1.2-1.3v-1c0-.7.5-1.3 1.2-1.3h4.6c.7 0 1.2.6 1.2 1.3v1zm3-3c0 .7-.5 1.3-1.2 1.3h-4.6c-.7 0-1.2-.6-1.2-1.3v-1c0-.7.5-1.3 1.2-1.3h4.6c.7 0 1.2.6 1.2 1.3v1zm-6-4c0 .7-.5 1.3-1.2 1.3H6.7c-.7 0-1.2-.6-1.2-1.3v-1c0-.7.5-1.3 1.2-1.3h4.6c.7 0 1.2.6 1.2 1.3v1z" />
    <Path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z" fillOpacity={0} stroke={colors.white} strokeWidth={1.5} />
  </Svg>
);

const BitcoinBIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={colors.white}>
    <Path d="M16.5 11.5c.5-.5.8-1.2.8-2 0-1.5-1.2-2.8-2.8-2.9V5h-2v1.5h-1V5h-2v1.5H7v2h1.5c.3 0 .5.2.5.5v7c0 .3-.2.5-.5.5H7v2h2.5V20h2v-1.5h1V20h2v-1.6c1.6 0 3-1.4 3-3 0-1.3-.8-2.4-2-2.9zM12 8.5h2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-2v-3zm2.5 7h-2.5v-3h2.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z" />
  </Svg>
);

const UserAvatarIcon = ({ color }: { color: string }) => (
  <Svg width={44} height={44} viewBox="0 0 44 44">
    <Circle cx="22" cy="22" r="22" fill={colors.cardLight} stroke={colors.background} strokeWidth="2" />
    <Circle cx="22" cy="18" r="8" fill={color} />
    <Path d="M10 36c0-6.6 5.4-12 12-12s12 5.4 12 12" fill={color} fillOpacity={0.5} />
  </Svg>
);



const MT5Icon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill={colors.lavender} fillOpacity={0.2} stroke={colors.lavender} strokeWidth={1.5} />
    <Path d="M7 8h10M7 12h8M7 16h6" stroke={colors.white} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

const SignalIcon = ({ color = colors.white, size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M2 20h20v-20h-20v20zm2-18h16v16h-16v-16z" fillOpacity={0} />
    <Path d="M12 4v16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M6 10v10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M18 14v6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const ConstructionIcon = ({ color = colors.white, size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 2.61L1.67 17.52h20.66l-8.62-14.91h0z" />
    <Path d="M12 8v4" />
    <Path d="M12 16h.01" />
  </Svg>
);

// Theme toggle icons
const SunIcon = ({ size = 22, color = colors.lavender }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="5" />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </Svg>
);

const MoonIcon = ({ size = 22, color = colors.lavender }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

// ============ ANIMATED BUTTON ============
const AnimatedButton = ({ children, onPress, style, disabled = false }: any) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View style={[style, { transform: [{ scale }], opacity: disabled ? 0.5 : 1 }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
};

// ============ SPLASH SCREEN ============
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

// ============ WELCOME SCREEN ============
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

// ============ LOGIN SCREEN ============
const LoginScreen = ({ onBack, onLogin, onSignup }: { onBack: () => void; onLogin: () => void; onSignup: () => void }) => {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { Alert.alert('Ahem', 'We require both email and password.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1000);
  };

  return (
    <Layout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }} onPress={onBack}>
          <BackIcon dark={isDark} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <AetherLogo size={60} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16 }}>Welcome Back</Text>
            <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center', marginTop: 8 }}>
              Sign in to access your trading dashboard
            </Text>
          </View>

          {/* Security Badge */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ShieldIcon size={16} />
              <Text style={{ fontSize: 12, color: colors.grayLight }}>256-bit SSL Encrypted</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
              <EmailIcon />
              <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Email address" placeholderTextColor={colors.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
              <LockIcon />
              <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Password" placeholderTextColor={colors.gray} value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => Alert.alert('Reset Password', 'Password reset link sent to your email!')}>
              <Text style={{ fontSize: 13, color: colors.lavender }}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <AnimatedButton onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>{loading ? 'Signing In...' : 'Sign In'}</Text>
              </LinearGradient>
            </AnimatedButton>
          </View>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
            <Text style={{ fontSize: 12, color: colors.gray }}>or continue with</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
          </View>

          {/* Social Login */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Google', 'Connecting...'); setTimeout(onLogin, 1000); }}>
              <GoogleIcon />
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Apple', 'Connecting...'); setTimeout(onLogin, 1000); }}>
              <AppleIcon size={18} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.lavender }}>50K+</Text>
              <Text style={{ fontSize: 10, color: colors.gray }}>Active Users</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: colors.cardLight }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.lavender }}>99.9%</Text>
              <Text style={{ fontSize: 10, color: colors.gray }}>Uptime</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: colors.cardLight }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>24/7</Text>
              <Text style={{ fontSize: 10, color: colors.gray }}>Support</Text>
            </View>
          </View>

          {/* Signup Link */}
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={onSignup}>
            <Text style={{ fontSize: 14, color: colors.gray }}>Don't have an account? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Create one</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};


// ============ SIGNUP SCREEN ============
const SignupScreen = ({ onBack, onSignup, onLogin }: { onBack: () => void; onSignup: () => void; onLogin: () => void }) => {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password) { Alert.alert('Incomplete', 'All fields are required.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSignup(); }, 1000);
  };

  return (
    <Layout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }} onPress={onBack}>
          <BackIcon dark={isDark} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <AetherLogo size={60} />
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16 }}>Join Aether</Text>
            <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center', marginTop: 8 }}>
              Start your trading journey in under 60 seconds
            </Text>
          </View>

          {/* Benefit Badges */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ShieldIcon size={14} />
              <Text style={{ fontSize: 11, color: colors.grayLight }}>Secure</Text>
            </View>
            <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <SignalIcon size={14} color={colors.green} />
              <Text style={{ fontSize: 11, color: colors.grayLight }}>Free</Text>
            </View>
            <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <ChartNavIcon />
              <Text style={{ fontSize: 11, color: colors.grayLight }}>24/7 Trading</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
              <UserIcon />
              <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Full name" placeholderTextColor={colors.gray} value={name} onChangeText={setName} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
              <EmailIcon />
              <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Email address" placeholderTextColor={colors.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
              <LockIcon />
              <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Create password" placeholderTextColor={colors.gray} value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            {/* Create Account Button */}
            <AnimatedButton onPress={handleSignup} disabled={loading}>
              <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
              </LinearGradient>
            </AnimatedButton>
          </View>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
            <Text style={{ fontSize: 12, color: colors.gray }}>or continue with</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
          </View>

          {/* Social Sign-up */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Google', 'Connecting...'); setTimeout(onSignup, 1000); }}>
              <GoogleIcon />
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Apple', 'Connecting...'); setTimeout(onSignup, 1000); }}>
              <AppleIcon size={18} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Social Proof */}
          <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.lavender }}>50K+</Text>
                <Text style={{ fontSize: 10, color: colors.gray }}>Traders</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.lavender }}>$12M+</Text>
                <Text style={{ fontSize: 10, color: colors.gray }}>Paid Out</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>4.9/5</Text>
                <Text style={{ fontSize: 10, color: colors.gray }}>Rating</Text>
              </View>
            </View>
          </View>

          {/* Terms */}
          <Text style={{ fontSize: 11, color: colors.gray, textAlign: 'center', lineHeight: 16 }}>
            By creating an account, you agree to our{' '}
            <Text style={{ color: colors.lavender }}>Terms of Service</Text> and{' '}
            <Text style={{ color: colors.lavender }}>Privacy Policy</Text>
          </Text>

          {/* Login Link */}
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={onLogin}>
            <Text style={{ fontSize: 14, color: colors.gray }}>Already a member? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};


// ============ HOME/DASHBOARD SCREEN ============
const HomeScreen = ({ kycStatus, onNavigate }: { kycStatus: string; onNavigate: (s: Screen) => void }) => {
  const { colors } = useTheme();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const isLocked = kycStatus !== 'approved';

  // Updated Data: Investment Plans with generic tier names
  const investmentPlans = [
    { name: 'STARTER', return: '5%', deposit: '$1,000', color: colors.cardDark, label: 'Tier 1' },
    { name: 'GROWTH', return: '7%', deposit: '$2,500', color: colors.lavender, label: 'Tier 2' },
    { name: 'PRO', return: '8.5%', deposit: '$5,000', color: colors.lavender, label: 'Tier 3' },
    { name: 'ELITE', return: '12%', deposit: '$10,000', color: colors.green, label: 'Tier 4' },
  ];

  const transactions = [
    { icon: <DepositIcon color={colors.green} />, name: 'Growth Plan', desc: 'Monthly Payout Received', amount: '+$175.00', isPositive: true },
    { icon: <DepositIcon color={colors.white} />, name: 'Deposit', desc: 'USDT (TRC20)', amount: '+$2,500.00', isPositive: true },
    { icon: <WithdrawIcon color={colors.red} />, name: 'Withdrawal', desc: 'Pending Processing', amount: '-$500.00', isPositive: false },
  ];

  const avatarColors = [colors.lavender, colors.lavenderLight, colors.green, colors.red, colors.white];

  return (
    <Layout>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => onNavigate('settings')} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.cardLight, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          <UserAvatarIcon color={colors.lavender} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }}>
            <BellIcon dark />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }}>
            <ChatIcon />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

        {/* KYC Warning (Restored) */}
        {isLocked && (
          <TouchableOpacity style={{ marginHorizontal: 16, marginTop: 4, marginBottom: 12, borderRadius: 14, overflow: 'hidden' }} onPress={() => onNavigate('kycForm')} activeOpacity={0.9}>
            <LinearGradient colors={['#2a2a3a', '#1a1a2a']} style={{ padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lavender + '33', borderRadius: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldIcon size={20} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.white }}>Verify Identity</Text>
                <Text style={{ fontSize: 11, color: colors.grayLight }}>Required for withdrawals</Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.lavender }}>Verify →</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Main Balance Card */}
        <View style={{ marginHorizontal: 16, marginTop: isLocked ? 0 : 8, marginBottom: 16 }}>
          <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
            {/* Card Icons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <AetherLogo size={20} />
              </View>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <SignalIcon size={16} color={colors.black} />
              </View>
            </View>
            {/* Balance */}
            <Text style={{ fontSize: 13, color: colors.grayDark, marginBottom: 4 }}>Total Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              <Text style={{ fontSize: 38, fontWeight: '700', color: colors.black }}>{balanceVisible ? '6886.08 €' : '••••••'}</Text>
            </TouchableOpacity>
            {/* Decorative Shape */}
            <View style={{ position: 'absolute', bottom: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <View style={{ position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          </LinearGradient>
        </View>

        {/* Investment Plans (Was Crypto Cards) */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.white, marginHorizontal: 16, marginBottom: 12 }}>Investment Plans</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} style={{ marginBottom: 20 }}>
          {investmentPlans.map((plan, idx) => (
            <TouchableOpacity key={idx} onPress={() => onNavigate('plans')} activeOpacity={0.8}>
              <View style={{ width: 140, backgroundColor: plan.color, borderRadius: 20, padding: 16, minHeight: 130 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: plan.color === colors.cardDark ? colors.textPrimary : colors.black, opacity: 0.8 }}>{plan.label}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: plan.color === colors.cardDark ? colors.green : colors.black }}>+{plan.return}</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: plan.color === colors.cardDark ? colors.textPrimary : colors.black, marginBottom: 4 }}>{plan.deposit}</Text>
                <Text style={{ fontSize: 11, color: plan.color === colors.cardDark ? colors.gray : 'rgba(0,0,0,0.6)' }}>Monthly Return</Text>
                <View style={{ marginTop: 'auto', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: plan.color === colors.cardDark ? colors.textPrimary : colors.black }}>{plan.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* MT5 Account Card (Glassmorphism Pro) */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.white, marginHorizontal: 16, marginBottom: 12 }}>Trading Account</Text>
        <TouchableOpacity style={{ marginHorizontal: 16, marginBottom: 20 }} onPress={() => onNavigate('mt5Account')} activeOpacity={0.9}>
          <View style={{ backgroundColor: 'rgba(30, 30, 45, 0.7)', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <LinearGradient colors={['#2a2a3a', '#1a1a2a']} style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <MT5Icon size={22} />
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.white }}>MT5 Live Account</Text>
                <Text style={{ fontSize: 12, color: colors.gray }}>FlexyMarketsServer</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(76, 175, 80, 0.2)' }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>Active</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 16, padding: 14, alignItems: 'center' }}>
              <View style={{ alignItems: 'center', flex: 1, borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.06)' }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Account</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>50012847</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 2 }}>Equity</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.green }}>$12,450</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Active Trades (Glassmorphism Pro) */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.white }}>Active Positions</Text>
            <TouchableOpacity onPress={() => onNavigate('trades')}>
              <Text style={{ fontSize: 13, color: colors.lavender }}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 10 }}>
            <View style={{ backgroundColor: 'rgba(30, 30, 45, 0.65)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, marginRight: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.green }}>BUY</Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.white }}>XAU/USD</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.green }}>+$245.80</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: colors.gray }}>0.5 Lots • Entry: 2024.50</Text>
                <Text style={{ fontSize: 12, color: colors.grayLight }}>Current: 2029.42</Text>
              </View>
            </View>
            {/* Second Trade */}
            <View style={{ backgroundColor: 'rgba(30, 30, 45, 0.65)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, marginRight: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.red }}>SELL</Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.white }}>EUR/USD</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.red }}>-$32.40</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: colors.gray }}>0.2 Lots • Entry: 1.0892</Text>
                <Text style={{ fontSize: 12, color: colors.grayLight }}>Current: 1.0908</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transactions (Modernized Pro) */}
        <View style={{ marginHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 14 }}>Today</Text>
          <View style={{ gap: 10 }}>
            {transactions.map((tx, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(30, 30, 45, 0.5)', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                  {tx.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 2 }}>{tx.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.gray }}>{tx.desc}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: tx.isPositive ? colors.green : colors.white }}>{tx.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />

        {/* Construction Icon (Moved to bottom or removed if not needed, but keeping for now) */}
        {/* Removed redundant ConstructionIcon usage here since it was just for specific screen */}

      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 80, backgroundColor: 'rgba(20, 20, 30, 0.95)', paddingHorizontal: 10, paddingBottom: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 60, height: 60, marginTop: -20 }}><LinearGradient colors={[colors.lavender, '#6C63FF']} style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: colors.lavender, shadowOpacity: 0.4, shadowRadius: 10 }}><HomeNavIcon active /></LinearGradient></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ PLACEHOLDER SCREEN ============
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

// ============ DEPOSIT SCREEN ============
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
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 12 }}>Select Network</Text>
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
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Deposit Amount</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>${amount || '0.00'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: colors.gray }}>Network Fee</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>${selectedNetworkData?.fee}</Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.grayLight + '33', paddingTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.black }}>Total</Text>
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
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ KYC FORM SCREEN ============
const KYCFormScreen = ({ kycLevel, onSubmit, onBack, onNavigate }: { kycLevel: number; onSubmit: () => void; onBack: () => void; onNavigate: (s: Screen) => void }) => {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [poiUploaded, setPoiUploaded] = useState(false);
  const [poaUploaded, setPoaUploaded] = useState(false);

  const isLevel2 = kycLevel >= 1;

  const handleSubmit = () => {
    if (isLevel2) {
      if (!poiUploaded || !poaUploaded) { Alert.alert('Documents Required', 'Please upload both POI and POA documents.'); return; }
    } else {
      if (!name || !dob || !country) { Alert.alert('Incomplete', 'Please fill all fields.'); return; }
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(); }, 1500);
  };

  const handleUploadPOI = () => {
    Alert.alert('Upload POI', 'Select your ID document (Passport, Driver License, National ID)', [
      { text: 'Cancel' },
      { text: 'Upload', onPress: () => setPoiUploaded(true) }
    ]);
  };

  const handleUploadPOA = () => {
    Alert.alert('Upload POA', 'Select proof of address (Utility Bill, Bank Statement)', [
      { text: 'Cancel' },
      { text: 'Upload', onPress: () => setPoaUploaded(true) }
    ]);
  };

  return (
    <Layout>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }} onPress={onBack}>
          <BackIcon dark />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.white, marginLeft: 16 }}>
          {isLevel2 ? 'Level 2 Verification' : 'Level 1 Verification'}
        </Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {/* Level Indicator */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ backgroundColor: isLevel2 ? colors.green : colors.lavender, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: isLevel2 ? colors.white : colors.black }}>{isLevel2 ? 'LEVEL 2' : 'LEVEL 1'}</Text>
            </View>
            <View style={{ flex: 1, height: 4, backgroundColor: colors.cardLight, borderRadius: 2, marginLeft: 12, overflow: 'hidden' }}>
              <View style={{ width: isLevel2 ? '100%' : '50%', height: 4, backgroundColor: isLevel2 ? colors.green : colors.lavender, borderRadius: 2 }} />
            </View>
          </View>

          {isLevel2 ? (
            <>
              {/* Level 2 Content - Document Upload */}
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 8 }}>Document Verification</Text>
              <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>Upload documents to enable withdrawals</Text>

              {/* Benefits Card */}
              <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 24 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.green, marginBottom: 12 }}>Level 2 Benefits</Text>
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 10, color: colors.green }}>1</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.white }}>Withdraw funds to crypto wallet</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 10, color: colors.green }}>2</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.white }}>Higher withdrawal limits</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 10, color: colors.green }}>3</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.white }}>Priority support access</Text>
                  </View>
                </View>
              </View>

              {/* POI Upload */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>Proof of Identity (POI)</Text>
                <TouchableOpacity
                  style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: poiUploaded ? colors.green : colors.cardLight }}
                  onPress={handleUploadPOI}
                >
                  {poiUploaded ? (
                    <View style={{ alignItems: 'center' }}>
                      <ShieldIcon size={28} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.green, marginTop: 8 }}>Document Uploaded</Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <DepositIcon color={colors.lavender} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white, marginTop: 8 }}>Upload ID Document</Text>
                      <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>Passport, Driver License, or National ID</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* POA Upload */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>Proof of Address (POA)</Text>
                <TouchableOpacity
                  style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: poaUploaded ? colors.green : colors.cardLight }}
                  onPress={handleUploadPOA}
                >
                  {poaUploaded ? (
                    <View style={{ alignItems: 'center' }}>
                      <ShieldIcon size={28} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.green, marginTop: 8 }}>Document Uploaded</Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <DepositIcon color={colors.lavender} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white, marginTop: 8 }}>Upload Address Proof</Text>
                      <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>Utility Bill or Bank Statement (within 3 months)</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Level 1 Content - Basic Info */}
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 8 }}>Identity Verification</Text>
              <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>Complete Level 1 to enable deposits</Text>

              {/* Benefits Card */}
              <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 24 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.lavender, marginBottom: 12 }}>Level 1 Benefits</Text>
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 10, color: colors.green }}>1</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.white }}>Deposit funds via crypto</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 10, color: colors.green }}>2</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.white }}>View investment plans</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 10, color: colors.green }}>3</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: colors.white }}>Subscribe to trading plans</Text>
                  </View>
                </View>
                <View style={{ borderTopWidth: 1, borderTopColor: colors.cardLight, marginTop: 14, paddingTop: 12 }}>
                  <Text style={{ fontSize: 11, color: colors.gray }}>Level 2 required for withdrawals</Text>
                </View>
              </View>

              {/* Form Fields */}
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>Full Legal Name</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12 }}>
                    <UserIcon />
                    <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.white }} placeholder="As on ID document" placeholderTextColor={colors.gray} value={name} onChangeText={setName} />
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>Date of Birth</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16 }}>
                    <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.white }} placeholder="DD/MM/YYYY" placeholderTextColor={colors.gray} value={dob} onChangeText={setDob} keyboardType="numeric" />
                  </View>
                </View>

                <View>
                  <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>Country of Residence</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16 }}>
                    <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.white }} placeholder="Select your country" placeholderTextColor={colors.gray} value={country} onChangeText={setCountry} />
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Submit Button */}
          <AnimatedButton onPress={handleSubmit} disabled={loading}>
            <View style={{ backgroundColor: colors.lavender, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>{loading ? 'Verifying...' : isLevel2 ? 'Complete Level 2' : 'Complete Level 1'}</Text>
            </View>
          </AnimatedButton>

          {/* Info Notice */}
          <View style={{ backgroundColor: colors.cardDark, borderRadius: 12, padding: 14, marginTop: 16 }}>
            <Text style={{ fontSize: 11, color: colors.gray, lineHeight: 16 }}>Your information is encrypted and securely stored. Verification typically takes 1-2 minutes.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.cardDark, paddingHorizontal: 8, paddingBottom: 8 }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ WALLET SCREEN ============
const WalletScreen = ({ kycLevel, onNavigate }: { kycLevel: number; onNavigate: (s: Screen) => void }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals'>('deposits');

  // Sample data - would come from backend
  const balance = 6886.08;
  const walletAddress = 'TRx8f7K2mN3pQ9vL1wE5hJ6cD4bA0tY2sF';

  const depositHistory = [
    { id: 1, amount: 2500.00, network: 'USDT (TRC20)', status: 'Completed', date: '2024-01-15' },
    { id: 2, amount: 1000.00, network: 'USDT (TRC20)', status: 'Completed', date: '2024-01-10' },
    { id: 3, amount: 500.00, network: 'BTC', status: 'Completed', date: '2024-01-05' },
  ];
  const withdrawalHistory = [
    { id: 1, amount: 500.00, network: 'USDT (TRC20)', status: 'Processing', date: '2024-01-18' },
    { id: 2, amount: 350.00, network: 'USDT (TRC20)', status: 'Completed', date: '2024-01-08' },
  ];

  // Calculate stats
  const totalDeposits = depositHistory.reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = withdrawalHistory.reduce((sum, tx) => sum + tx.amount, 0);
  const pendingCount = withdrawalHistory.filter(tx => tx.status === 'Processing').length;
  const completedDeposits = depositHistory.filter(tx => tx.status === 'Completed').length;

  const canDeposit = kycLevel >= 1;
  const canWithdraw = kycLevel >= 2;

  const handleDeposit = () => {
    if (!canDeposit) {
      Alert.alert('KYC Required', 'Level 1 verification is required to deposit funds.', [
        { text: 'Cancel' },
        { text: 'Verify Now', onPress: () => onNavigate('kycForm') }
      ]);
      return;
    }
    onNavigate('deposit');
  };

  const handleWithdraw = () => {
    if (!canWithdraw) {
      Alert.alert('KYC Level 2 Required', 'Complete Level 2 verification to withdraw funds.', [
        { text: 'Cancel' },
        { text: 'Upgrade KYC', onPress: () => onNavigate('kycForm') }
      ]);
      return;
    }
    onNavigate('withdraw');
  };

  const copyAddress = () => {
    Alert.alert('Address Copied', 'Wallet address copied to clipboard');
  };

  // Stat Card Component
  const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <View style={{ flex: 1, backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
      <Text style={{ fontSize: 11, color: colors.gray }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: color, marginTop: 4 }}>{value}</Text>
    </View>
  );

  // Transaction Item Component
  const TransactionItem = ({ amount, network, status, date, isWithdrawal }: { amount: number; network: string; status: string; date: string; isWithdrawal?: boolean }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isWithdrawal ? colors.red + '15' : colors.green + '15', alignItems: 'center', justifyContent: 'center' }}>
        {isWithdrawal ? <WithdrawIcon color={colors.red} /> : <DepositIcon color={colors.green} />}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{network}</Text>
        <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>{date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: isWithdrawal ? colors.red : colors.green }}>{isWithdrawal ? '-' : '+'}${amount.toFixed(2)}</Text>
        <Text style={{ fontSize: 11, color: status === 'Completed' ? colors.green : colors.lavender, marginTop: 2 }}>{status}</Text>
      </View>
    </View>
  );

  return (
    <Layout>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary }}>Wallet</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {kycLevel < 2 && (
            <TouchableOpacity onPress={() => onNavigate('kycForm')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lavender + '15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
              <ShieldIcon size={14} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: colors.lavender, marginLeft: 4 }}>KYC L{kycLevel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Balance Card - Dark Theme for Better Contrast */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <LinearGradient colors={[colors.cardDark, '#1a1a2e']} style={{ borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
            {/* Decorative */}
            <View style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lavender + '15' }} />
            <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '10' }} />

            {/* Card Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <WalletNavIcon active />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>Wallet</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveTab(activeTab === 'deposits' ? 'withdrawals' : 'deposits')} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                <SettingsNavIcon />
              </TouchableOpacity>
            </View>

            {/* Balance */}
            <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>AVAILABLE BALANCE</Text>
            <Text style={{ fontSize: 42, fontWeight: '700', color: colors.white, marginTop: 4 }}>${balance.toFixed(2)}</Text>

            {/* Monthly Stats */}
            <View style={{ flexDirection: 'row', marginTop: 20, gap: 20 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                <Text style={{ fontSize: 11, color: colors.gray }}>This Month</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.green }}>+$2,500.00</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                <Text style={{ fontSize: 11, color: colors.gray }}>Pending</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.lavender }}>$500.00</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.lavender, borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: canDeposit ? 1 : 0.6 }}
                onPress={handleDeposit}
              >
                <DepositIcon color={colors.black} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', opacity: canWithdraw ? 1 : 0.5 }}
                onPress={handleWithdraw}
              >
                <WithdrawIcon color={colors.white} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.white }}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, gap: 10 }}>
          <StatCard label="Total Deposits" value={`$${totalDeposits.toFixed(0)}`} color={colors.green} />
          <StatCard label="Withdrawn" value={`$${totalWithdrawals.toFixed(0)}`} color={colors.red} />
          <StatCard label="Pending" value={pendingCount.toString()} color={colors.lavender} />
        </View>

        {/* Payment Gateway Info */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green + '15', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldIcon size={20} />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>Secure Payment Gateway</Text>
                <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Instant crypto processing</Text>
              </View>
            </View>
            <View style={{ backgroundColor: colors.lavenderBg, borderRadius: 10, padding: 12 }}>
              <Text style={{ fontSize: 12, color: colors.grayDark, lineHeight: 18 }}>Deposits and withdrawals are processed securely through our integrated payment gateway. No manual transfers required.</Text>
            </View>
          </View>
        </View>

        {/* KYC Notice */}
        {kycLevel < 2 && (
          <TouchableOpacity
            style={{ marginHorizontal: 16, marginBottom: 20, backgroundColor: colors.white, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lavender + '33' }}
            onPress={() => onNavigate('kycForm')}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldIcon size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>
                {kycLevel === 0 ? 'Complete KYC Level 1' : 'Upgrade to KYC Level 2'}
              </Text>
              <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>
                {kycLevel === 0 ? 'Required for deposits' : 'Required for withdrawals'}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.lavender, fontWeight: '600' }}>Verify</Text>
          </TouchableOpacity>
        )}

        {/* Crypto Networks Info */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 12 }}>Supported Networks</Text>
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.green + '15', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.green }}>T</Text>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>USDT (TRC20)</Text>
                <Text style={{ fontSize: 11, color: colors.gray }}>Recommended - Low fees</Text>
              </View>
              <View style={{ backgroundColor: colors.green + '15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: '600', color: colors.green }}>Primary</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.lavender }}>E</Text>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>USDT (ERC20)</Text>
                <Text style={{ fontSize: 11, color: colors.gray }}>Ethereum network</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F7931A22', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#F7931A' }}>B</Text>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>BTC</Text>
                <Text style={{ fontSize: 11, color: colors.gray }}>Bitcoin network</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction History Tabs */}
        <View style={{ marginHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', backgroundColor: colors.grayLight + '22', borderRadius: 12, padding: 4, marginBottom: 16 }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === 'deposits' ? colors.white : 'transparent', alignItems: 'center' }}
              onPress={() => setActiveTab('deposits')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'deposits' ? colors.black : colors.gray }}>Deposits</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: activeTab === 'withdrawals' ? colors.white : 'transparent', alignItems: 'center' }}
              onPress={() => setActiveTab('withdrawals')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'withdrawals' ? colors.black : colors.gray }}>Withdrawals</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          {activeTab === 'deposits' ? (
            depositHistory.length > 0 ? (
              depositHistory.map((tx) => (
                <TransactionItem key={tx.id} amount={tx.amount} network={tx.network} status={tx.status} date={tx.date} />
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 14, color: colors.gray }}>No deposit history</Text>
              </View>
            )
          ) : (
            withdrawalHistory.length > 0 ? (
              withdrawalHistory.map((tx) => (
                <TransactionItem key={tx.id} amount={tx.amount} network={tx.network} status={tx.status} date={tx.date} isWithdrawal />
              ))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ fontSize: 14, color: colors.gray }}>No withdrawal history</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><WalletNavIcon active /></View></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};
// ============ TRADING HISTORY SCREEN ============
const TransferScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Sample ongoing trades data
  const activeTrades = [
    { id: 1, plan: 'GROWTH', amount: 2500, startDate: '2024-01-10', daysLeft: 22, profit: 175.00, roi: 7.0 },
    { id: 2, plan: 'PRO', amount: 5000, startDate: '2024-01-05', daysLeft: 17, profit: 425.00, roi: 8.5 },
  ];

  // Sample trade history data
  const tradeHistory = [
    { id: 1, plan: 'STARTER', amount: 1000, startDate: '2023-12-01', endDate: '2023-12-31', profit: 50.00, status: 'Completed' },
    { id: 2, plan: 'GROWTH', amount: 2500, startDate: '2023-11-15', endDate: '2023-12-15', profit: 175.00, status: 'Completed' },
    { id: 3, plan: 'ELITE', amount: 10000, startDate: '2023-10-01', endDate: '2023-10-31', profit: 1200.00, status: 'Completed' },
  ];

  const totalActiveAmount = activeTrades.reduce((sum, t) => sum + t.amount, 0);
  const totalActiveProfit = activeTrades.reduce((sum, t) => sum + t.profit, 0);
  const avgROI = activeTrades.length > 0 ? activeTrades.reduce((sum, t) => sum + t.roi, 0) / activeTrades.length : 0;

  // Trade Card Component
  const ActiveTradeCard = ({ trade }: { trade: typeof activeTrades[0] }) => (
    <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}>
            <ChartNavIcon />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{trade.plan} Plan</Text>
            <Text style={{ fontSize: 11, color: colors.gray }}>Started {trade.startDate}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: colors.green + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>Active</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <View>
          <Text style={{ fontSize: 11, color: colors.gray }}>Invested</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>${trade.amount.toLocaleString()}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: colors.gray }}>Days Left</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.lavender }}>{trade.daysLeft}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: colors.gray }}>Earnings</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.green }}>+${trade.profit.toFixed(2)}</Text>
        </View>
      </View>
      {/* Progress Bar */}
      <View style={{ marginTop: 12 }}>
        <View style={{ height: 4, backgroundColor: colors.grayLight + '33', borderRadius: 2 }}>
          <View style={{ width: `${((30 - trade.daysLeft) / 30) * 100}%`, height: 4, backgroundColor: colors.lavender, borderRadius: 2 }} />
        </View>
        <Text style={{ fontSize: 10, color: colors.gray, marginTop: 4 }}>{Math.round(((30 - trade.daysLeft) / 30) * 100)}% complete</Text>
      </View>
    </View>
  );

  // History Card Component
  const HistoryTradeCard = ({ trade }: { trade: typeof tradeHistory[0] }) => (
    <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.grayLight + '22', alignItems: 'center', justifyContent: 'center' }}>
            <ChartNavIcon />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>{trade.plan} Plan</Text>
            <Text style={{ fontSize: 10, color: colors.gray }}>{trade.startDate} - {trade.endDate}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.green }}>+${trade.profit.toFixed(2)}</Text>
          <Text style={{ fontSize: 10, color: colors.gray }}>${trade.amount.toLocaleString()} invested</Text>
        </View>
      </View>
    </View>
  );

  // Lifetime earnings calculation
  const lifetimeEarnings = tradeHistory.reduce((sum, t) => sum + t.profit, 0) + totalActiveProfit;
  const totalCompletedTrades = tradeHistory.length;
  const winRate = 100; // All trades profitable

  return (
    <Layout>
      {/* Premium Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('home')}>
            <BackIcon dark={isDark} />
          </TouchableOpacity>
          <View style={{ marginLeft: 14 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary }}>Trading History</Text>
            <Text style={{ fontSize: 12, color: colors.gray }}>Track your performance</Text>
          </View>
        </View>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('mt5Account')}>
          <ChartNavIcon />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Main Stats Card - Dark Theme for Better Contrast */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <LinearGradient colors={[colors.cardDark, '#1a1a2e']} style={{ borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative' }}>
            {/* Decorative */}
            <View style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.lavender + '15' }} />
            <View style={{ position: 'absolute', bottom: -30, left: -30, width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '10' }} />

            {/* Main Stats Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>TOTAL INVESTED</Text>
                <Text style={{ fontSize: 36, fontWeight: '700', color: colors.white, marginTop: 6 }}>${totalActiveAmount.toLocaleString()}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13, color: colors.gray, fontWeight: '500', letterSpacing: 0.5 }}>MONTHLY PROFIT</Text>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.green, marginTop: 6 }}>+${totalActiveProfit.toFixed(2)}</Text>
              </View>
            </View>

            {/* Stats Pills */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 6, fontWeight: '500' }}>Active Plans</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.white }}>{activeTrades.length}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 6, fontWeight: '500' }}>Avg. ROI</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.lavender }}>{avgROI.toFixed(1)}%</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                <Text style={{ fontSize: 11, color: colors.gray, marginBottom: 6, fontWeight: '500' }}>Win Rate</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.green }}>{winRate}%</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Lifetime Earnings Card */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <WalletNavIcon />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Lifetime Earnings</Text>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: colors.green }}>${lifetimeEarnings.toFixed(2)}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: colors.green + '22', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>+{totalCompletedTrades + activeTrades.length} trades</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                  <ChartNavIcon />
                </View>
                <Text style={{ fontSize: 11, color: colors.gray }}>Completed</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.black }}>{totalCompletedTrades}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.green + '15', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                  <SignalIcon size={14} color={colors.green} />
                </View>
                <Text style={{ fontSize: 11, color: colors.gray }}>Active</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: colors.black }}>{activeTrades.length}</Text>
            </View>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', backgroundColor: colors.grayLight + '22', borderRadius: 12, padding: 4 }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: activeTab === 'active' ? colors.cardDark : 'transparent', alignItems: 'center' }}
              onPress={() => setActiveTab('active')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'active' ? colors.textPrimary : colors.gray }}>Active ({activeTrades.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: activeTab === 'history' ? colors.cardDark : 'transparent', alignItems: 'center' }}
              onPress={() => setActiveTab('history')}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === 'history' ? colors.textPrimary : colors.gray }}>History ({tradeHistory.length})</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={{ marginHorizontal: 16 }}>
          {activeTab === 'active' ? (
            activeTrades.length > 0 ? (
              <>
                {activeTrades.map((trade) => (
                  <ActiveTradeCard key={trade.id} trade={trade} />
                ))}
                {/* Invest More CTA */}
                <TouchableOpacity
                  style={{ borderWidth: 2, borderColor: colors.lavender, borderStyle: 'dashed', borderRadius: 16, padding: 20, alignItems: 'center', marginTop: 8 }}
                  onPress={() => onNavigate('plans')}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.lavender }}>+ Start New Investment</Text>
                  <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>Browse available plans</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <ChartNavIcon />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>No Active Investments</Text>
                <Text style={{ fontSize: 13, color: colors.gray, marginTop: 4, textAlign: 'center' }}>Start investing to see your trades here</Text>
                <TouchableOpacity style={{ marginTop: 20, backgroundColor: colors.lavender, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }} onPress={() => onNavigate('plans')}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>Browse Plans</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            tradeHistory.length > 0 ? (
              <>
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>Total earned: <Text style={{ fontWeight: '700', color: colors.green }}>${tradeHistory.reduce((sum, t) => sum + t.profit, 0).toFixed(2)}</Text></Text>
                </View>
                {tradeHistory.map((trade) => (
                  <HistoryTradeCard key={trade.id} trade={trade} />
                ))}
              </>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>No Trade History</Text>
                <Text style={{ fontSize: 13, color: colors.gray, marginTop: 4 }}>Completed trades will appear here</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><TransferNavIcon /></View></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ INVESTMENT PLANS SCREEN ============
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
          <LinearGradient colors={[colors.cardDark, '#1a1a2e']} style={{ borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative' }}>
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
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.white }}>${userBalance.toLocaleString()}</Text>
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
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 16 }}>How It Works</Text>
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <ChartNavIcon />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, color: colors.gray, marginBottom: 2 }}>Step 1</Text>
                  <Text style={{ fontSize: 13, color: colors.grayLight }}>Select a plan that fits your investment</Text>
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
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><ChartNavIcon /></View></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};


// ============ WITHDRAWAL SCREEN ============
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
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.black, marginTop: 4 }}>${availableBalance.toFixed(2)}</Text>
          </View>
        </View>

        {/* Network Selection */}
        <View style={{ marginHorizontal: 16, marginBottom: 20, opacity: isVerified ? 1 : 0.5 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 12 }}>Select Network</Text>
          {networks.map((network) => (
            <TouchableOpacity
              key={network.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.white,
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
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.black }}>{network.name}</Text>
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
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 12 }}>Withdrawal Amount</Text>
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
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
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black, marginBottom: 12 }}>Recipient Wallet Address</Text>
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
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
          <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '33' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: colors.gray }}>Withdrawal Amount</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.black }}>${amount || '0.00'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: colors.gray }}>Network Fee</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.red }}>-${selectedNetworkData?.fee}</Text>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: colors.grayLight + '33', paddingTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>You Receive</Text>
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
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ PERSONAL DATA SCREEN ============
const PersonalDataScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {
  const { colors, isDark } = useTheme();
  const [username, setUsername] = useState('aether_user');
  const [fullName, setFullName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-15');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your personal information has been saved successfully.');
    setIsEditing(false);
  };

  const InputField = ({ label, value, onChangeText, editable = true, keyboardType = 'default' as any }: { label: string; value: string; onChangeText: (text: string) => void; editable?: boolean; keyboardType?: any }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, borderWidth: 1, borderColor: isEditing ? colors.lavender + '44' : colors.grayLight + '22' }}>
        <TextInput
          style={{ padding: 16, fontSize: 15, color: colors.textPrimary }}
          value={value}
          onChangeText={onChangeText}
          editable={isEditing && editable}
          keyboardType={keyboardType}
          placeholderTextColor={colors.gray}
        />
      </View>
    </View>
  );

  return (
    <Layout>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('settings')}>
          <BackIcon dark={isDark} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>Personal Data</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.lavender }}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Profile Avatar Section */}
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.lavender + '44' }}>
            <Text style={{ fontSize: 40, fontWeight: '700', color: colors.lavender }}>{fullName.charAt(0).toUpperCase()}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={{ marginTop: 12, backgroundColor: colors.lavender + '15', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.lavender }}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Fields */}
        <View style={{ paddingHorizontal: 16 }}>
          {/* Username Field - Special styling */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Username</Text>
            <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, borderWidth: 1, borderColor: isEditing ? colors.lavender + '44' : colors.grayLight + '22', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ paddingLeft: 16, fontSize: 15, color: colors.gray }}>@</Text>
              <TextInput
                style={{ flex: 1, padding: 16, paddingLeft: 4, fontSize: 15, color: colors.textPrimary }}
                value={username}
                onChangeText={setUsername}
                editable={isEditing}
                placeholderTextColor={colors.gray}
              />
            </View>
            {isEditing && (
              <Text style={{ fontSize: 11, color: colors.gray, marginTop: 6 }}>Username must be unique and can only contain letters, numbers, and underscores</Text>
            )}
          </View>

          <InputField label="Full Name" value={fullName} onChangeText={setFullName} />
          <InputField label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <InputField label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} editable={false} />

          {/* Account Info */}
          <View style={{ backgroundColor: colors.lavender + '10', borderRadius: 14, padding: 16, marginTop: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.black, marginBottom: 8 }}>Account Information</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: colors.gray }}>Member Since</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>January 2024</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: colors.gray }}>Account ID</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>#AE-2024-0001</Text>
            </View>
          </View>

          {/* Security Notice */}
          <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, marginTop: 16, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <LockIcon size={16} />
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginLeft: 8 }}>Privacy & Security</Text>
            </View>
            <Text style={{ fontSize: 11, color: colors.gray, lineHeight: 16 }}>Your personal data is encrypted and stored securely. We never share your information with third parties.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button - Fixed at bottom when editing */}
      {isEditing && (
        <View style={{ position: 'absolute', bottom: 70, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.lavenderBg, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
          <TouchableOpacity
            style={{ backgroundColor: colors.lavender, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
            onPress={handleSave}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><SettingsNavIcon /></View></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ MT5 ACCOUNT SCREEN ============
const MT5AccountScreen = ({ kycLevel, onNavigate }: { kycLevel: number; onNavigate: (s: Screen) => void }) => {
  const { colors, isDark } = useTheme();
  const [hasAccount, setHasAccount] = useState(false); // Set to true to show account details
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [leverage, setLeverage] = useState('1:100');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isLevel2Verified = kycLevel >= 2;
  const leverageOptions = ['1:50', '1:100', '1:200', '1:500'];

  // Sample account data
  const accountData = {
    accountNumber: '50012847',
    server: 'FlexyMarketsServer',
    equity: 12450.00,
    balance: 12500.00,
    margin: 1250.00,
    freeMargin: 11200.00,
    marginLevel: '998%',
    leverage: '1:100',
    status: 'Active'
  };

  const handleCreateAccount = () => {
    if (!isLevel2Verified) {
      Alert.alert('Verification Required', 'Level 2 KYC verification is required to create an MT5 account.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Verify Now', onPress: () => onNavigate('kycForm') }
      ]);
      return;
    }

    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setHasAccount(true);
      Alert.alert('Account Created', 'Your MT5 Live Account has been created successfully. You can now start trading!');
    }, 2000);
  };

  return (
    <Layout>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }} onPress={() => onNavigate('home')}>
          <BackIcon dark={isDark} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>MT5 Account</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {!hasAccount ? (
          <>
            {/* KYC Warning if not verified */}
            {!isLevel2Verified && (
              <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
                <TouchableOpacity
                  style={{ backgroundColor: colors.red + '10', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.red + '22' }}
                  onPress={() => onNavigate('kycForm')}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.red + '22', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldIcon size={20} />
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.red }}>Level 2 Verification Required</Text>
                      <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Complete verification to create an MT5 account</Text>
                    </View>
                    <BackIcon />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Create Account Info */}
            <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
              <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 20, padding: 20, overflow: 'hidden', position: 'relative' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.black }}>Create MT5 Live Account</Text>
                <Text style={{ fontSize: 13, color: colors.grayDark, marginTop: 6 }}>Trade forex, commodities, indices, and crypto with our integrated MT5 platform.</Text>
                <View style={{ flexDirection: 'row', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, color: colors.grayDark }}>Instant Execution</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, color: colors.grayDark }}>Low Spreads</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, color: colors.grayDark }}>24/5 Trading</Text>
                  </View>
                </View>
                <View style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)' }} />
              </LinearGradient>
            </View>

            {/* Account Creation Form */}
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black, marginBottom: 16 }}>Account Settings</Text>

              {/* Password Input */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Trading Password</Text>
                <View style={{ backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.grayLight + '22', flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={{ flex: 1, padding: 16, fontSize: 15, color: colors.black }}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={colors.gray}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity style={{ paddingRight: 16 }} onPress={() => setShowPassword(!showPassword)}>
                    <Text style={{ fontSize: 12, color: colors.lavender }}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm Password</Text>
                <View style={{ backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                  <TextInput
                    style={{ padding: 16, fontSize: 15, color: colors.black }}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.gray}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>

              {/* Leverage Selection */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Select Leverage</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {leverageOptions.map((lev) => (
                    <TouchableOpacity
                      key={lev}
                      style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 12,
                        backgroundColor: leverage === lev ? colors.lavender : colors.white,
                        borderWidth: 1,
                        borderColor: leverage === lev ? colors.lavender : colors.grayLight + '22',
                        alignItems: 'center'
                      }}
                      onPress={() => setLeverage(lev)}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '600', color: leverage === lev ? colors.black : colors.grayDark }}>{lev}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={{ fontSize: 11, color: colors.gray, marginTop: 8 }}>Higher leverage increases both potential profits and risks</Text>
              </View>

              {/* Account Type Info */}
              <View style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22', marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 }}>Account Details</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Account Type</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>MT5 Live</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Server</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>FlexyMarketsServer</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Currency</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>USD</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Min. Deposit</Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>$100</Text>
                </View>
              </View>

              {/* Create Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isLevel2Verified ? colors.lavender : colors.grayLight,
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  opacity: isLevel2Verified ? 1 : 0.6
                }}
                onPress={handleCreateAccount}
                disabled={isCreating}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: isLevel2Verified ? colors.black : colors.gray }}>
                  {isCreating ? 'Creating Account...' : 'Create MT5 Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Account Details View */}
            <View style={{ marginHorizontal: 16 }}>
              {/* Account Card */}
              <LinearGradient colors={[colors.cardDark, colors.cardLight]} style={{ borderRadius: 20, padding: 20, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.lavender + '22', alignItems: 'center', justifyContent: 'center' }}>
                      <ChartNavIcon />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.white }}>MT5 Live Account</Text>
                      <Text style={{ fontSize: 12, color: colors.gray }}>{accountData.server}</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: colors.green + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: colors.green }}>{accountData.status}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.cardLight }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: colors.gray }}>Account</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.white, marginTop: 4 }}>{accountData.accountNumber}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 11, color: colors.gray }}>Equity</Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.green, marginTop: 4 }}>${accountData.equity.toLocaleString()}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Account Stats */}
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                <View style={{ flex: 1, backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                  <Text style={{ fontSize: 11, color: colors.gray }}>Balance</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.black, marginTop: 4 }}>${accountData.balance.toLocaleString()}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                  <Text style={{ fontSize: 11, color: colors.gray }}>Free Margin</Text>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.black, marginTop: 4 }}>${accountData.freeMargin.toLocaleString()}</Text>
                </View>
              </View>

              {/* Account Info */}
              <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.grayLight + '22', marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>Account Information</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>Account Number</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.grayDark }}>{accountData.accountNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>Server</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.grayDark }}>{accountData.server}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>Leverage</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.grayDark }}>{accountData.leverage}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>Margin Used</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.grayDark }}>${accountData.margin.toLocaleString()}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, color: colors.gray }}>Margin Level</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.green }}>{accountData.marginLevel}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: colors.lavender, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                  onPress={() => onNavigate('deposit')}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>Deposit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: colors.white, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.lavender }}
                  onPress={() => onNavigate('withdraw')}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.lavender }}>Withdraw</Text>
                </TouchableOpacity>
              </View>

              {/* Change Password */}
              <TouchableOpacity style={{ backgroundColor: colors.cardDark, borderRadius: 14, padding: 16, marginTop: 16, borderWidth: 1, borderColor: colors.grayLight + '22', flexDirection: 'row', alignItems: 'center' }}>
                <LockIcon size={20} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>Change Trading Password</Text>
                  <Text style={{ fontSize: 12, color: colors.gray }}>Update your MT5 password</Text>
                </View>
                <BackIcon dark={isDark} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ PROFILE/SETTINGS SCREEN ============
const SettingsScreen = ({ kycStatus, onNavigate }: { kycStatus: string; onNavigate: (s: Screen) => void }) => {
  const isVerified = kycStatus === 'approved';
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
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginTop: 16 }}>User Name</Text>

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
          />

          <MenuItem
            icon={<SettingsNavIcon />}
            title="Account Settings"
            subtitle="Preferences and notifications"
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
            onPress={() => Alert.alert('Logout', 'Are you sure you want to log out?', [{ text: 'Cancel' }, { text: 'Logout', style: 'destructive' }])}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.red }}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 56, height: 56 }}><View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' }}><SettingsNavIcon /></View></TouchableOpacity>
      </View>
    </Layout>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [kycStatus, setKycStatus] = useState<'none' | 'pending' | 'approved'>('none');
  const [kycLevel, setKycLevel] = useState(0); // 0 = none, 1 = basic (deposit), 2 = full (withdraw)
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Detect device color scheme
  const systemColorScheme = useColorScheme();

  // Compute effective theme
  const isDark = themeMode === 'system'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const themeColors = isDark ? darkColors : lightColors;

  const handleNavigate = (s: Screen) => setScreen(s);

  const handleKycComplete = () => {
    if (kycLevel === 0) {
      setKycLevel(1);
      setKycStatus('pending');
    } else if (kycLevel === 1) {
      setKycLevel(2);
      setKycStatus('approved');
    }
    setScreen('wallet');
  };

  const themeContextValue = {
    colors: themeColors,
    isDark,
    themeMode,
    setThemeMode,
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen onComplete={() => setScreen('welcome')} />;
      case 'welcome': return <WelcomeScreen onLogin={() => setScreen('login')} onSignup={() => setScreen('signup')} />;
      case 'login': return <LoginScreen onBack={() => setScreen('welcome')} onLogin={() => setScreen('home')} onSignup={() => setScreen('signup')} />;
      case 'signup': return <SignupScreen onBack={() => setScreen('welcome')} onSignup={() => setScreen('home')} onLogin={() => setScreen('login')} />;
      case 'kycForm': return <KYCFormScreen kycLevel={kycLevel} onSubmit={handleKycComplete} onBack={() => setScreen('wallet')} onNavigate={handleNavigate} />;
      case 'home': return <HomeScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
      case 'wallet': return <WalletScreen kycLevel={kycLevel} onNavigate={handleNavigate} />;
      case 'transfer': return <TransferScreen onNavigate={handleNavigate} />;
      case 'plans': return <PlansScreen onNavigate={handleNavigate} />;
      case 'withdraw': return <WithdrawScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
      case 'settings': return <SettingsScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
      case 'personalData': return <PersonalDataScreen onNavigate={handleNavigate} />;
      case 'deposit': return <DepositScreen onNavigate={handleNavigate} />;
      case 'mt5Account': return <MT5AccountScreen kycLevel={kycLevel} onNavigate={handleNavigate} />;
      case 'trades': return <PlaceholderScreen title="Trades" subtitle="Active trades list coming soon" onBack={() => setScreen('home')} />;
      default: return <HomeScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {renderScreen()}
    </ThemeContext.Provider>
  );
}
