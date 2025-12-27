#!/bin/bash
echo "🔧 Fixing contexts and services imports in nested screens..."

# Fix all nested screen folders
for folder in auth main kyc settings transactions onboarding; do
  echo "Processing screens/$folder/..."
  for file in src/screens/$folder/*.tsx; do
    [ -f "$file" ] || continue
    sed -i '' \
      -e "s|from '../contexts/|from '../../contexts/|g" \
      -e "s|from '../services/|from '../../services/|g" \
      "$file"
  done
done

echo "✅ All contexts and services imports fixed!"
