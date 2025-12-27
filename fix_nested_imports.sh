#!/bin/bash
echo "🔧 Fixing import paths for nested screen folders..."

# Fix imports in screens/auth/
for file in src/screens/auth/*.tsx; do
  sed -i '' \
    -e "s|from '../components/|from '../../components/|g" \
    -e "s|from '../services/|from '../../services/|g" \
    -e "s|from '../types/|from '../../types/|g" \
    -e "s|from '../theme/|from '../../theme/|g" \
    "$file"
done

# Fix imports in screens/main/
for file in src/screens/main/*.tsx; do
  sed -i '' \
    -e "s|from '../components/|from '../../components/|g" \
    -e "s|from '../services/|from '../../services/|g" \
    -e "s|from '../types/|from '../../types/|g" \
    -e "s|from '../theme/|from '../../theme/|g" \
    "$file"
done

# Fix imports in screens/kyc/
for file in src/screens/kyc/*.tsx; do
  sed -i '' \
    -e "s|from '../components/|from '../../components/|g" \
    -e "s|from '../services/|from '../../services/|g" \
    -e "s|from '../types/|from '../../types/|g" \
    -e "s|from '../theme/|from '../../theme/|g" \
    "$file"
done

# Fix imports in screens/settings/
for file in src/screens/settings/*.tsx; do
  sed -i '' \
    -e "s|from '../components/|from '../../components/|g" \
    -e "s|from '../services/|from '../../services/|g" \
    -e "s|from '../types/|from '../../types/|g" \
    -e "s|from '../theme/|from '../../theme/|g" \
    "$file"
done

# Fix imports in screens/transactions/
for file in src/screens/transactions/*.tsx; do
  sed -i '' \
    -e "s|from '../components/|from '../../components/|g" \
    -e "s|from '../services/|from '../../services/|g" \
    -e "s|from '../types/|from '../../types/|g" \
    -e "s|from '../theme/|from '../../theme/|g" \
    "$file"
done

# Fix imports in screens/onboarding/
for file in src/screens/onboarding/*.tsx; do
  sed -i '' \
    -e "s|from '../components/|from '../../components/|g" \
    -e "s|from '../services/|from '../../services/|g" \
    -e "s|from '../types/|from '../../types/|g" \
    -e "s|from '../theme/|from '../../theme/|g" \
    "$file"
done

echo "✅ All import paths fixed!"
