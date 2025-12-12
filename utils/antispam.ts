import { Client } from "discord.js"

function invoke(client: Client) {
    client.on("messageCreate", async message => {
        if (message.author.bot || !message.content) return
    })
}

export { invoke }