# Source this in every shell that renders:  . tools/env.sh
# Hyperframes and Remotion cannot download their own browser from this workspace,
# so both are pointed at the Chromium headless shell that Playwright ships.
export DO_NOT_TRACK=1                 # no telemetry from the render tools
export HYPERFRAMES_SKIP_SKILLS=1      # `hyperframes init` would otherwise try to fetch skills from GitHub
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | tail -1)
export HYPERFRAMES_BROWSER_PATH="$HS"
export REMOTION_BROWSER="$HS"         # pass as: npx remotion render ... --browser-executable="$REMOTION_BROWSER"
