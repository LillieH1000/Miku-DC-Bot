import { bold, ChatInputCommandInteraction, Client, Collection, ContainerBuilder, Events, GatewayIntentBits, Guild, MessageFlags, SectionBuilder, SeparatorBuilder, SlashCommandBuilder, TextChannel, TextDisplayBuilder, ThumbnailBuilder } from "discord.js"
import fs from "node:fs"

interface clientCollection extends Client {
	commands: Collection<string, { info: SlashCommandBuilder; invoke: (interaction: ChatInputCommandInteraction) => Promise<void> }>
}

const client = new Client({
	allowedMentions: {
		parse: [],
		repliedUser: false,
		roles: [],
		users: []
	},
	intents: [
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
	]
}) as clientCollection

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

client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user!.tag}.`)

	// Bot Updates
	
	const container = new ContainerBuilder()
        .setAccentColor(+Deno.env.get("ACCENT")!)
		.addSectionComponents(
            new SectionBuilder()
				.addTextDisplayComponents(
					new TextDisplayBuilder()
						.setContent(bold("Hey everybody Miku here!")),
					new TextDisplayBuilder()
						.setContent("Just wanted to let you all know some new changes to me!")
				)
				.setThumbnailAccessory(
					new ThumbnailBuilder()
						.setURL(client.user!.displayAvatarURL())
				)
		)
		.addSeparatorComponents(
			new SeparatorBuilder()
		)
		.addTextDisplayComponents(
			new TextDisplayBuilder()
				.setContent("- I now support music using /play, you can either enter the song name or use soundcloud and bandcamp directly."),
			new TextDisplayBuilder()
				.setContent("- I am now completely open source: https://github.com/LillieH1000/Miku-DC-Bot."),
			new TextDisplayBuilder()
				.setContent("- I am now a completely public bot and free to use: https://discord.com/api/oauth2/authorize?client_id=1065377660303310859&permissions=8&scope=bot%20applications.commands.")
		)

	// Dev Server
	/* const guild: Guild | undefined = client.guilds.cache.get("1128424035173273620") as (Guild | undefined)
	const channel: TextChannel | undefined = guild?.channels.cache.get("1440059965925494804") as (TextChannel | undefined)
    channel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 }) */
	// Default Channel
	/* client.guilds.cache.forEach(guild => {
		guild.systemChannel?.send({ components: [container], flags: MessageFlags.IsComponentsV2 })
	}) */
})

client.login(Deno.env.get("TOKEN"))