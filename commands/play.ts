import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice"
import { bold, ChatInputCommandInteraction, ContainerBuilder, GuildMember, InteractionContextType, MessageFlags, SectionBuilder, SlashCommandBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js"
import globalsPlayer from "../globals/player.ts"

const info = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Supports SoundCloud (Search & Url), Bandcamp (Url Only)")
    .setContexts([InteractionContextType.Guild])
    .addStringOption(option =>
        option.setName("query")
            .setDescription("Enter the song name or url")
            .setRequired(true))

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    let query: string = interaction.options.getString("query")!
    let voiceConnection: VoiceConnection | undefined = getVoiceConnection(interaction.guild!.id)
    
    // Create Voice Connection
    
    if (!voiceConnection) {
        voiceConnection = joinVoiceChannel({
            channelId: (interaction.member as GuildMember).voice.channelId!,
            guildId: interaction.guild!.id,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
        })
        if (!globalsPlayer.player.hasOwnProperty(interaction.guild!.id)) {
            globalsPlayer.player = {
                [interaction.guild!.id]: {
                    player: createAudioPlayer(),
                    queries: [],
                    resource: undefined,
                    status: 0,
                    volume: 0.1
                }
            }
        }
    }

    // Supported Regex Checks

    const bandcampRegex: RegExp = /^(.*?)(?:bandcamp)\.com(.*)/
    const soundcloudRegex: RegExp = /^(.*?)(?:soundcloud)\.com(.*)/
    if (!query.match(bandcampRegex) && !query.match(soundcloudRegex)) {
        query = `scsearch:${query}`
    }
    
    globalsPlayer.player[interaction.guild!.id].queries.push(query)

    // yt-dlp Request

    const data = await globalsPlayer.request(query)
    if (!data) {
        await interaction.deleteReply()
        return
    }

    // Components v2 UI

    const container = new ContainerBuilder()
        .setAccentColor(+Deno.env.get("ACCENT")!)
        .addSectionComponents(
            new SectionBuilder()
                 .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`${bold("Music Player")} - Queued`),
                    new TextDisplayBuilder()
                        .setContent(data.title)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(data.artwork)
                )
        )

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 })

    // Audio Resource Creation

    if (voiceConnection && globalsPlayer.player[interaction.guild!.id].status == 0) {
        globalsPlayer.player[interaction.guild!.id].status = 1
        globalsPlayer.player[interaction.guild!.id].resource = createAudioResource(data.url, {
            inlineVolume: true
        })
        globalsPlayer.player[interaction.guild!.id].resource!.volume!.setVolume(globalsPlayer.player[interaction.guild!.id].volume)
        globalsPlayer.player[interaction.guild!.id].player.play(globalsPlayer.player[interaction.guild!.id].resource!)
        voiceConnection.subscribe(globalsPlayer.player[interaction.guild!.id].player)

        globalsPlayer.player[interaction.guild!.id].player.on(AudioPlayerStatus.Idle, () => {
            globalsPlayer.player[interaction.guild!.id].queries.shift()
            if (globalsPlayer.player[interaction.guild!.id].queries.length == 0) {
                if (voiceConnection) voiceConnection.destroy()
                delete globalsPlayer.player[interaction.guild!.id]
            } else {
                globalsPlayer.request(globalsPlayer.player[interaction.guild!.id].queries[0]).then(data => {
                    if (!data) {
                        if (voiceConnection) voiceConnection.destroy()
                        delete globalsPlayer.player[interaction.guild!.id]
                        return
                    }
                    globalsPlayer.player[interaction.guild!.id].resource = createAudioResource(data.url, {
                        inlineVolume: true
                    })
                    globalsPlayer.player[interaction.guild!.id].resource!.volume!.setVolume(globalsPlayer.player[interaction.guild!.id].volume)
                    globalsPlayer.player[interaction.guild!.id].player.play(globalsPlayer.player[interaction.guild!.id].resource!)
                    if (voiceConnection) {
                        voiceConnection.subscribe(globalsPlayer.player[interaction.guild!.id].player)
                    }
                })
            }
        })

        // Player Errors

        globalsPlayer.player[interaction.guild!.id].player.on("error", _ => {
            if (voiceConnection) voiceConnection.destroy()
            delete globalsPlayer.player[interaction.guild!.id]
        })
    }
}

export { info, invoke }