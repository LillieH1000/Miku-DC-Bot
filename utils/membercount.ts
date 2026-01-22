import { Client, Guild, TextChannel } from "discord.js"

function invoke(client: Client) {
    setInterval(async function() {
        const guild: Guild | undefined = client.guilds.cache.get("416350699794857986") as (Guild | undefined)
        const channel: TextChannel | undefined = guild?.channels.cache.get("772878081907884072") as (TextChannel | undefined)
        await channel?.setName(`Members: ${guild?.memberCount}`)
    }, 60000)
}

export { invoke }