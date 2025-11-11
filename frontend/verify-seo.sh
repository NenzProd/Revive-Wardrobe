#!/bin/bash

# SEO Verification Script for Revive Wardrobe
# This script checks if all SEO requirements are met

echo "🔍 Verifying SEO Implementation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

# Check 1: SEO Component exists
echo "1️⃣  Checking SEO Component..."
if [ -f "src/components/SEO.tsx" ]; then
    echo -e "${GREEN}✓${NC} SEO component exists"
else
    echo -e "${RED}✗${NC} SEO component not found"
    ISSUES=$((ISSUES + 1))
fi

# Check 2: HelmetProvider in main.tsx
echo ""
echo "2️⃣  Checking HelmetProvider..."
if grep -q "HelmetProvider" src/main.tsx; then
    echo -e "${GREEN}✓${NC} HelmetProvider configured"
else
    echo -e "${RED}✗${NC} HelmetProvider not found in main.tsx"
    ISSUES=$((ISSUES + 1))
fi

# Check 3: react-helmet-async installed
echo ""
echo "3️⃣  Checking dependencies..."
if grep -q "react-helmet-async" package.json; then
    echo -e "${GREEN}✓${NC} react-helmet-async installed"
else
    echo -e "${RED}✗${NC} react-helmet-async not installed"
    ISSUES=$((ISSUES + 1))
fi

if grep -q "vite-plugin-sitemap" package.json; then
    echo -e "${GREEN}✓${NC} vite-plugin-sitemap installed"
else
    echo -e "${RED}✗${NC} vite-plugin-sitemap not installed"
    ISSUES=$((ISSUES + 1))
fi

# Check 4: Sitemap configuration
echo ""
echo "4️⃣  Checking sitemap configuration..."
if grep -q "vite-plugin-sitemap" vite.config.ts; then
    echo -e "${GREEN}✓${NC} Sitemap plugin configured"
else
    echo -e "${RED}✗${NC} Sitemap plugin not configured"
    ISSUES=$((ISSUES + 1))
fi

# Check 5: Robots.txt exists
echo ""
echo "5️⃣  Checking robots.txt..."
if [ -f "public/robots.txt" ]; then
    echo -e "${GREEN}✓${NC} robots.txt exists"
    if grep -q "Sitemap:" public/robots.txt; then
        echo -e "${GREEN}✓${NC} Sitemap reference in robots.txt"
    else
        echo -e "${YELLOW}⚠${NC} Sitemap reference missing in robots.txt"
    fi
else
    echo -e "${RED}✗${NC} robots.txt not found"
    ISSUES=$((ISSUES + 1))
fi

# Check 6: Pages with SEO
echo ""
echo "6️⃣  Checking pages for SEO implementation..."
PAGES_WITH_SEO=$(grep -l "import SEO" src/pages/*.tsx | wc -l)
TOTAL_PAGES=$(ls src/pages/*.tsx | wc -l)
echo "   Pages with SEO: $PAGES_WITH_SEO / $TOTAL_PAGES"

if [ $PAGES_WITH_SEO -eq $TOTAL_PAGES ]; then
    echo -e "${GREEN}✓${NC} All pages have SEO"
else
    echo -e "${YELLOW}⚠${NC} Some pages missing SEO"
    echo "   Pages without SEO:"
    for file in src/pages/*.tsx; do
        if ! grep -q "import SEO" "$file"; then
            echo "   - $(basename $file)"
        fi
    done
fi

# Check 7: H1 tags
echo ""
echo "7️⃣  Checking H1 tags..."
H1_COUNT=$(grep -r "<h1" src/pages/ | wc -l)
echo "   H1 tags found: $H1_COUNT"
if [ $H1_COUNT -ge 15 ]; then
    echo -e "${GREEN}✓${NC} H1 tags present in pages"
else
    echo -e "${YELLOW}⚠${NC} Some pages may be missing H1 tags"
fi

# Check 8: Build test
echo ""
echo "8️⃣  Testing build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    
    # Check if sitemap was generated
    if [ -f "dist/sitemap.xml" ]; then
        echo -e "${GREEN}✓${NC} Sitemap generated"
        SITEMAP_URLS=$(grep -c "<loc>" dist/sitemap.xml)
        echo "   URLs in sitemap: $SITEMAP_URLS"
    else
        echo -e "${RED}✗${NC} Sitemap not generated"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo -e "${RED}✗${NC} Build failed"
    ISSUES=$((ISSUES + 1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All SEO checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to production"
    echo "2. Submit sitemap to Google Search Console"
    echo "3. Test social sharing with Facebook Debugger"
    echo "4. Monitor SEO performance"
else
    echo -e "${RED}✗ Found $ISSUES issue(s)${NC}"
    echo "Please review the errors above and fix them."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit $ISSUES
