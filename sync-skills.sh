#!/bin/bash
# sync-skills.sh - Updates skills from dmccreary/claude-skills

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SKILLS_REPO="https://github.com/dmccreary/claude-skills.git"

echo -e "${BLUE}Syncing skills from upstream...${NC}"

if [ -d ".claude-skills" ]; then
    rm -rf .claude-skills
fi

git clone --depth 1 "$SKILLS_REPO" .claude-skills
rm -rf .claude-skills/.git

echo -e "${GREEN}✓ Skills updated successfully${NC}"
echo -e "Skills are now at the latest version from dmccreary/claude-skills"
