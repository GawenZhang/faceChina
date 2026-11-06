#!/bin/bash
# One-time server setup. Run as the ubuntu user:
#   bash scripts/setup-deploy.sh
set -euo pipefail

if [[ "$(id -un)" != "ubuntu" ]]; then
  echo "请用 ubuntu 用户执行这个脚本。" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEY="$HOME/.ssh/github_actions_deploy"

sudo apt-get update
sudo apt-get install -y rsync

mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
if [[ ! -f "$KEY" ]]; then
  ssh-keygen -t ed25519 -f "$KEY" -N "" -C "github-actions-o2magic"
fi
chmod 600 "$KEY"
chmod 644 "$KEY.pub"

touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"
PUB="$(cat "$KEY.pub")"
grep -qxF "$PUB" "$HOME/.ssh/authorized_keys" || printf '%s\n' "$PUB" >> "$HOME/.ssh/authorized_keys"

sudo install -m 755 "$SCRIPT_DIR/deploy-o2magic.sh" /usr/local/bin/deploy-o2magic
sudo tee /etc/sudoers.d/o2magic-deploy >/dev/null <<'EOF'
ubuntu ALL=(root) NOPASSWD: /usr/local/bin/deploy-o2magic
EOF
sudo chmod 440 /etc/sudoers.d/o2magic-deploy
sudo visudo -cf /etc/sudoers.d/o2magic-deploy

echo
echo "服务器已就绪。把下面这一整段私钥填进 GitHub 仓库的 Actions secret："
echo "  SSH_PRIVATE_KEY"
echo "另外两个 secret："
echo "  SSH_HOST = 110.40.173.15"
echo "  SSH_USER = ubuntu"
echo
cat "$KEY"
echo
