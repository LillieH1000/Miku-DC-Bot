import deno from "../deno.json" with { type: "json" }
import { bold, Client, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SeparatorBuilder, TextChannel, TextDisplayBuilder } from "discord.js"
import { format } from "date-fns"

function invoke(client: Client) {
    client.on("messageDelete", async message => {
        if (!message.author || message.author.bot || !message.guild) return

        if (message.guild.id != deno.guilds.devserver && message.guild.id != deno.guilds.legacyupdate.id && message.guild.id != deno.guilds.openplace.id) return

        const container: ContainerBuilder = new ContainerBuilder()
            .setAccentColor(+deno.keys.accent)
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
                    .setContent(`Created At: ${format(message.createdAt, "MMMM d, yyyy")}`)
            )

        if (message.content) {
            container.addSeparatorComponents(
                new SeparatorBuilder()
            ).addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("Message:")
            ).addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(message.content)
            )
        }

        if (message.attachments && message.attachments.size > 0) {
            container.addSeparatorComponents(
                new SeparatorBuilder()
            ).addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("Attachments:")
            )

            const gallery: MediaGalleryBuilder = new MediaGalleryBuilder()

            message.attachments.forEach(attachment => {
                gallery.addItems(new MediaGalleryItemBuilder().setURL(attachment.url))
            })

            container.addMediaGalleryComponents(gallery)
        }
        
        if (message.guild.id == deno.guilds.devserver) {
            const channel: TextChannel | undefined = message.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
        if (message.guild.id == deno.guilds.legacyupdate.id) {
            const channel: TextChannel | undefined = message.guild.channels.cache.get(deno.guilds.legacyupdate.logs.message) as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
        if (message.guild.id == deno.guilds.openplace.id) {
            const channel: TextChannel | undefined = message.guild.channels.cache.get(deno.guilds.openplace.logs.message) as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
    })

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (!newMessage.author || newMessage.author.bot || !newMessage.guild) return

        if (newMessage.guild.id != deno.guilds.devserver && newMessage.guild.id != deno.guilds.legacyupdate.id && newMessage.guild.id != deno.guilds.openplace.id) return

        if (oldMessage.content != newMessage.content) {
            const container: ContainerBuilder = new ContainerBuilder()
                .setAccentColor(+deno.keys.accent)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(bold("Message Updated"))
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`Username: ${newMessage.author.username}`),
                    new TextDisplayBuilder()
                        .setContent(`Channel: <#${newMessage.channel.id}>`),
                    new TextDisplayBuilder()
                        .setContent(`Original Date: ${format(oldMessage.createdAt, "MMMM d, yyyy")}`),
                    new TextDisplayBuilder()
                        .setContent(`Edited Date: ${format(newMessage.createdAt, "MMMM d, yyyy")}`)
                )

            // Old Message

            if (oldMessage.content) {
                container.addSeparatorComponents(
                    new SeparatorBuilder()
                ).addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent("Old Message:")
                ).addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(oldMessage.content)
                )
            }

            // Old Attachments - Temporarily Disabled

            /* if (oldMessage.attachments && oldMessage.attachments.size > 0) {
                container.addSeparatorComponents(
                    new SeparatorBuilder()
                ).addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent("Old Attachments:")
                )

                const gallery: MediaGalleryBuilder = new MediaGalleryBuilder()

                oldMessage.attachments.forEach(attachment => {
                    gallery.addItems(new MediaGalleryItemBuilder().setURL(attachment.url))
                })

                container.addMediaGalleryComponents(gallery)
            } */

            // New Message

            if (newMessage.content) {
                container.addSeparatorComponents(
                    new SeparatorBuilder()
                ).addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent("New Message:")
                ).addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(newMessage.content)
                )
            }

            // New Attachments - Temporarily Disabled

            /* if (newMessage.attachments && newMessage.attachments.size > 0) {
                container.addSeparatorComponents(
                    new SeparatorBuilder()
                ).addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent("New Attachments:")
                )

                const gallery: MediaGalleryBuilder = new MediaGalleryBuilder()

                newMessage.attachments.forEach(attachment => {
                    gallery.addItems(new MediaGalleryItemBuilder().setURL(attachment.url))
                })

                container.addMediaGalleryComponents(gallery)
            } */

            if (newMessage.guild.id == deno.guilds.devserver) {
                const channel: TextChannel | undefined = newMessage.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
                await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            }
            if (newMessage.guild.id == deno.guilds.legacyupdate.id) {
                const channel: TextChannel | undefined = newMessage.guild.channels.cache.get(deno.guilds.legacyupdate.logs.message) as (TextChannel | undefined)
                await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            }
            if (newMessage.guild.id == deno.guilds.openplace.id) {
                const channel: TextChannel | undefined = newMessage.guild.channels.cache.get(deno.guilds.openplace.logs.message) as (TextChannel | undefined)
                await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            }
        }
    })
}

export { invoke }