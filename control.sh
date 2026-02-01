#!/bin/bash
OS=$(uname -s)
if [ $1 == "setup" ]
then
    set +e
    rm -rf fmt
    set -e
    if [[ $OS == "Darwin" || $OS == "Linux" ]]
    then
        rsync -a --exclude "control.sh" --exclude "deno.lock" --exclude "node_modules/" --exclude "profile.png" * fmt
    else
        robocopy "." "fmt" //E //XD "node_modules" //XF "control.sh" "deno.lock" "profile.png" || true
    fi
    cd fmt
    deno install --allow-scripts
    deno fmt *.ts **/*.ts
fi
if [ $1 == "register" ]
then
    set -e
    cd fmt
    deno run --env-file=.env --check -P=register ./deploy.ts
fi
if [ $1 == "dev" ]
then
    set -e
    cd fmt
    deno run --allow-read --env-file=.env --check -P ./index.ts
fi
if [ $1 == "start" ]
then
    set +e
    pm2 stop "discordbot"
    pm2 delete "discordbot"
    set -e
    cd fmt
    pm2 save --force
    pm2 start ./index.ts --interpreter="deno" --interpreter-args="run --env-file=.env --check -P" --name "discordbot"
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