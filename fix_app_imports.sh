#!/bin/bash

echo "🔧 Fixing App.tsx imports..."

# Backup original file
cp src/App.tsx src/App.tsx.backup

# Fix screen imports in App.tsx
sed -i '' \
  -e 's|from "\./screens/SplashScreen"|from "./screens/onboarding/SplashScreen"|g' \
  -e 's|from "\./screens/WelcomeScreen"|from "./screens/onboarding/WelcomeScreen"|g' \
  -e 's|from "\./screens/LoginScreen"|from "./screens/auth/LoginScreen"|g' \
  -e 's|from "\./screens/SignupScreen"|from "./screens/auth/SignupScreen"|g' \
  -e 's|from "\./screens/ForgetPasswordScreen"|from "./screens/auth/ForgotPasswordScreen"|g' \
  -e 's|from "\./screens/ForgotPasswordScreen"|from "./screens/auth/ForgotPasswordScreen"|g' \
  -e 's|from "\./screens/VerifyPasswordScreen"|from "./screens/auth/VerifyPasswordScreen"|g' \
  -e 's|from "\./screens/ResetPasswordScreen"|from "./screens/auth/ResetPasswordScreen"|g' \
  -e 's|from "\./screens/RestPasswordScreen"|from "./screens/auth/ResetPasswordScreen"|g' \
  -e 's|from "\./screens/HomeScreen"|from "./screens/main/HomeScreen"|g' \
  -e 's|from "\./screens/WalletScreen"|from "./screens/main/WalletScreen"|g' \
  -e 's|from "\./screens/PlansScreen"|from "./screens/main/PlansScreen"|g' \
  -e 's|from "\./screens/TradesScreen"|from "./screens/main/TradesScreen"|g' \
  -e 's|from "\./screens/MT5AccountScreen"|from "./screens/main/MT5AccountScreen"|g' \
  -e 's|from "\./screens/PlaceholderScreen"|from "./screens/main/PlaceholderScreen"|g' \
  -e 's|from "\./screens/KYCFormScreen"|from "./screens/kyc/KYCFormScreen"|g' \
  -e 's|from "\./screens/SettingsScreen"|from "./screens/settings/SettingsScreen"|g' \
  -e 's|from "\./screens/PersonalDataScreen"|from "./screens/settings/PersonalDataScreen"|g' \
  -e 's|from "\./screens/SecurityScreen"|from "./screens/settings/SecurityScreen"|g' \
  -e 's|from "\./screens/AccountSettingsScreen"|from "./screens/settings/AccountSettingsScreen"|g' \
  -e 's|from "\./screens/DepositScreen"|from "./screens/transactions/DepositScreen"|g' \
  -e 's|from "\./screens/WithdrawScreen"|from "./screens/transactions/WithdrawScreen"|g' \
  -e 's|from "\./screens/TransferScreen"|from "./screens/transactions/TransferScreen"|g' \
  src/App.tsx

# Fix component imports
sed -i '' \
  -e 's|from "\./components/Layout"|from "./components/layout/Layout"|g' \
  -e 's|from "\./components/Icons"|from "./components/icons/Icons"|g' \
  -e 's|from "\./components/AnimatedButton"|from "./components/common/AnimatedButton"|g' \
  -e 's|from "\./components/CountryPicker"|from "./components/common/CountryPicker"|g' \
  src/App.tsx

# Fix contexts imports
sed -i '' \
  -e 's|from "\./contexts/UserConst"|from "./types/user"|g' \
  src/App.tsx

echo "✅ App.tsx imports fixed!"
echo "📄 Backup saved as src/App.tsx.backup"
