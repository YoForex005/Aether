import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';
import AnimatedButton from '../../components/common/AnimatedButton';
import Toast from 'react-native-toast-message';
import { signupService } from '../../services/auth/signupService';

import {
    BackIcon, AetherLogo, ShieldIcon,
    SignalIcon, ChartNavIcon, EmailIcon,
    LockIcon, GoogleIcon, AppleIcon
} from '../../components/icons/Icons';

const SignupScreen = ({ onBack, onSignup, onLogin }: { onBack: () => void; onSignup: () => void; onLogin: () => void }) => {

    const { colors, isDark } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Email & Password are required.'
            });
            return;
        }

        setLoading(true);

        const result = await signupService(email, password);
        setLoading(false);

        if (result.ok) {
            Toast.show({
                type: 'success',
                text1: 'Account Created 🎉',
                text2: 'Welcome to Aether!'
            });
            onSignup();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
                text2: result.data?.message || 'Please try again.'
            });
        }
    };

    return (
        <Layout>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                
                {/* Back Button */}
                <TouchableOpacity
                    style={{
                        position: 'absolute', top: 50, left: 20, zIndex: 10,
                        width: 44, height: 44, borderRadius: 22,
                        backgroundColor: colors.cardDark, alignItems: 'center', justifyContent: 'center'
                    }}
                    onPress={onBack}
                >
                    <BackIcon dark={isDark} />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40 }}>

                    {/* Header */}
                    <View style={{ alignItems: 'center', marginBottom: 24 }}>
                        <AetherLogo size={60} />
                        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16 }}>
                            Join Aether
                        </Text>
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

                    {/* FORM FIELDS (Name Removed) */}
                    <View style={{ gap: 14 }}>
                        
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark,
                            borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1,
                            borderColor: colors.cardLight
                        }}>
                            <EmailIcon />
                            <TextInput
                                style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }}
                                placeholder="Email address"
                                placeholderTextColor={colors.gray}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark,
                            borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1,
                            borderColor: colors.cardLight
                        }}>
                            <LockIcon />
                            <TextInput
                                style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }}
                                placeholder="Create password"
                                placeholderTextColor={colors.gray}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        {/* Sign Up Button */}
                        <AnimatedButton onPress={handleSignup} disabled={loading}>
                            <LinearGradient
                                colors={[colors.lavender, colors.lavenderLight]}
                                style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Text>
                            </LinearGradient>
                        </AnimatedButton>

                    </View>

                    {/* Login Redirect */}
                    <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={onLogin}>
                        <Text style={{ fontSize: 14, color: colors.gray }}>
                            Already a member? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
};

export default SignupScreen;









// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTheme } from '../../theme/ThemeContext';
// import Layout from '../../components/layout/Layout';
// import AnimatedButton from '../../components/common/AnimatedButton';
// import {
//     BackIcon,
//     AetherLogo,
//     ShieldIcon,
//     SignalIcon,
//     ChartNavIcon,
//     UserIcon,
//     EmailIcon,
//     LockIcon,
//     GoogleIcon,
//     AppleIcon
// } from '../../components/icons/Icons';

