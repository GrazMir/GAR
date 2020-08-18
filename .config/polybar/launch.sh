#!/usr/bin/env bash

# Terminate already running bar instances
killall -q polybar
# If all your bars have ipc enabled, you can also use 
# polybar-msg cmd quit

# Launch bar1 and bar2
echo "---" | tee -a /tmp/polybar1.log /tmp/polybar2.log
polybar mainMonitor  >>/tmp/polybar1.log 2>&1 & disown

if [ "$(xrandr | awk '/HDMI1/ {print $2}')" == "connected" ]; then
	polybar externalMonitor  >>/tmp/polybar1.log 2>&1 & disown
fi

echo "Bars launched..."
