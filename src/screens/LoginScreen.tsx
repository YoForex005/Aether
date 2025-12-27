import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import { AuthContext } from '../contexts/AuthContext';
import Toast from "react-native-toast-message";
import { loginService } from "../services/auth_service/loginService";

import {
    BackIcon,
    AetherLogo,
    ShieldIcon,
    EmailIcon,
    LockIcon,
    GoogleIcon,
    AppleIcon
} from '../components/Icons';

type LoginScreenProps = {
    onBack: () => void;
    onLogin: () => void;
    onSignup: () => void;
     onForgot: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onLogin, onSignup,onForgot }) => {
    const { colors, isDark } = useTheme();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Missing Fields",
                text2: "Email / Username & Password required"
            });
            return;
        }

        setLoading(true);

        try {
            const { status, json } = await loginService(email, password);

            if (status === 200 && json.status === true) {
                const token = json.data?.token;

                if (!token) {
                    Toast.show({
                        type: "error",
                        text1: "Invalid Response",
                        text2: "Token missing from server"
                    });
                    setLoading(false);
                    return;
                }

                await login(token);

                Toast.show({
                    type: "success",
                    text1: "Login Successful",
                    text2: "Redirecting..."
                });

                setLoading(false);
                onLogin();
                return;
            }

            Toast.show({
                type: "error",
                text1: "Login Failed",
                text2: json.message || "Invalid credentials"
            });

        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Network Error",
                text2: "Please try again"
            });
        }

        setLoading(false);
    };

    return (
        <Layout>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 50,
                        left: 20,
                        zIndex: 10,
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: colors.cardDark,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={onBack}
                >
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
                            <TextInput
                                style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }}
                                placeholder="Email address or Username"
                                placeholderTextColor={colors.gray}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
                            <LockIcon />
                            <TextInput
                                style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }}
                                placeholder="Password"
                                placeholderTextColor={colors.gray}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} 
                        onPress={onForgot}>
                      <Text style={{ fontSize: 13, color: colors.lavender }}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <AnimatedButton onPress={handleLogin} disabled={loading}>
                            <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4 }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Text>
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
                        <Text style={{ fontSize: 14, color: colors.gray }}>
                            Don't have an account? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Create one</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
};

export default LoginScreen;








// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../theme/ThemeContext';
// import Layout from '../components/Layout';
// import AnimatedButton from '../components/AnimatedButton';
// import { Screen } from '../types';
// import {
//     BackIcon,
//     AetherLogo,
//     ShieldIcon,
//     EmailIcon,
//     LockIcon,
//     GoogleIcon,
//     AppleIcon
// } from '../components/Icons';

// const LoginScreen = ({ onBack, onLogin, onSignup }: { onBack: () => void; onLogin: () => void; onSignup: () => void }) => {
//     const { colors, isDark } = useTheme();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleLogin = () => {
//         if (!email || !password) { Alert.alert('Ahem', 'We require both email and password.'); return; }
//         setLoading(true);
//         setTimeout(() => { setLoading(false); onLogin(); }, 1000);
//     };

//     return (
//         <Layout>
//             <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//                 <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center' }} onPress={onBack}>
//                     <BackIcon dark={isDark} />
//                 </TouchableOpacity>
//                 <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40 }}>
//                     {/* Header */}
//                     <View style={{ alignItems: 'center', marginBottom: 24 }}>
//                         <AetherLogo size={60} />
//                         <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16 }}>Welcome Back</Text>
//                         <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center', marginTop: 8 }}>
//                             Sign in to access your trading dashboard
//                         </Text>
//                     </View>

//                     {/* Security Badge */}
//                     <View style={{ alignItems: 'center', marginBottom: 24 }}>
//                         <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                             <ShieldIcon size={16} />
//                             <Text style={{ fontSize: 12, color: colors.grayLight }}>256-bit SSL Encrypted</Text>
//                         </View>
//                     </View>

//                     {/* Form Fields */}
//                     <View style={{ gap: 14 }}>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
//                             <EmailIcon />
//                             <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Email address" placeholderTextColor={colors.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
//                         </View>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
//                             <LockIcon />
//                             <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Password" placeholderTextColor={colors.gray} value={password} onChangeText={setPassword} secureTextEntry />
//                         </View>

//                         {/* Forgot Password */}
//                         <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => Alert.alert('Reset Password', 'Password reset link sent to your email!')}>
//                             <Text style={{ fontSize: 13, color: colors.lavender }}>Forgot password?</Text>
//                         </TouchableOpacity>

//                         {/* Login Button */}
//                         <AnimatedButton onPress={handleLogin} disabled={loading}>
//                             <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4 }}>
//                                 <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>{loading ? 'Signing In...' : 'Sign In'}</Text>
//                             </LinearGradient>
//                         </AnimatedButton>
//                     </View>

//                     {/* Divider */}
//                     <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 }}>
//                         <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
//                         <Text style={{ fontSize: 12, color: colors.gray }}>or continue with</Text>
//                         <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
//                     </View>

//                     {/* Social Login */}
//                     <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
//                         <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Google', 'Connecting...'); setTimeout(onLogin, 1000); }}>
//                             <GoogleIcon />
//                             <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Google</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Apple', 'Connecting...'); setTimeout(onLogin, 1000); }}>
//                             <AppleIcon size={18} />
//                             <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Apple</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Stats */}
//                     <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
//                         <View style={{ alignItems: 'center' }}>
//                             <Text style={{ fontSize: 16, fontWeight: '700', color: colors.lavender }}>50K+</Text>
//                             <Text style={{ fontSize: 10, color: colors.gray }}>Active Users</Text>
//                         </View>
//                         <View style={{ width: 1, height: 24, backgroundColor: colors.cardLight }} />
//                         <View style={{ alignItems: 'center' }}>
//                             <Text style={{ fontSize: 16, fontWeight: '700', color: colors.lavender }}>99.9%</Text>
//                             <Text style={{ fontSize: 10, color: colors.gray }}>Uptime</Text>
//                         </View>
//                         <View style={{ width: 1, height: 24, backgroundColor: colors.cardLight }} />
//                         <View style={{ alignItems: 'center' }}>
//                             <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>24/7</Text>
//                             <Text style={{ fontSize: 10, color: colors.gray }}>Support</Text>
//                         </View>
//                     </View>

//                     {/* Signup Link */}
//                     <TouchableOpacity style={{ alignItems: 'center' }} onPress={onSignup}>
//                         <Text style={{ fontSize: 14, color: colors.gray }}>Don't have an account? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Create one</Text></Text>
//                     </TouchableOpacity>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </Layout>
//     );
// };

// export default LoginScreen;
