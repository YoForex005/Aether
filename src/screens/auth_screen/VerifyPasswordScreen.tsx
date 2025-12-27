import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import Layout from "../../components/Layout";
import LinearGradient from "react-native-linear-gradient";
import AnimatedButton from "../../components/AnimatedButton";
import Toast from "react-native-toast-message";
import { BackIcon, ShieldIcon } from "../../components/Icons";

import { verifyOtpService } from "../../services/auth_service/forgetPassword";

type VerifyProps = {
  email: string;
  onBack: () => void;
  onReset: () => void;
};

const VerifyPasswordScreen: React.FC<VerifyProps> = ({ email, onBack, onReset }) => {
  const { colors, isDark } = useTheme();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter the 6-digit OTP",
      });
      return;
    }

    setLoading(true);

    const result = await verifyOtpService(email, otp);

    console.log("VERIFY OTP RESULT:", result);

    if (!result.ok) {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: result.data?.message || "Invalid OTP",
      });
      setLoading(false);
      return;
    }

    Toast.show({
      type: "success",
      text1: "OTP Verified Successfully",
      text2: result.data?.message || "You can reset your password now",
    });

    setLoading(false);
    onReset(); // Go to login
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Back Button */}
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
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.textPrimary }}>
              Verify OTP
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.gray,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Enter the OTP sent to your email
            </Text>
          </View>

          {/* OTP Input */}
          <TextInput
            style={{
              backgroundColor: colors.cardDark,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.cardLight,
              height: 52,
              paddingHorizontal: 16,
              fontSize: 20,
              color: colors.textPrimary,
              textAlign: "center",
              letterSpacing: 10,
            }}
            placeholder="••••••"
            placeholderTextColor={colors.gray}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          {/* Verify Button */}
          <AnimatedButton onPress={handleVerifyOtp} disabled={loading}>
            <LinearGradient
              colors={[colors.lavender, colors.lavenderLight]}
              style={{
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.black }}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Text>
            </LinearGradient>
          </AnimatedButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default VerifyPasswordScreen;
