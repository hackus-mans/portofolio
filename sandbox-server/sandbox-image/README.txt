PORTFOLIO LINUX SANDBOX
=======================

This environment is disposable.

- You are an unprivileged user: guest
- The host filesystem is not mounted
- Outbound networking is disabled
- The root filesystem is read-only
- /home/guest and /tmp are temporary
- CPU, memory and process counts are limited
- Closing the browser destroys the container
- The session also expires automatically

Try:
  whoami
  id
  uname -a
  ls -la
  python3 --version
  gcc --version
  cat README.txt

Everything you create in /home/guest disappears with this session.
