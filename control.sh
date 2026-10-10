#!/bin/bash
OS=$(uname -s)
if [ $1 == "setup" ]
then
    set +e
    rm -rf package-lock.json node_modules
    set -e
    npm install
    npx tsc
fi
if [ $1 == "register" ]
then
    set -e
    npx tsx --env-file=../.env ./deploy.ts
fi
if [ $1 == "dev" ]
then
    set -e
    npx tsx --env-file=../.env ./index.ts
fi
if [ $1 == "start" ]
then
    set +e
    pm2 stop "discordbot"
    pm2 delete "discordbot"
    set -e
    pm2 save --force
    pm2 start "npx tsx --env-file=../.env ./index.ts" --name "discordbot"
    pm2 save --force
    echo "Successfully started application process."
fi
if [ $1 == "stop" ]
then
    set +e
    pm2 stop "discordbot"
    pm2 delete "discordbot"
    set -e
    pm2 save --force
    echo "Successfully stopped application process."
fi