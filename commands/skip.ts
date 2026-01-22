import { ChatInputCommandInteraction, GuildMember, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js"
import { createAudioResource, getVoiceConnection } from "@discordjs/voice"
import globals from "../globals.ts"

const info = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song")
    .setContexts([InteractionContextType.Guild])

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const voiceConnection = getVoiceConnection(interaction.guild!.id)
    if (voiceConnection && voiceConnection.joinConfig.channelId == (interaction.member as GuildMember).voice.channelId && globals.player[interaction.guild!.id].status == 1) {
        globals.player[interaction.guild!.id].ids.shift()

        const data = await globals.ytdlpRequest("null", globals.player[interaction.guild!.id].ids[0], "null")
        if (!data) {
            return
        }
        globals.player[interaction.guild!.id].resource = createAudioResource(data.url, {
            inlineVolume: true
        })
        globals.player[interaction.guild!.id].resource!.volume!.setVolume(globals.player[interaction.guild!.id].volume)
        globals.player[interaction.guild!.id].player.play(globals.player[interaction.guild!.id].resource!)
        voiceConnection.subscribe(globals.player[interaction.guild!.id].player)
    }
    
    await interaction.deleteReply()
}

export { info, invoke }