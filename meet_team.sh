#!/bin/bash

ROLE=$1
PROMPT_FILE="prompts/$ROLE.txt"

if [ -z "$ROLE" ]; then
  echo "Usage: ./meet_team.sh [frontend|backend]"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Error: Agent '$ROLE' not found. Available: frontend, backend"
  exit 1
fi

echo "=========================================="
echo "🤖 SUMMONING AGENT: $ROLE"
echo "=========================================="
echo "Loading persona from $PROMPT_FILE..."

# Copy prompt to clipboard for easy pasting
cat "$PROMPT_FILE" | pbcopy
echo "✅ System Prompt copied to clipboard!"
echo "👉 CMD+V to paste the instructions into the session below."
echo "Starting Gemini interface..."
echo "------------------------------------------"

# Launch gemini
gemini
