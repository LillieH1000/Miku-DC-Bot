import { Client, ContainerBuilder, Events, MessageFlags } from "discord.js"
import LZString from "lz-string"
import globalsPokemon from "../globals/pokemon.ts"

function invoke(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isStringSelectMenu()) return

        let guild: boolean = false
        let guildid: string = ""
        if (interaction.guild) {
            guild = true
            guildid = interaction.guild.id
        }

        let name: string = ""
        let message: string = ""

        if (interaction.customId.includes("custommenuid")) {
            name = interaction.customId.split("custommenuid")[0]
            message = interaction.customId.split("custommenuid")[1]
        } else {
            const id = JSON.parse(interaction.customId)
            name = id.name
            message = id.game
        }

        const data: ContainerBuilder | undefined = await globalsPokemon.pokeapiRequest(name, 1, false, false, false, guild, guildid, message)
        if (!data) return

        await interaction.update({ embeds: [], components: [data], flags: MessageFlags.IsComponentsV2 })
    })

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton()) return

        let guild: boolean = false
        let guildid: string = ""
        if (interaction.guild) {
            guild = true
            guildid = interaction.guild.id
        }

        let id
        try {
            id = JSON.parse(interaction.customId)
        } catch (e) {
            const lz: string = LZString.decompressFromUTF16(interaction.customId)
            id = JSON.parse(lz)
        }

        let mega: boolean = false
        if (id.hasOwnProperty("mega")) {
            mega = id.mega
        }

        let gmax: boolean = false
        if (id.hasOwnProperty("gmax")) {
            gmax = id.gmax
        }

        let shiny: boolean = false
        if (id.hasOwnProperty("shiny") && typeof id.shiny !== "boolean") {
            if (parseInt(id.shiny) == 0) {
                shiny = false
            }
            if (parseInt(id.shiny) == 1) {
                shiny = true
            }
        } else {
            shiny = id.shiny
        }

        const data: ContainerBuilder | undefined = await globalsPokemon.pokeapiRequest(id.name, parseInt(id.position), mega, gmax, shiny, guild, guildid, id.message)
        if (!data) return

        await interaction.update({ components: [data], flags: MessageFlags.IsComponentsV2 })
    })
}

export { invoke }