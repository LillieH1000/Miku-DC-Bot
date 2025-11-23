import deno from "../deno.json" with { type: "json" }
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice"
import { bold, ChatInputCommandInteraction, ContainerBuilder, GuildMember, InteractionContextType, MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js"
import globals from "../globals.ts"

async function play(interaction: ChatInputCommandInteraction, id: string) {
    globals.player[interaction.guild!.id].ids.push(id)

    const data = await globals.ytdlpRequest("null", id, "null")
    if (!data) {
        return
    }

    const container = new ContainerBuilder()
        .setAccentColor(+deno.keys.accent)
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(bold("Music Player")),
            new TextDisplayBuilder()
                .setContent(`Queued: ${data.title} - ${data.author}`)
        )

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 })

    const voiceConnection = getVoiceConnection(interaction.guild!.id)
    if (voiceConnection && globals.player[interaction.guild!.id].status == 0) {
        globals.player[interaction.guild!.id].status = 1
        globals.player[interaction.guild!.id].resource = createAudioResource(data.url, {
            inlineVolume: true
        })
        globals.player[interaction.guild!.id].resource!.volume!.setVolume(globals.player[interaction.guild!.id].volume)
        globals.player[interaction.guild!.id].player.play(globals.player[interaction.guild!.id].resource!)
        voiceConnection.subscribe(globals.player[interaction.guild!.id].player)

        globals.player[interaction.guild!.id].player.on(AudioPlayerStatus.Idle, () => {
            globals.player[interaction.guild!.id].ids.shift()
            const voiceConnection = getVoiceConnection(interaction.guild!.id)
            if (globals.player[interaction.guild!.id].ids.length == 0) {
                if (voiceConnection) {
                    voiceConnection.destroy()
                }
                delete globals.player[interaction.guild!.id]
            } else {
                globals.ytdlpRequest("null", globals.player[interaction.guild!.id].ids[0], "null").then(data => {
                    if (!data) {
                        return
                    }
                    globals.player[interaction.guild!.id].resource = createAudioResource(data.url, {
                        inlineVolume: true
                    })
                    globals.player[interaction.guild!.id].resource!.volume!.setVolume(globals.player[interaction.guild!.id].volume)
                    globals.player[interaction.guild!.id].player.play(globals.player[interaction.guild!.id].resource!)
                    if (voiceConnection) {
                        voiceConnection.subscribe(globals.player[interaction.guild!.id].player)
                    }
                })
            }
        })

        globals.player[interaction.guild!.id].player.on("error", error => {
            console.error(error)
            const voiceConnection = getVoiceConnection(interaction.guild!.id)
            if (voiceConnection) {
                voiceConnection.destroy()
            }
            delete globals.player[interaction.guild!.id]
        })
    }
}

const info = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .setContexts([InteractionContextType.Guild])
    .addStringOption(option =>
        option.setName("query")
            .setDescription("Enter the video name or url")
            .setRequired(true))

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    const query = interaction.options.getString("query")!

    const voiceConnection = getVoiceConnection(interaction.guild!.id)
    
    if (!voiceConnection) {
        joinVoiceChannel({
            channelId: (interaction.member as GuildMember).voice.channelId!,
            guildId: interaction.guild!.id,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
        })
        if (!globals.player.hasOwnProperty(interaction.guild!.id)) {
            globals.player = {
                [interaction.guild!.id]: {
                    status: 0,
                    ids: [],
                    player: createAudioPlayer(),
                    volume: 0.1,
                    resource: undefined
                }
            }
        }
    }

    const ytrx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\\w\/|embed\/|shorts\/)|(?:(?:watch)?\\?vi?=|&vi?=))([^#&?]*).*/
    if (query.match(ytrx)) {
        return
    }

    const scrx = /^https?:\/\/(?:soundcloud\.com|snd\.sc)(?:\/\w+(?:-\w+)*)([^#&?]*).*/
    if (query.match(scrx)) {
        const data = await globals.ytdlpRequest(query, "null", "null")
        if (!data) return
        await play(interaction, data.id)
    } else {
        const data = await globals.ytdlpRequest("null", "null", query)
        if (!data) return
        await play(interaction, data.id)
    }
}

export { info, invoke }