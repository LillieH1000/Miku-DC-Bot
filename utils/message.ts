import { bold, Client, ContainerBuilder, EmbedBuilder, MessageFlags, SeparatorBuilder, TextChannel, TextDisplayBuilder } from "discord.js"
import { format } from "date-fns"
import globals from "../globals.ts"

function invoke(client: Client) {
    client.on("messageDelete", async message => {
        if (!message.author || message.author.bot || !message.content || !message.guild) return

        // Dev - Legacy Update - openplace
        if (message.guild.id != "1128424035173273620" && message.guild.id != "1095995920409178112" && message.guild.id != "1422571580181184644") {
            return
        }

        const container = new ContainerBuilder()
            .setAccentColor(globals.colours.accent)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(bold("Message Deleted"))
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Username: ${message.author.username}`),
                new TextDisplayBuilder()
                    .setContent(`Channel: <#${message.channel.id}>`),
                new TextDisplayBuilder()
                    .setContent(`Created At: ${format(message.createdAt, "MMMM d, yyyy")}`),
                new TextDisplayBuilder()
                    .setContent(`Message: ${message.content}`)
            )
        
        // Dev
        if (message.guild.id == "1128424035173273620") {
            const channel = message.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
        // Legacy Update
        if (message.guild.id == "1095995920409178112") {
            const channel = message.guild.channels.cache.get("1197666507925225662") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
        // openplace
        if (message.guild.id == "1422571580181184644") {
            const channel = message.guild.channels.cache.get("1437280910558105703") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
    })

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (!newMessage.author || newMessage.author.bot || !oldMessage.content || !newMessage.content || !newMessage.guild) return

        // Dev - Legacy Update - openplace
        if (newMessage.guild.id != "1128424035173273620" && newMessage.guild.id != "1095995920409178112" && newMessage.guild.id != "1422571580181184644") {
            return
        }

        if (oldMessage.content != newMessage.content) {
            const embed = new EmbedBuilder()
                .setColor(globals.colours.embed)
                .setTitle("Message Updated")
                .setAuthor({ name: newMessage.author.displayName, iconURL: newMessage.author.displayAvatarURL() })
                .addFields(
                    { name: "Username:", value: newMessage.author.username, inline: false },
                    { name: "Channel:", value: `<#${newMessage.channel.id}>`, inline: false },
                    { name: "Original Date:", value: format(oldMessage.createdAt, "MMMM d, yyyy"), inline: true },
                    { name: "Edited Date:", value: format(newMessage.createdAt, "MMMM d, yyyy"), inline: true },
                    { name: "Old Message:", value: oldMessage.content, inline: false },
                    { name: "New Message:", value: newMessage.content, inline: false }
                )
                .setFooter({ text: `ID: ${newMessage.author.id}` })
                .setTimestamp()

            // Dev
            if (newMessage.guild.id == "1128424035173273620") {
                const channel = newMessage.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
                await channel?.send({ embeds: [embed] })
            }
            // Legacy Update
            if (newMessage.guild.id == "1095995920409178112") {
                const channel = newMessage.guild.channels.cache.get("1197666507925225662") as (TextChannel | undefined)
                await channel?.send({ embeds: [embed] })
            }
            // openplace
            if (newMessage.guild.id == "1422571580181184644") {
                const channel = newMessage.guild.channels.cache.get("1437280910558105703") as (TextChannel | undefined)
                await channel?.send({ embeds: [embed] })
            }
        }
    })
}

export { invoke }