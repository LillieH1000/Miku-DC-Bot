import { REST, Routes } from "discord.js";
import fs from "node:fs";

interface configData {
	default: {
		client: string;
		token: string;
	};
}

const config: configData = await import("./config.json", {
	with: {
		type: "json"
	}
});

const commands = [];
const commandFiles: string[] = fs.readdirSync("./commands").filter((file: string) => file.endsWith(".ts"));
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	commands.push(command.info.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.default.token);

rest.put(Routes.applicationCommands(config.default.client), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);