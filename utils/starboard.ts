import { Client, TextChannel } from "discord.js"

function invoke(client: Client) {
    client.on("messageReactionAdd", async (reaction, member) => {
        if (member.bot || !reaction.message.guild) return
    
        // Legacy Update
        if (reaction.message.guild.id == "1095995920409178112" && reaction.emoji.name == "⭐") {
            const channel = reaction.message.guild.channels.cache.get("1318066740940242954") as (TextChannel | undefined)
            if (!channel) return
            await channel.send("⭐")
            await reaction.message.forward(channel)
        }
    })
}

export { invoke }