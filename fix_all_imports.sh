#!/bin/bash

echo "🔧 Fixing all import paths across the project..."

# Find all TypeScript files except node_modules
find src -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" | while read file; do
  echo "Processing: $file"
  
  # Fix screen imports (relative paths)
  sed -i '' \
    -e 's|from ["'\'']\.\.*/screens/SplashScreen|from "../screens/onboarding/SplashScreen|g' \
    -e 's|from ["'\'']\.\.*/screens/WelcomeScreen|from "../screens/onboarding/WelcomeScreen|g' \
    -e 's|from ["'\'']\.\.*/screens/LoginScreen|from "../screens/auth/LoginScreen|g' \
    -e 's|from ["'\'']\.\.*/screens/SignupScreen|from "../screens/auth/SignupScreen|g' \
    -e 's|from ["'\'']\.\.*/screens/HomeScreen|from "../screens/main/HomeScreen|g' \
    -e 's|from ["'\'']\.\.*/screens/WalletScreen|from "../screens/main/WalletScreen|g' \
    "$file"
  
  # Fix service imports
  sed -i '' \
    -e 's|from ["'\'']\.\.*/services/auth_service/|from "../services/auth/|g' \
    -e 's|from ["'\'']\.\.*/services/mt5_service/|from "../services/mt5/|g' \
    -e 's|from ["'\'']\.\.*/services/profile_services/|from "../services/profile/|g' \
    "$file"
  
  # Fix component imports
  sed -i '' \
    -e 's|from ["'\'']\.\.*/components/Layout|from "../components/layout/Layout|g' \
    -e 's|from ["'\'']\.\.*/components/Icons|from "../components/icons/Icons|g' \
    -e 's|from ["'\'']\.\.*/components/AnimatedButton|from "../components/common/AnimatedButton|g' \
    -e 's|from ["'\'']\.\.*/components/CountryPicker|from "../components/common/CountryPicker|g' \
    "$file"
  
  # Fix UserConst imports
  sed -i '' \
    -e 's|from ["'\'']\.\.*/contexts/UserConst|from "../types/user|g' \
    "$file"
done

echo "✅ All imports fixed!"
