import { ChatInputCommandInteraction, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js"
import globalsPokemon from "../globals/pokemon.ts"

const info = new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Gives you info about the specified pokemon")
    .setContexts([InteractionContextType.Guild])
    .addStringOption(option =>
        option.setName("id")
            .setDescription("Enter the pokemon name or pokedex id")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("message")
            .setDescription("Enter your message"))

async function invoke(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    const data = await globalsPokemon.request(
        interaction.options.getString("id")!.replace(" ", "-").toLowerCase(),
        undefined,
        1,
        false,
        interaction.options.getString("message")
    )

    if (!data) {
        await interaction.deleteReply()
        return
    }

    await interaction.editReply({
        components: [data],
        flags: MessageFlags.IsComponentsV2
    })
}

export { info, invoke }