import { Client } from "discord.js"

function invoke(client: Client) {
    client.on("messageCreate", async message => {
        if (message.author.bot || !message.content) return

        const messageContent: string = message.content.replace(/(\r|\n|\r\n|<|>)/gm, " ")

        let messageReply: string = ""
        for (const word of messageContent.split(" ")) {
            if (word.match(/^http(?:s)?:\/\/(.*)bsky\.app\//) && !word.match(/^http(?:s)?:\/\/(.*)fxbsky\.app\//)) {
                if (messageReply != "") {
                    messageReply += "\n"
                }
                messageReply += word.replace(/bsky.app/gm, "fxbsky.app")
            }
            
            if (word.match(/^http(?:s)?:\/\/(.*)reddit\.com\//) && !word.match(/^http(?:s)?:\/\/(.*)rxddit\.com\//)) {
                if (messageReply != "") {
                    messageReply += "\n"
                }
                messageReply += word.replace(/reddit.com/gm, "rxddit.com")
            }

            if (word.match(/^http(?:s)?:\/\/(.*)tiktok\.com\//) && !word.match(/^http(?:s)?:\/\/(.*)vxtiktok\.com\//)) {
                if (messageReply != "") {
                    messageReply += "\n"
                }
                messageReply += word.replace(/tiktok.com/gm, "vxtiktok.com")
            }
        }

        if (messageReply != "") {
            await message.suppressEmbeds(true)
            await message.reply({ content: messageReply })
        }
    })
}

export { invoke }