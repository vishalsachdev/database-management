#!/bin/bash
# sync-framework.sh - Updates framework files from intelligent-textbooks

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

FRAMEWORK_REPO="https://github.com/vishalsachdev/intelligent-textbooks.git"

echo -e "${BLUE}Syncing framework from upstream...${NC}"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

git clone --depth 1 "$FRAMEWORK_REPO" framework

# Go back to textbook directory
cd -

# Update plugins
if [ -d "$TEMP_DIR/framework/plugins" ]; then
    echo -e "${YELLOW}Updating plugins...${NC}"
    rm -rf plugins/*
    cp -r "$TEMP_DIR/framework/plugins/"* plugins/
    echo -e "${GREEN}✓ Plugins updated${NC}"
fi

# Update setup.py
if [ -f "$TEMP_DIR/framework/setup.py" ]; then
    cp "$TEMP_DIR/framework/setup.py" .
    echo -e "${GREEN}✓ setup.py updated${NC}"
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✓ Framework updated successfully${NC}"
echo -e "${YELLOW}Note: Review changes and reinstall plugins: pip install -e .${NC}"
