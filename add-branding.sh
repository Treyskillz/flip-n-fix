#!/bin/bash
# Add useBranding import and hook to all files that use printDocument

FILES=(
  "client/src/pages/Checklists.tsx"
  "client/src/pages/Contractors.tsx"
  "client/src/pages/Contracts.tsx"
  "client/src/pages/CredibilityPackets.tsx"
  "client/src/pages/Marketing.tsx"
  "client/src/pages/PriceReductionForm.tsx"
  "client/src/pages/RehabBudget.tsx"
  "client/src/pages/LocalPricing.tsx"
)

for f in "${FILES[@]}"; do
  echo "Processing $f..."
  
  # 1. Add import for useBranding after the printDocument import
  if ! grep -q "useBranding" "$f"; then
    sed -i "/import { printDocument } from '@\/lib\/printDocument';/a import { useBranding } from '@\/lib\/branding';" "$f"
  fi
  
  # 2. Add useBranding hook after the first useState in the component
  FUNC_LINE=$(grep -n "export default function" "$f" | head -1 | cut -d: -f1)
  NEXT_LINE=$((FUNC_LINE + 1))
  EXISTING=$(sed -n "${NEXT_LINE}p" "$f")
  if ! grep -q "useBranding" "$f"; then
    sed -i "${NEXT_LINE}i\\  const { branding } = useBranding();" "$f"
  fi
  
  # 3. Add branding property to printDocument call
  # Find the closing }); of printDocument({ and add branding before it
  # We need to find the specific pattern
  PRINT_LINE=$(grep -n "printDocument({" "$f" | head -1 | cut -d: -f1)
  if [ -n "$PRINT_LINE" ]; then
    # Find the closing }); after printDocument({
    CLOSE_LINE=$(awk "NR>=$PRINT_LINE" "$f" | grep -n "});" | head -1 | cut -d: -f1)
    ACTUAL_CLOSE=$((PRINT_LINE + CLOSE_LINE - 1))
    # Check if branding is already there
    if ! sed -n "${PRINT_LINE},${ACTUAL_CLOSE}p" "$f" | grep -q "branding"; then
      # Insert branding before the closing });
      sed -i "${ACTUAL_CLOSE}i\\      branding," "$f"
    fi
  fi
  
  echo "  Done."
done

echo "All files processed."
