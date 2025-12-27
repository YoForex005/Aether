import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme/ThemeContext';
import { sendOtpService } from '../../services/auth/forgotPassword';
import Layout from '../../components/layout/Layout';
import { BackIcon, EmailIcon, ShieldIcon } from '../../components/icons/Icons';
import AnimatedButton from '../../components/common/AnimatedButton';



type ForgotProps = {
  onBack: () => void;
    onSendOtp: (email: string) => void;   

};

const ForgotPasswordScreen: React.FC<ForgotProps> = ({ onBack, onSendOtp }) => {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const handleSendOtp = async () => {
  if (!email) {
    Toast.show({
      type: "error",
      text1: "Email Required",
      text2: "Please enter your email address",
    });
    return;
  }

  setLoading(true);

  const result = await sendOtpService(email);

  console.log("OTP RESULT:", result);

  if (!result.ok) {
    Toast.show({
      type: "error",
      text1: "Failed",
      text2: result.data?.message || "Unable to send OTP",
    });
    setLoading(false);
    return;
  }

  Toast.show({
    type: "success",
    text1: "OTP Sent",
    text2: result.data?.message || "Check your email",
  });

  setLoading(false);
  onSendOtp(email);
};

  return (
    <Layout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.cardDark,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onBack}
        >
          <BackIcon dark={isDark} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 120,
            paddingBottom: 40,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.textPrimary }}>
              Forgot Password
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.gray,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Enter your email to receive an OTP
            </Text>
          </View>

          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                backgroundColor: colors.cardDark,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ShieldIcon size={16} />
              <Text style={{ fontSize: 12, color: colors.grayLight }}>
                Secure Reset Process
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.cardDark,
              borderRadius: 14,
              paddingHorizontal: 16,
              gap: 12,
              borderWidth: 1,
              borderColor: colors.cardLight,
            }}
          >
            <EmailIcon />
            <TextInput
              style={{
                flex: 1,
                height: 52,
                fontSize: 15,
                color: colors.textPrimary,
              }}
              placeholder="Enter your email address"
              placeholderTextColor={colors.gray}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <AnimatedButton onPress={handleSendOtp} disabled={loading}>
            <LinearGradient
              colors={[colors.lavender, colors.lavenderLight]}
              style={{
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.black,
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Text>
            </LinearGradient>
          </AnimatedButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default ForgotPasswordScreen;
