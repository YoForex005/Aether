import React, { useContext, useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import { KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, View, Text, TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Toast from "react-native-toast-message";
import AnimatedButton from "../../components/common/AnimatedButton";

import Layout from "../../components/layout/Layout";
import { AuthContext } from "../../contexts/AuthContext";
import { resetPasswordService } from "../../services/auth/forgotPassword";
import { BackIcon, ShieldIcon, LockIcon, EyeIcon, EyeOffIcon } from "../../components/icons/Icons";


type ResetProps = {
  onBack: () => void;
  onDone: () => void;
};

const ResetPasswordScreen: React.FC<ResetProps> = ({ onBack, onDone }) => {
  const { colors, isDark } = useTheme();
  const { token } = useContext(AuthContext);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPass || !confirmPass) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Fill both password fields",
      });
      return;
    }

    if (newPass.length < 6) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters",
      });
      return;
    }

    if (newPass !== confirmPass) {
      Toast.show({
        type: "error",
        text1: "Mismatch",
        text2: "Both passwords must match",
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Unauthorized",
        text2: "Token missing. Please login again.",
      });
      return;
    }

    setLoading(true);

    const result = await resetPasswordService(token, newPass, confirmPass);

    if (!result.ok) {
      Toast.show({
        type: "error",
        text1: "Failed",
        text2: result.data?.message || "Something went wrong",
      });
      setLoading(false);
      return;
    }

    Toast.show({
      type: "success",
      text1: "Password Updated!",
      text2: "Login with your new password",
    });

    setLoading(false);
    onDone();
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
              Reset Password
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.gray,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Create a strong and secure new password
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
                Secure Password Update
              </Text>
            </View>
          </View>

          {/* NEW PASSWORD */}
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
            <LockIcon />
            <TextInput
              style={{
                flex: 1,
                height: 52,
                fontSize: 15,
                color: colors.textPrimary,
              }}
              placeholder="New Password"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showPass}
              value={newPass}
              onChangeText={setNewPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              {showPass ? (
                <EyeOffIcon size={22} color={colors.gray} />
              ) : (
                <EyeIcon size={22} color={colors.gray} />
              )}
            </TouchableOpacity>
          </View>

          {/* CONFIRM PASSWORD */}
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
              marginTop: 14,
            }}
          >
            <LockIcon />
            <TextInput
              style={{
                flex: 1,
                height: 52,
                fontSize: 15,
                color: colors.textPrimary,
              }}
              placeholder="Confirm Password"
              placeholderTextColor={colors.gray}
              secureTextEntry={!showConfirm}
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? (
                <EyeOffIcon size={22} color={colors.gray} />
              ) : (
                <EyeIcon size={22} color={colors.gray} />
              )}
            </TouchableOpacity>
          </View>

          <AnimatedButton onPress={handleReset} disabled={loading}>
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
                {loading ? "Updating..." : "Reset Password"}
              </Text>
            </LinearGradient>
          </AnimatedButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default ResetPasswordScreen;