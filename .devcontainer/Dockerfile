FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

USER root

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      python3 python3-pip python3-venv \
      gcc g++ make \
      git curl wget jq openssl \
      iproute2 net-tools dnsutils nmap traceroute tcpdump \
      vim nano less tree file unzip zip ripgrep tmux htop man-db shellcheck \
    && rm -rf /var/lib/apt/lists/*

USER vscode
