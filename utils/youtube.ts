import { Client, EmbedBuilder } from "discord.js";
import globals from "../globals.ts";

interface resData {
    viewCount: number;
    likes: number;
    dislikes: number;
}

function invoke(client: Client) {
    client.on("messageCreate", async message => {
        if (message.author.bot || !message.content) return;

        const messageContent = message.content.replace(/(\r|\n|\r\n|<|>)/gm, " ");
    
        for (const word of messageContent.split(" ")) {
            const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\\w\/|embed\/|shorts\/)|(?:(?:watch)?\\?vi?=|&vi?=))([^#&?]*).*/;
            if (word.match(rx)) {
                const res = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${word.match(rx)![1]}`);
                if (res.ok) {
                    const data: resData = await res.json();

                    const embed = new EmbedBuilder()
                        .setColor(globals.colours.embed)
                        .setDescription(`Views: ${data.viewCount.toLocaleString()}\nLikes: ${data.likes.toLocaleString()}\nDislikes: ${data.dislikes.toLocaleString()}`)
                        .setTimestamp();

                    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                }
            }
        }
    });
}

export { invoke };