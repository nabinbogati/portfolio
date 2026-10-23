#!/usr/bin/env bash
# Render the CV and cover letter to PDF with a headless Chromium browser.
# Usage: resume/build.sh   (set BROWSER to override, e.g. BROWSER=chromium)
set -euo pipefail

dir="$(cd "$(dirname "$0")" && pwd)"
browser="${BROWSER:-$(command -v brave || command -v chromium || command -v google-chrome)}"

render() {
  "$browser" --headless=new --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=5000 --print-to-pdf="$2" "file://$dir/$1" 2>/dev/null
  echo "wrote $2"
}

render cv.html "$dir/../public/assets/NabinBogati.pdf"
render cover-letter.html "$dir/NabinBogati-CoverLetter.pdf"
