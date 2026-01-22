import { bold, ChatInputCommandInteraction, ContainerBuilder, GuildMember, InteractionContextType, MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"
import { getVoiceConnection } from "@discordjs/voice"
import globals from "../globals.ts"

const info = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current playing song")
    .setContexts([InteractionContextType.Guild])

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    const voiceConnection = getVoiceConnection(interaction.guild!.id)
    if (voiceConnection && voiceConnection.joinConfig.channelId == (interaction.member as GuildMember).voice.channelId && globals.player[interaction.guild!.id].status == 1) {
        globals.player[interaction.guild!.id].player.unpause()

        const container = new ContainerBuilder()
            .setAccentColor(+Deno.env.get("ACCENT")!)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(bold("Music Player")),
                new TextDisplayBuilder()
                    .setContent("Resumed playing audio")
            )

        await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 })
    } else {
        await interaction.deleteReply()
    }
}

export { info, invoke }