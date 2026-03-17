import { Client, ContainerBuilder, Events, MessageFlags } from "discord.js"
import LZString from "lz-string"
import globalsPokemon from "../globals/pokemon.ts"

interface customId {
    name: string
    species?: string
    position: number
    shiny: boolean | number
    message: string | null
    game: string | null
}

function invoke(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isStringSelectMenu()) return

        let id: customId

        if (interaction.customId.includes("custommenuid")) {
            id = {
                name: interaction.customId.split("custommenuid")[0],
                species: undefined,
                position: 1,
                shiny: false,
                message: interaction.customId.split("custommenuid")[1],
                game: null
            }
        } else {
            try {
                id = JSON.parse(interaction.customId)
            } catch (_) {
                const lz: string = LZString.decompressFromUTF16(interaction.customId)
                id = JSON.parse(lz)
            }

            if (id.game) {
                id.species = undefined
                id.position = 1
                id.shiny = false
                id.message = id.game
            } else {
                id.species = interaction.values[0]
            }
        }

        const data: ContainerBuilder | undefined = await globalsPokemon.request(
            id.name,
            id.species,
            id.position,
            !!id.shiny,
            interaction.guild!.id,
            id.message
        )
        if (!data) return

        await interaction.update({
            components: [data],
            embeds: [],
            flags: MessageFlags.IsComponentsV2
        })
    })

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return

        let id: customId
        try {
            id = JSON.parse(interaction.customId)
        } catch (_) {
            const lz: string = LZString.decompressFromUTF16(interaction.customId)
            id = JSON.parse(lz)
        }

        const data: ContainerBuilder | undefined = await globalsPokemon.request(
            id.name,
            id.species,
            id.position,
            !!id.shiny,
            interaction.guild!.id,
            id.message
        )
        if (!data) return

        await interaction.update({
            components: [data],
            embeds: [],
            flags: MessageFlags.IsComponentsV2
        })
    })
}

export { invoke }