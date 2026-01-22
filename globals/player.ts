import { AudioPlayer, AudioResource } from "@discordjs/voice"

// Player Objects

interface playerObject {
    [key: string]: {
        status: number
        ids: string[]
        player: AudioPlayer
        volume: number
        resource?: AudioResource
    }
}

const player:playerObject = {}

// yt-dlp Returns

interface ytdlpData {
    entries?: [{
        id: string
        title: string
        uploader: string
        thumbnail: string
        url: string
    }],
    id: string
    title: string
    uploader: string
    thumbnail: string
    url: string
}

interface retData {
    id: string
    title: string
    author: string
    artwork: string
    url: string
}

async function ytdlpRequest(url: string, id: string, query: string): Promise<retData | undefined> {
    let arg = ""
    if (url != "null") {
        arg = url
    }
    if (id != "null") {
        arg = `https://api.soundcloud.com/tracks/${id}`
    }
    if (query != "null") {
        arg = `scsearch:${query}`
    }

    const command = new Deno.Command("yt-dlp", {
        args: ["-J", "-f", "bestaudio[ext=mp3]", "--no-cache-dir", "--no-download", "--no-playlist", arg],
        stdout: "piped"
    })

    const process: Deno.ChildProcess = command.spawn()
    const json: ytdlpData = await process.stdout.json()

    let data: ytdlpData
    if (json.entries) {
        data = json.entries[0]
    } else {
        data = json
    }

    return {
        id: data.id,
        title: data.title,
        author: data.uploader,
        artwork: data.thumbnail,
        url: data.url
    }
}

// Exports

export default {
    player,
    ytdlpRequest
}