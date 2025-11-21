import { ChatInputCommandInteraction, Client, Collection, GatewayIntentBits, SlashCommandBuilder } from "discord.js"
import deno from "./deno.json" with { type: "json" }
import fs from "node:fs"

interface clientCollection extends Client {
	commands: Collection<string, { info: SlashCommandBuilder; invoke: (interaction: ChatInputCommandInteraction) => Promise<void> }>
}

const client = new Client({ intents: [
	GatewayIntentBits.AutoModerationConfiguration,
	GatewayIntentBits.AutoModerationExecution,
	GatewayIntentBits.DirectMessagePolls,
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.DirectMessageTyping,
	GatewayIntentBits.GuildExpressions,
	GatewayIntentBits.GuildIntegrations,
	GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessagePolls,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildScheduledEvents,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.MessageContent
]}) as clientCollection

client.commands = new Collection()

const commandFiles: string[] = fs.readdirSync("./commands").filter((file: string) => file.endsWith(".ts"))

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`)
	client.commands.set(command.info.name, command)
}

const utilsFiles: string[] = fs.readdirSync("./utils").filter((file: string) => file.endsWith(".ts"))

for (const file of utilsFiles) {
	const utils = await import(`./utils/${file}`)
	utils.invoke(client)
}

client.once("clientReady", () => {
	if (client.user) console.log(`Logged in as ${client.user.tag}`)
	client.guilds.cache.forEach(guild => {
		console.log(`${guild.name} - ${guild.id}`)
	})
})

client.login(deno.keys.token)