import { ChatInputCommandInteraction, GuildMember, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js"
import { createAudioResource, getVoiceConnection, VoiceConnection } from "@discordjs/voice"
import globals from "../globals/player.ts"

const info = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song")
    .setContexts([InteractionContextType.Guild])

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const voiceConnection: VoiceConnection | undefined = getVoiceConnection(interaction.guild!.id)
    if (voiceConnection && voiceConnection.joinConfig.channelId == (interaction.member as GuildMember).voice.channelId && globals.player[interaction.guild!.id].status == 1) {
        globals.player[interaction.guild!.id].queries.shift()

        const data = await globals.request(globals.player[interaction.guild!.id].queries[0])
        if (!data) {
            await interaction.deleteReply()
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