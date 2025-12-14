import deno from "../deno.json" with { type: "json" }
import { Client, TextChannel } from "discord.js"

function invoke(client: Client) {
    client.on("messageReactionAdd", async (reaction, member) => {
        if (member.bot || !reaction.message.guild) return
        
        if (reaction.message.guild.id != deno.guilds.legacyupdate.id) {
            return
        }
    
        if (reaction.emoji.name == "⭐" && reaction.message.reactions.cache.get("⭐")?.count == 1) {
            const channel: TextChannel | undefined = reaction.message.guild.channels.cache.get("1318066740940242954") as (TextChannel | undefined)
            if (!channel) return

            await channel.send("⭐")
            await reaction.message.forward(channel)
        }
    })
}

export { invoke }