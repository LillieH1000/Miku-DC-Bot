import { REST, Routes } from "discord.js"
import fs from "node:fs"

const commands = []
const commandFiles: string[] = fs.readdirSync("./commands").filter((file: string) => file.endsWith(".ts"))
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`)
	commands.push(command.info.toJSON())
}

const rest = new REST({ version: "10" })
	.setToken(Deno.env.get("TOKEN")!)

rest.put(Routes.applicationCommands(Deno.env.get("CLIENT")!), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error)