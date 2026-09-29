#!/usr/bin/env bash
set -u

printf "Linux Lab environment check\n"
printf "===========================\n\n"

printf "%-14s %s\n" "user:" "$(whoami)"
printf "%-14s %s\n" "kernel:" "$(uname -sr)"
printf "%-14s %s\n" "architecture:" "$(uname -m)"
printf "%-14s %s\n" "python:" "$(python3 --version 2>&1)"
printf "%-14s %s\n" "gcc:" "$(gcc --version | head -n1)"
printf "%-14s %s\n" "git:" "$(git --version)"
printf "%-14s %s\n" "nmap:" "$(nmap --version | head -n1)"
printf "\nEnvironment ready.\n"
