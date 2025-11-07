import { ChatInputCommandInteraction, Client, Collection, SlashCommandBuilder } from "discord.js";

interface clientCollection extends Client {
	commands: Collection<string, { info: SlashCommandBuilder; invoke: (interaction: ChatInputCommandInteraction) => Promise<void> }>;
}

function invoke(client: clientCollection) {
    client.on("interactionCreate", async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;
    
        try {
            await command.invoke(interaction as ChatInputCommandInteraction);
        } catch (error) {
            console.error(error);
        }
    });
}

export { invoke };