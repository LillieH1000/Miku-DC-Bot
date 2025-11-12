import { Client, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js"
import globals from "../globals.ts"

const count = new Map()

// Disabled when cloned due to map storage issue for multiple guilds
function invoke(client: Client) {
    client.on("messageCreate", async message => {
        if (message.author.bot || !message.content || !message.guild) return
    
        // Legacy Update - openplace
        if (message.guild.id != "1095995920409178112" && message.guild.id != "1422571580181184644") {
            return
        }

        if (count.has(message.author.id)) {
            count.set(message.author.id, {
                count: parseInt(count.get(message.author.id).count) + 1
            })
            if (parseInt(count.get(message.author.id).count) == 8) {
                const embed = new EmbedBuilder()
                    .setColor(globals.colours.embed)
                    .setTitle("Anti Spam Triggered")
                    .addFields(
                        { name: "Display Name:", value: message.author.displayName, inline: false },
                        { name: "Username:", value: message.author.username, inline: false },
                        { name: "ID:", value: message.author.id, inline: false }
                    )
                    .setTimestamp()

                if (message.member && message.guild.members.me && message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                    await message.member.timeout(2419200000, "Message Spam")
                    embed.addFields(
                        { name: "Action:", value: "Muted, messages not deleted", inline: false }
                    )
                } else {
                    embed.addFields(
                        { name: "Action:", value: "Not muted, messages not deleted", inline: false }
                    )
                }

                // Legacy Update
                if (message.guild.id == "1095995920409178112") {
                    const channel = message.guild.channels.cache.get("1197666541467078787") as (TextChannel | undefined)
                    await channel?.send({
                        content: "<@&1096003733554479135> <@&1195220849435889705>",
                        embeds: [embed]
                    })
                    return
                }
                // openplace
                if (message.guild.id == "1422571580181184644") {
                    const channel = message.guild.channels.cache.get("1437281871288467497") as (TextChannel | undefined)
                    await channel?.send({
                        content: ".",
                        embeds: [embed]
                    })
                    return
                }
            }
        } else {
            count.set(message.author.id, {
                count: 1,
                timeout: setTimeout(() => {
                    count.delete(message.author.id)
                }, 5000)
            })
        }
    })
}

export { invoke }