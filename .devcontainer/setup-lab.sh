#!/usr/bin/env bash
set -euo pipefail

mkdir -p lab/playground lab/exercises lab/notes
chmod +x lab/check-environment.sh 2>/dev/null || true

cat > "$HOME/.bash_aliases" <<'EOF'
alias ll='ls -alF'
alias la='ls -A'
alias lab='cd "$CODESPACE_VSCODE_FOLDER/lab"'
EOF

printf "\nLinux lab ready. Open a terminal and start in ./lab.\n"
