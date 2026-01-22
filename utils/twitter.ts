import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, Client, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js"

interface resData {
    tweet: {
        url: string
        text: string
        author: {
            name: string
            screen_name: string
            avatar_url: string
        }
        media?: {
            all: [{
                url: string
            }]
        }
    }
}

function invoke(client: Client) {
    client.on("messageCreate", async message => {
        if (message.author.bot || !message.content) return

        const messageContent: string = message.content.replace(/(\r|\n|\r\n|<|>)/gm, " ")
    
        for (const word of messageContent.split(" ")) {
            const rx: RegExp = /^(.*?)(?:fxtwitter|twitter|vxtwitter|x)\.com(.*)/gm
            if (!word.match(rx)) continue

            const res: Response = await fetch(word.replace(rx, "$1api.fxtwitter.com$2"))
            if (!res.ok) continue
            const data: resData = await res.json()
            
            const container: ContainerBuilder = new ContainerBuilder()
                .setAccentColor(+Deno.env.get("ACCENT")!)

            const section: SectionBuilder = new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(bold(`${data.tweet.author.name} (${data.tweet.author.screen_name})`)),
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(data.tweet.author.avatar_url)
                )

            if (data.tweet.text != "") {
                section.addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(data.tweet.text),
                )
            }

            container.addSectionComponents(section).addSeparatorComponents(
                new SeparatorBuilder()
            )

            if (data.tweet.media) {
                const gallery: MediaGalleryBuilder = new MediaGalleryBuilder()

                data.tweet.media.all.forEach(media => {
                    gallery.addItems(new MediaGalleryItemBuilder().setURL(media.url))
                })

                container.addMediaGalleryComponents(gallery).addSeparatorComponents(
                    new SeparatorBuilder()
                )
            }

            container.addActionRowComponents(new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Open Tweet")
                        .setStyle(ButtonStyle.Link)
                        .setURL(data.tweet.url)
                ))

            await message.suppressEmbeds(true)
            await message.reply({ components: [container], flags: MessageFlags.IsComponentsV2 })
        }
    })
}

export { invoke }