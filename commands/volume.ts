import { ChatInputCommandInteraction, GuildMember, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js"
import { getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import globals from "../globals/player.ts"

const info = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Change the volume of the current playing song")
    .setContexts([InteractionContextType.Guild])
    .addIntegerOption(option =>
        option.setName("volume")
            .setDescription("Enter the volume integer (1 - 100) [Default: 10]")
            .setRequired(true))

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    const volume: number = interaction.options.getInteger("volume")!
    
    const voiceConnection: VoiceConnection | undefined = getVoiceConnection(interaction.guild!.id)
    if (voiceConnection && voiceConnection.joinConfig.channelId == (interaction.member as GuildMember).voice.channelId && globals.player[interaction.guild!.id].status == 1) {
        globals.player[interaction.guild!.id].volume = volume / 100
        globals.player[interaction.guild!.id].resource!.volume!.setVolume(globals.player[interaction.guild!.id].volume)
    }

    await interaction.deleteReply()
}

export { info, invoke }