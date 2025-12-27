#!/bin/bash
echo "🔧 Comprehensive fix for all nested screen imports..."

# Process all nested screen folders
for folder in auth main kyc settings transactions onboarding; do
  echo "Processing screens/$folder/..."
  for file in src/screens/$folder/*.tsx; do
    [ -f "$file" ] || continue
    
    # Fix all imports that should go up two levels
    sed -i '' \
      -e "s|from '../components/|from '../../components/|g" \
      -e "s|from '../contexts/|from '../../contexts/|g" \
      -e "s|from '../services/|from '../../services/|g" \
      -e "s|from '../types/|from '../../types/|g" \
      -e "s|from '../theme/|from '../../theme/|g" \
      -e "s|from '../utils/|from '../../utils/|g" \
      -e "s|from \"../components/|from '../../components/|g" \
      -e "s|from \"../contexts/|from '../../contexts/|g" \
      -e "s|from \"../services/|from '../../services/|g" \
      -e "s|from \"../types/|from '../../types/|g" \
      -e "s|from \"../theme/|from '../../theme/|g" \
      -e "s|from \"../utils/|from '../../utils/|g" \
      "$file"
  done
done

echo "✅ All imports comprehensively fixed!"
