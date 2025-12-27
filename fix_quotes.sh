#!/bin/bash
echo "Fixing mismatched quotes..."

# Fix all files with mismatched quotes
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' "s|from \"\([^']*\)'|from '\1'|g" "$file"
done

echo "Done!"
