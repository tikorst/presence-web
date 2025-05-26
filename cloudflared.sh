#!/bin/bash

echo "--- Running cloudflared setup script ---"

# Add cloudflare gpg key
 mkdir -p --mode=0755 /home/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | tee /home/keyrings/cloudflare-main.gpg >/dev/null

# Add this repo to your apt repositories
echo 'deb [signed-by=/home/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' |  tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
 apt-get update &&  apt-get install -y cloudflared

cloudflared service install eyJhIjoiZWUxYmVhNjJhNjdlMWM0NzdlZjYyNWI0ZTBiZDI3NGYiLCJ0IjoiYThmNDRjMGItMWUzYy00MGY4LWIyMWYtMzg4N2Q4MjdlNGFjIiwicyI6Ik1qSmpNalpsTVRjdFl6ZGhOeTAwTUdZNUxXRTBabUV0WW1JelpXRmpOelJtWWpNMCJ9