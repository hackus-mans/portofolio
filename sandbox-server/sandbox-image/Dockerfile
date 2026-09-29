FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash coreutils findutils grep sed gawk less nano vim-tiny \
    python3 gcc g++ make git file procps iproute2 net-tools \
    jq bc util-linux openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --uid 1000 --shell /bin/bash guest \
    && mkdir -p /opt/sandbox

COPY README.txt /opt/sandbox/README.txt
COPY entrypoint.sh /usr/local/bin/sandbox-entrypoint

RUN chmod 0555 /usr/local/bin/sandbox-entrypoint \
    && chmod 0444 /opt/sandbox/README.txt \
    && chown -R root:root /opt/sandbox

USER 1000:1000
WORKDIR /home/guest

ENV HOME=/home/guest
ENV TERM=xterm-256color

ENTRYPOINT ["/usr/local/bin/sandbox-entrypoint"]
