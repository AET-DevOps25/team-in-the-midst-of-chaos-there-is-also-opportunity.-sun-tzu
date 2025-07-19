#!/bin/bash

set -euo pipefail

mkdir aifm
cd aifm

curl -sS -o compose.yml https://raw.githubusercontent.com/AET-DevOps25/team-in-the-midst-of-chaos-there-is-also-opportunity.-sun-tzu/main/compose.yml

echo "Welcome to the ai.FM setup script!"
echo
echo -n "Please configure the application by entering values for the corresponding environment variables."
echo -n " Sensitive values will not be shown in the terminal."
echo -n " Optional variables have their default value given in square brackets and can be left blank."
echo
echo

# Prompt for sensitive and non-sensitive values
echo -n "DOWNLOAD_PASS: "
stty -echo < /dev/tty
IFS= read -r DOWNLOAD_PASS < /dev/tty
stty echo < /dev/tty
echo

echo -n "OPENAI_API_KEY: "
stty -echo < /dev/tty
IFS= read -r OPENAI_API_KEY < /dev/tty
stty echo < /dev/tty
echo

echo -n "URL [http://localhost:8080]: "
IFS= read -r URL < /dev/tty

> .env
echo "DOWNLOAD_PASS=$DOWNLOAD_PASS" >> .env
echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env
echo "URL=$URL" >> .env

docker compose up -d --pull always

docker compose logs -f
