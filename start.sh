#!/usr/bin/env bash

set -e

BASE_PATH=$(cd "$(dirname "$0")/ps4broadcast"; pwd)
cd "$0"
echo "${BASE_PATH}"

echo "Preparing extra modules..."
mkdir -p node_modules
cp -R ./douyu/* node_modules

echo "Configuring network address..."
ifconfig "$1:2" 192.168.200.1 netmask 255.255.255.0

echo "Enabling kernel ip_forward setting..."
sysctl -w net.ipv4.ip_forward=1
sysctl -p

echo "Setting iptables..."
iptables -t nat -F
iptables -t nat -A PREROUTING --ipv4 -s 192.168.200.1 -j RETURN
iptables -t nat -A PREROUTING -p tcp -s 192.168.200.0/24 --dport 1935 -j DNAT --to-destination 192.168.200.1:1935
iptables -t nat -A PREROUTING -p tcp -s 192.168.200.0/24 --dport 6667 -j DNAT --to-destination 192.168.200.1:6667
iptables -t filter -A FORWARD -s 192.168.200.0/24 -j ACCEPT
iptables -t filter -A FORWARD -d 192.168.200.0/24 -j ACCEPT
iptables -t nat -A POSTROUTING --ipv4 -j MASQUERADE

echo "Starting backend service..."
node ./backend.js >backend.log 2>&1 &

echo "Starting frontend service..."
npm run start >frontend.log 2>&1 &

echo "Frontend and backend keep running, press Ctrl+C to exit!"
echo "Check logs: backend.log and frontend.log in $(pwd)"
while :; do
    sleep 10000d
done
