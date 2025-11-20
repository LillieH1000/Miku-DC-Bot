import { Client, Guild, TextChannel } from "discord.js"

function invoke(client: Client) {
    setInterval(async function() {
        // Crowbar World
        const guild1 = client.guilds.cache.get("416350699794857986") as (Guild | undefined)
        const channel1 = guild1?.channels.cache.get("772878081907884072") as (TextChannel | undefined)
        await channel1?.setName(`Members: ${guild1?.memberCount}`)

        // Legacy Update
        const guild2 = client.guilds.cache.get("1095995920409178112") as (Guild | undefined)
        const channel2 = guild2?.channels.cache.get("1441175481641865428") as (TextChannel | undefined)
        await channel2?.setName(`Members: ${guild2?.memberCount}`)
    }, 60000)
}

export { invoke }