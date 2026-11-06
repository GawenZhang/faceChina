#!/bin/bash
# Publish a site tarball into the Nginx web root.
# Installed on the server as /usr/local/bin/deploy-o2magic and run with sudo.
set -euo pipefail

ARCHIVE="${1:-/tmp/o2magic-site.tar.gz}"
DEST="/var/www/o2magic"

if [[ ! -f "$ARCHIVE" ]]; then
  echo "找不到压缩包: $ARCHIVE" >&2
  exit 1
fi

STAGE="$(mktemp -d /tmp/o2magic-stage.XXXXXX)"
cleanup() {
  rm -rf "$STAGE"
  rm -f "$ARCHIVE"
}
trap cleanup EXIT

tar -xzf "$ARCHIVE" -C "$STAGE"
mkdir -p "$DEST"
rsync -a --delete "$STAGE/" "$DEST/"
chown -R www-data:www-data "$DEST"
find "$DEST" -type d -exec chmod 755 {} +
find "$DEST" -type f -exec chmod 644 {} +

echo "已发布到 $DEST"
