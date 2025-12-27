import React, { useState, useContext } from "react";
import { useColorScheme } from "react-native";
import {
  ThemeContext,
  lightColors,
  darkColors,
  ThemeMode,
} from "./theme/ThemeContext";
import { Screen } from "./types";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import Toast from "react-native-toast-message";

// Screens
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import KYCFormScreen from "./screens/KYCFormScreen";
import WalletScreen from "./screens/WalletScreen";
import TransferScreen from "./screens/TransferScreen";
import PlansScreen from "./screens/PlansScreen";
import WithdrawScreen from "./screens/WithdrawScreen";
import SettingsScreen from "./screens/SettingsScreen";
import PersonalDataScreen from "./screens/PersonalDataScreen";
import DepositScreen from "./screens/DepositScreen";
import MT5AccountScreen from "./screens/MT5AccountScreen";
import TradesScreen from "./screens/TradesScreen";
import SecurityScreen from "./screens/SecurityScreen";
import AccountSettingsScreen from "./screens/AccountSettingsScreen";
import ForgotPasswordScreen from "./screens/auth_screen/ForgetPasswordScreen";
import VerifyPasswordScreen from "./screens/auth_screen/VerifyPasswordScreen";
import ResetPasswordScreen from "./screens/auth_screen/RestPasswordScreen";

// ============ INNER APP (uses AuthContext) ============
function AppContent() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [kycStatus, setKycStatus] = useState<"none" | "pending" | "approved">("none");
  const [kycLevel, setKycLevel] = useState(0);
  const [verifyEmail, setVerifyEmail] = useState("");

  const { token, loading } = useContext(AuthContext);

  const handleNavigate = (s: Screen) => setScreen(s);

  const handleKycComplete = () => {
    if (kycLevel === 0) {
      setKycLevel(1);
      setKycStatus("pending");
    } else if (kycLevel === 1) {
      setKycLevel(2);
      setKycStatus("approved");
    }
    setScreen("wallet");
  };

  const renderScreen = () => {
    // Show splash while checking auth
    if (screen === "splash") {
      return (
        <SplashScreen
          onComplete={() => {
            // After splash, check if user is logged in
            if (token) {
              setScreen("home");
            } else {
              setScreen("welcome");
            }
          }}
        />
      );
    }

    // If still loading auth state after splash, show splash
    if (loading) {
      return <SplashScreen onComplete={() => {}} />;
    }

    // If logged in and trying to access auth screens, redirect to home
    if (token && ["welcome", "login", "signup"].includes(screen)) {
      return <HomeScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
    }

    switch (screen) {
      case "welcome":
        return (
          <WelcomeScreen
            onLogin={() => setScreen("login")}
            onSignup={() => setScreen("signup")}
          />
        );
      case "login":
        return (
          <LoginScreen
            onBack={() => setScreen("welcome")}
            onLogin={() => setScreen("home")}
            onSignup={() => setScreen("signup")}
            onForgot={() => setScreen("forgotPassword")}
          />
        );
      case "signup":
        return (
          <SignupScreen
            onBack={() => setScreen("welcome")}
            onSignup={() => setScreen("home")}
            onLogin={() => setScreen("login")}
          />
        );
      case "kycForm":
        return (
          <KYCFormScreen
            kycLevel={kycLevel}
            onSubmit={handleKycComplete}
            onBack={() => setScreen("wallet")}
            onNavigate={handleNavigate}
          />
        );
      case "forgotPassword":
        return (
          <ForgotPasswordScreen
            onBack={() => setScreen("login")}
            onSendOtp={(email) => {
              setVerifyEmail(email);
              setScreen("verifyPassword");
            }}
          />
        );
      case "verifyPassword":
        return (
          <VerifyPasswordScreen
            email={verifyEmail}
            onBack={() => setScreen("forgotPassword")}
            onReset={() => setScreen("resetPassword")}
          />
        );
      case "resetPassword":
        return (
          <ResetPasswordScreen
            onBack={() => setScreen("login")}
            onDone={() => setScreen("login")}
          />
        );
      case "home":
        return <HomeScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
      case "wallet":
        return <WalletScreen kycLevel={kycLevel} onNavigate={handleNavigate} />;
      case "transfer":
        return <TransferScreen onNavigate={handleNavigate} />;
      case "plans":
        return <PlansScreen onNavigate={handleNavigate} />;
      case "withdraw":
        return <WithdrawScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
      case "settings":
        return <SettingsScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
      case "personalData":
        return <PersonalDataScreen onNavigate={handleNavigate} />;
      case "deposit":
        return <DepositScreen onNavigate={handleNavigate} />;
      case "mt5Account":
        return <MT5AccountScreen kycLevel={kycLevel} onNavigate={handleNavigate} />;
      case "trades":
        return <TradesScreen onNavigate={handleNavigate} />;
      case "security":
        return <SecurityScreen onNavigate={handleNavigate} />;
      case "accountSettings":
        return <AccountSettingsScreen onNavigate={handleNavigate} />;
      default:
        return <HomeScreen kycStatus={kycStatus} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <Toast />
    </>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const systemColorScheme = useColorScheme();

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  const themeColors = isDark ? darkColors : lightColors;

  const themeContextValue = {
    colors: themeColors,
    isDark,
    themeMode,
    setThemeMode,
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeContextValue}>
        <AppContent />
      </ThemeContext.Provider>
    </AuthProvider>
  );
}