#!/bin/bash

set -euo pipefail

mkdir aifm
cd aifm

curl -sS -o compose.yml https://raw.githubusercontent.com/AET-DevOps25/team-in-the-midst-of-chaos-there-is-also-opportunity.-sun-tzu/main/compose.yml

read -sp "DOWNLOAD_PASS: " DOWNLOAD_PASS < /dev/tty
echo
read -sp "OPENAI_API_KEY: " OPENAI_API_KEY < /dev/tty
echo

echo -n "URL: "
IFS= read -r input < /dev/tty

#read -p "URL [http://localhost:8080]: " URL < /dev/tty
#echo

> .env
echo "DOWNLOAD_PASS=$DOWNLOAD_PASS" >> .env
echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env
echo "URL=$URL" >> .env

docker compose up -d --pull always

docker compose logs -f
