import deno from "../deno.json" with { type: "json" }
import { Client, Guild, TextChannel } from "discord.js"

function invoke(client: Client) {
    setInterval(async function() {
        const guild: Guild | undefined = client.guilds.cache.get(deno.guilds.openplace.id) as (Guild | undefined)
        const channel: TextChannel | undefined = guild?.channels.cache.get(deno.guilds.openplace.channels.serverstatus) as (TextChannel | undefined)
        try {
            const res: Response = await fetch("https://openplace.live/", {
                method: "HEAD"
            })

            await channel?.setName(`Server Status: ${res.statusText}`)

            if (res.body) await res.body.cancel()
        } catch (_error) {
            await channel?.setName("Server Status: Unresponsive")
        }
    }, 60000)
}

export { invoke }