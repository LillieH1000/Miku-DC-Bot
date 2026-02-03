import { ChatInputCommandInteraction, GuildMember, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js"
import { getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import globals from "../globals/player.ts"

const info = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current playing song")
    .setContexts([InteractionContextType.Guild])

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const voiceConnection: VoiceConnection | undefined = getVoiceConnection(interaction.guild!.id)
    if (voiceConnection && voiceConnection.joinConfig.channelId == (interaction.member as GuildMember).voice.channelId && globals.player[interaction.guild!.id].status == 1) {
        globals.player[interaction.guild!.id].player.pause()
    }
    
    await interaction.deleteReply()
}

export { info, invoke }