import { AudioPlayer, AudioResource } from "@discordjs/voice"

// Player Object

interface playerObject {
    [key: string]: {
        player: AudioPlayer
        resource?: AudioResource
        status: number
        urls: string[]
        volume: number
    }
}

const player:playerObject = {}

// yt-dlp Call

interface ytdlpData {
    entries?: [{
        title: string
        thumbnail: string
        url: string
    }]
    title: string
    thumbnail: string
    url: string
}

interface retData {
    title: string
    artwork: string
    url: string
}

async function request(url: string): Promise<retData | undefined> {
    const command = new Deno.Command("yt-dlp", {
        args: ["-J", "-f", "bestaudio", "--no-cache-dir", "--no-download", "--no-playlist", url],
        stdout: "piped"
    })

    const process: Deno.ChildProcess = command.spawn()
    let data: ytdlpData = await process.stdout.json()
    if (data.entries) {
        data = data.entries[0]
    }

    return {
        title: data.title,
        artwork: data.thumbnail,
        url: data.url
    }
}

// Exports

export default {
    player,
    request
}