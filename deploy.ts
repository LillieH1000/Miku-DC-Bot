import deno from "./deno.json" with { type: "json" }
import { REST, Routes } from "discord.js"
import fs from "node:fs"

const commands = []
const commandFiles: string[] = fs.readdirSync("./commands").filter((file: string) => file.endsWith(".ts"))
for (const file of commandFiles) {
	const command = await import(`./commands/${file}`)
	commands.push(command.info.toJSON())
}

const rest = new REST({ version: "10" })
	.setToken(deno.keys.token)

rest.put(Routes.applicationCommands(deno.keys.client), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error)