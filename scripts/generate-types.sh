#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🔧 Supabase TypeScript Types Generator${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo -e "${YELLOW}  brew install supabase/tap/supabase${NC}"
    echo ""
    exit 1
fi

# Check if user is logged in to Supabase
echo -e "${BLUE}Checking Supabase login status...${NC}"
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Supabase${NC}"
    echo ""
    echo "Please login first:"
    echo -e "${GREEN}  supabase login${NC}"
    echo ""
    echo "This will open a browser to authenticate."
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Logged in to Supabase${NC}"
echo ""

# Extract project ID from .env.local
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    echo ""
    echo "Please create .env.local from .env.local.example first"
    echo ""
    exit 1
fi

# Get Supabase URL and extract project ID
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2 | tr -d ' ' | tr -d '"' | tr -d "'")

if [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local${NC}"
    echo ""
    echo "Please add your Supabase URL to .env.local"
    echo ""
    exit 1
fi

# Extract project ID from URL (format: https://PROJECT_ID.supabase.co)
PROJECT_ID=$(echo "$SUPABASE_URL" | sed -E 's/https:\/\/([^.]+).*/\1/')

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" == "your-project-id" ]; then
    echo -e "${RED}❌ Invalid project ID${NC}"
    echo ""
    echo "Your Supabase URL should look like:"
    echo -e "${YELLOW}  https://abcdefghijklmnop.supabase.co${NC}"
    echo ""
    echo "Please update NEXT_PUBLIC_SUPABASE_URL in .env.local"
    echo ""
    exit 1
fi

echo -e "${BLUE}Project ID: ${YELLOW}${PROJECT_ID}${NC}"
echo ""
echo -e "${BLUE}Generating TypeScript types...${NC}"

# Generate types
supabase gen types typescript --project-id "$PROJECT_ID" > src/lib/supabase/types.ts

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Types generated successfully!${NC}"
    echo ""
    echo -e "Types saved to: ${YELLOW}src/lib/supabase/types.ts${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Failed to generate types${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure your project ID is correct"
    echo "2. Ensure you have access to the project"
    echo "3. Check that your database has tables/schemas"
    echo ""
    exit 1
fi
