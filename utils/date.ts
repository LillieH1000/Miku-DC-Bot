import { Client, Guild, TextChannel } from "discord.js";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

function invoke(client: Client) {
    // Town Of Salem Server
    setInterval(async function() {
        const guild = client.guilds.cache.get("416350699794857986") as Guild;
        const channel = guild?.channels.cache.get("772878026521182248") as TextChannel;
        const date = TZDate.tz("America/New_York");
        const formatteddate = format(date, "MMMM d, yyyy");
        await channel?.setName(`Date: ${formatteddate}`);
    }, 60000);
}

export { invoke };