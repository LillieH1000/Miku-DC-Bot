import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js"
import globals from "../globals.ts"

const info = new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Gives you info about the specified pokemon")
    .addStringOption(option =>
        option.setName("name")
            .setDescription("Enter the pokemon name")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("form")
            .setDescription("Enter the pokemon form")
            .addChoices(
                { name: "Alola", value: "alola" },
                { name: "Galar", value: "galar" },
                { name: "Hisui", value: "hisui" },
                { name: "Paldea", value: "paldea" }
            ))
    .addStringOption(option =>
        option.setName("message")
            .setDescription("Enter your message"))

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    const name = interaction.options.getString("name")!
    const form = interaction.options.getString("form")
    const message = interaction.options.getString("message")

    let guild = false
    let guildid = ""
    if (interaction.guild) {
        guild = true
        guildid = interaction.guild.id
    }

    let pokemon = ""
    if (form == "alola") {
        pokemon = name + "-alola"
    } else if (form == "galar") {
        pokemon = name + "-galar"
    } else if (form == "hisui") {
        pokemon = name + "-hisui"
    } else if (form == "paldea") {
        pokemon = name + "-paldea"
    } else {
        pokemon = name
    }

    const data = await globals.pokeapiRequest(pokemon.replace(" ", "-").toLowerCase(), 1, false, false, false, guild, guildid, message)
    if (!data) return

    await interaction.editReply({ components: [data], flags: MessageFlags.IsComponentsV2 })
}

export { info, invoke }