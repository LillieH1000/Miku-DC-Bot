import { Client, ContainerBuilder, Events, MessageFlags, TextDisplayBuilder } from "discord.js"

interface resData {
    viewCount: number
    likes: number
    dislikes: number
}

function invoke(client: Client) {
    client.on(Events.MessageCreate, async message => {
        if (message.author.bot || !message.content) return

        const messageContent: string = message.content.replace(/(\r|\n|\r\n|<|>)/gm, " ")
    
        for (const word of messageContent.split(" ")) {
            const rx: RegExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\\w\/|embed\/|shorts\/)|(?:(?:watch)?\\?vi?=|&vi?=))([^#&?]*).*/
            if (!word.match(rx)) continue
            
            const res: Response = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${word.match(rx)![1]}`)
            if (!res.ok) continue
            const data: resData = await res.json()
            
            const container: ContainerBuilder = new ContainerBuilder()
                .setAccentColor(+Deno.env.get("ACCENT")!)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`Views: ${data.viewCount.toLocaleString()}`),
                    new TextDisplayBuilder()
                        .setContent(`Likes: ${data.likes.toLocaleString()}`),
                    new TextDisplayBuilder()
                        .setContent(`Dislikes: ${data.dislikes.toLocaleString()}`)
                )

            await message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
    })
}

export { invoke }