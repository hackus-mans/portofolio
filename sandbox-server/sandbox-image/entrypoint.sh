#!/bin/sh
set -eu

cat > "$HOME/.bashrc" <<'EOF'
export PS1='\[\e[1;32m\]guest@sandbox\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ '
export HISTFILE="$HOME/.bash_history"
export HISTSIZE=300
export HISTFILESIZE=300
umask 077
alias ll='ls -alF'
alias la='ls -A'
EOF

cp /opt/sandbox/README.txt "$HOME/README.txt"
printf '\n'
cat /opt/sandbox/README.txt
printf '\n'

exec /usr/bin/script -qefc "/bin/bash --noprofile --rcfile $HOME/.bashrc -i" /dev/null
