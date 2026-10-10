import { AudioPlayer, AudioResource } from "@discordjs/voice"
import { execFileSync } from "node:child_process"

// Player Object

interface playerObject {
    [key: string]: {
        player: AudioPlayer
        queries: string[]
        resource?: AudioResource
        status: number
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
    const args: string[] = [
        "-J",
        "-f",
        "bestaudio[acodec!=opus]",
        "--no-cache-dir",
        "--no-download",
        "--no-playlist",
        url
    ]

    const stdout = execFileSync("yt-dlp", args, { encoding: "utf-8" })

    let data: ytdlpData = JSON.parse(stdout)
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