// const SignupScreen = ({ onBack, onSignup, onLogin }: { onBack: () => void; onSignup: () => void; onLogin: () => void }) => {
//     const { colors, isDark } = useTheme();
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSignup = () => {
//         if (!name || !email || !password) { Alert.alert('Incomplete', 'All fields are required.'); return; }
//         setLoading(true);
//         setTimeout(() => { setLoading(false); onSignup(); }, 1000);
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
//                         <Text style={{ fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginTop: 16 }}>Join Aether</Text>
//                         <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center', marginTop: 8 }}>
//                             Start your trading journey in under 60 seconds
//                         </Text>
//                     </View>

//                     {/* Benefit Badges */}
//                     <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
//                         <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//                             <ShieldIcon size={14} />
//                             <Text style={{ fontSize: 11, color: colors.grayLight }}>Secure</Text>
//                         </View>
//                         <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//                             <SignalIcon size={14} color={colors.green} />
//                             <Text style={{ fontSize: 11, color: colors.grayLight }}>Free</Text>
//                         </View>
//                         <View style={{ backgroundColor: colors.cardDark, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//                             <ChartNavIcon />
//                             <Text style={{ fontSize: 11, color: colors.grayLight }}>24/7 Trading</Text>
//                         </View>
//                     </View>

//                     {/* Form Fields */}
//                     <View style={{ gap: 14 }}>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
//                             <UserIcon />
//                             <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Full name" placeholderTextColor={colors.gray} value={name} onChangeText={setName} />
//                         </View>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
//                             <EmailIcon />
//                             <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Email address" placeholderTextColor={colors.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
//                         </View>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingHorizontal: 16, gap: 12, borderWidth: 1, borderColor: colors.cardLight }}>
//                             <LockIcon />
//                             <TextInput style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }} placeholder="Create password" placeholderTextColor={colors.gray} value={password} onChangeText={setPassword} secureTextEntry />
//                         </View>

//                         {/* Create Account Button */}
//                         <AnimatedButton onPress={handleSignup} disabled={loading}>
//                             <LinearGradient colors={[colors.lavender, colors.lavenderLight]} style={{ borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 6 }}>
//                                 <Text style={{ fontSize: 16, fontWeight: '700', color: colors.black }}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
//                             </LinearGradient>
//                         </AnimatedButton>
//                     </View>

//                     {/* Divider */}
//                     <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 }}>
//                         <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
//                         <Text style={{ fontSize: 12, color: colors.gray }}>or continue with</Text>
//                         <View style={{ flex: 1, height: 1, backgroundColor: colors.cardLight }} />
//                     </View>

//                     {/* Social Sign-up */}
//                     <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
//                         <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Google', 'Connecting...'); setTimeout(onSignup, 1000); }}>
//                             <GoogleIcon />
//                             <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Google</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardDark, borderRadius: 14, paddingVertical: 14, gap: 8, borderWidth: 1, borderColor: colors.cardLight }} onPress={() => { Alert.alert('Apple', 'Connecting...'); setTimeout(onSignup, 1000); }}>
//                             <AppleIcon size={18} />
//                             <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textPrimary }}>Apple</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Social Proof */}
//                     <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 20 }}>
//                         <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
//                             <View style={{ alignItems: 'center' }}>
//                                 <Text style={{ fontSize: 18, fontWeight: '700', color: colors.lavender }}>50K+</Text>
//                                 <Text style={{ fontSize: 10, color: colors.gray }}>Traders</Text>
//                             </View>
//                             <View style={{ alignItems: 'center' }}>
//                                 <Text style={{ fontSize: 18, fontWeight: '700', color: colors.lavender }}>$12M+</Text>
//                                 <Text style={{ fontSize: 10, color: colors.gray }}>Paid Out</Text>
//                             </View>
//                             <View style={{ alignItems: 'center' }}>
//                                 <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>4.9/5</Text>
//                                 <Text style={{ fontSize: 10, color: colors.gray }}>Rating</Text>
//                             </View>
//                         </View>
//                     </View>

//                     {/* Terms */}
//                     <Text style={{ fontSize: 11, color: colors.gray, textAlign: 'center', lineHeight: 16 }}>
//                         By creating an account, you agree to our{' '}
//                         <Text style={{ color: colors.lavender }}>Terms of Service</Text> and{' '}
//                         <Text style={{ color: colors.lavender }}>Privacy Policy</Text>
//                     </Text>

//                     {/* Login Link */}
//                     <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={onLogin}>
//                         <Text style={{ fontSize: 14, color: colors.gray }}>Already a member? <Text style={{ color: colors.lavender, fontWeight: '600' }}>Sign In</Text></Text>
//                     </TouchableOpacity>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </Layout>
//     );
// };

// export default SignupScreen;
