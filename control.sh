#!/bin/bash
if [ $1 == "setup" ]
then
    set +e
    rm -rf fmt
    set -e
    rsync -a --exclude "control.sh" --exclude "deno.lock" --exclude "profile.png" * fmt
    cd fmt
    deno install
    deno fmt *.ts **/*.ts
fi
if [ $1 == "test" ]
then
    set -e
    cd fmt
    deno run --check -P=test ./tests.ts
fi
if [ $1 == "register" ]
then
    set -e
    cd fmt
    deno run --check -P=register ./deploy.ts
fi
if [ $1 == "dev" ]
then
    set -e
    cd fmt
    deno run --check -P ./index.ts
fi
if [ $1 == "start" ]
then
    set +e
    pm2 stop "discordbot"
    pm2 delete "discordbot"
    set -e
    cd fmt
    pm2 save --force
    pm2 start ./index.ts --interpreter="deno" --interpreter-args="run --check -P" --name "discordbot"
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