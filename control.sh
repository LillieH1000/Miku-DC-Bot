if [ $1 == "register" ]
then
    set -e
    deno run --allow-env --allow-ffi --allow-net --allow-read=commands,/usr/bin/ldd --check ./deploy.ts
fi
if [ $1 == "dev" ]
then
    set -e
    deno run --allow-env --allow-ffi --allow-net --allow-read=commands,node_modules,utils,/proc/self/exe,/usr/bin/ldd --allow-run=ffmpeg,yt-dlp --allow-sys=cpus,hostname,networkInterfaces --check ./index.ts
fi
if [ $1 == "start" ]
then
    set +e
    pm2 stop "discordbot"
    pm2 delete "discordbot"
    set -e
    pm2 save --force
    pm2 start ./index.ts --interpreter="deno" --interpreter-args="run --allow-env --allow-ffi --allow-net --allow-read=commands,node_modules,utils --allow-run=ffmpeg,yt-dlp --check" --name "discordbot"
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