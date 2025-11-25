import deno from "../deno.json" with { type: "json" }
import { bold, Client, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextChannel, TextDisplayBuilder, ThumbnailBuilder } from "discord.js"
import { format } from "date-fns"

function invoke(client: Client) {
    client.on("guildMemberAdd", async member => {
        const container: ContainerBuilder = new ContainerBuilder()
            .setAccentColor(+deno.keys.accent)
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(bold(`${member.user.displayName} Joined`)),
                        new TextDisplayBuilder()
                            .setContent(`Username: ${member.user.username}`),
                        new TextDisplayBuilder()
                            .setContent(`ID: ${member.user.id}`)
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(member.user.displayAvatarURL())
                    )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Created At: ${format(member.user.createdAt, "MMMM d, yyyy")}`)
            )

        if (member.guild.id == deno.guilds.devserver) {
            const channel: TextChannel | undefined = member.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        } else if (member.guild.id == deno.guilds.legacyupdate) {
            const channel: TextChannel | undefined = member.guild.channels.cache.get("1197666440942198794") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        } else if (member.guild.id == deno.guilds.openplace) {
            const channel: TextChannel | undefined = member.guild.channels.cache.get("1437280756480344144") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        } else {
            await member.guild.systemChannel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
    })

    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        if (oldMember.pending && !newMember.pending) {
            const container: ContainerBuilder = new ContainerBuilder()
                .setAccentColor(+deno.keys.accent)
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(bold(`${newMember.user.displayName} Accepted Rules`)),
                            new TextDisplayBuilder()
                                .setContent(`Username: ${newMember.user.username}`),
                            new TextDisplayBuilder()
                                .setContent(`ID: ${newMember.user.id}`)
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder()
                                .setURL(newMember.user.displayAvatarURL())
                        )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`Created At: ${format(newMember.user.createdAt, "MMMM d, yyyy")}`)
                )

            if (newMember.joinedAt) {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`Joined At: ${format(newMember.joinedAt, "MMMM d, yyyy")}`)
                )
            }
            
            if (newMember.guild.id == deno.guilds.devserver) {
                const channel: TextChannel | undefined = newMember.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
                await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            } else if (newMember.guild.id == deno.guilds.legacyupdate) {
                const channel: TextChannel | undefined = newMember.guild.channels.cache.get("1197666440942198794") as (TextChannel | undefined)
                await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            } else if (newMember.guild.id == deno.guilds.openplace) {
                const channel: TextChannel | undefined = newMember.guild.channels.cache.get("1437280756480344144") as (TextChannel | undefined)
                await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            } else {
                await newMember.guild.systemChannel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
            }
        }
    })

    client.on("guildMemberRemove", async member => {
        const container: ContainerBuilder = new ContainerBuilder()
            .setAccentColor(+deno.keys.accent)
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(bold(`${member.user.displayName} Left`)),
                        new TextDisplayBuilder()
                            .setContent(`Username: ${member.user.username}`),
                        new TextDisplayBuilder()
                            .setContent(`ID: ${member.user.id}`)
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(member.user.displayAvatarURL())
                    )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Created At: ${format(member.user.createdAt, "MMMM d, yyyy")}`)
            )

        if (member.joinedAt) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`Joined At: ${format(member.joinedAt, "MMMM d, yyyy")}`)
            )
        }

        if (member.guild.id == deno.guilds.devserver) {
            const channel: TextChannel | undefined = member.guild.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        } else if (member.guild.id == deno.guilds.legacyupdate) {
            const channel: TextChannel | undefined = member.guild.channels.cache.get("1197666440942198794") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        } else if (member.guild.id == deno.guilds.openplace) {
            const channel: TextChannel | undefined = member.guild.channels.cache.get("1437280756480344144") as (TextChannel | undefined)
            await channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        } else {
            await member.guild.systemChannel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
    })
}

export { invoke }