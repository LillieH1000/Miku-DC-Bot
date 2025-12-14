import deno from "../deno.json" with { type: "json" }
import { Client, Guild, TextChannel } from "discord.js"

function invoke(client: Client) {
    setInterval(async function() {
        const guild1: Guild | undefined = client.guilds.cache.get(deno.guilds.crowbarworld) as (Guild | undefined)
        const channel1: TextChannel | undefined = guild1?.channels.cache.get("772878081907884072") as (TextChannel | undefined)
        await channel1?.setName(`Members: ${guild1?.memberCount}`)

        const guild2: Guild | undefined = client.guilds.cache.get(deno.guilds.legacyupdate.id) as (Guild | undefined)
        const channel2: TextChannel | undefined = guild2?.channels.cache.get(deno.guilds.legacyupdate.channels.membercount) as (TextChannel | undefined)
        await channel2?.setName(`Members: ${guild2?.memberCount}`)
    }, 60000)
}

export { invoke }