import deno from "../deno.json" with { type: "json" }
import { Client, TextChannel } from "discord.js"

function invoke(client: Client) {
    client.on("messageReactionAdd", async (reaction, member) => {
        if (member.bot || !reaction.message.guild) return
        
        if (reaction.message.guild.id == deno.guilds.legacyupdate.id && reaction.emoji.name == "⭐" && reaction.message.reactions.cache.get("⭐")?.count == 3) {
            const channel: TextChannel | undefined = reaction.message.guild.channels.cache.get(deno.guilds.legacyupdate.channels.starboard) as (TextChannel | undefined)
            if (!channel) return

            await channel.send("⭐")
            await reaction.message.forward(channel)
        }
    })
}

export { invoke }