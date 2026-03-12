import { Client, ContainerBuilder, Events, MessageFlags } from "discord.js"
import LZString from "lz-string"
import globalsPokemon from "../globals/pokemon.ts"

interface customId {
    name: string
    species?: string
    position: number
    shiny: boolean | number
    message: string | null
}

function invoke(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isStringSelectMenu()) return

        let id: customId
        try {
            id = JSON.parse(interaction.customId)
        } catch (_) {
            const lz: string = LZString.decompressFromUTF16(interaction.customId)
            id = JSON.parse(lz)
        }

        const data: ContainerBuilder | undefined = await globalsPokemon.request(
            id.name,
            interaction.values[0],
            id.position,
            !!id.shiny,
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