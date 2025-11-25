import { ActivityType, Client } from "discord.js"
import { TZDate } from "@date-fns/tz"
import { format } from "date-fns"

let hour: number

function invoke(client: Client) {
    setInterval(function() {
        if (client.user) {
            const date: TZDate = TZDate.tz("America/New_York")
            const currentdate: number = parseInt(format(date, "e"))
            const currenthour: number = parseInt(format(date, "h"))
            if (currentdate == 2) {
                hour = -1
                client.user.setActivity("It's Miku monday", { type: ActivityType.Custom })
            } else {
                if (hour != currenthour) {
                    hour = currenthour
                    const statuses: string[] = ["Miku gang", "oo ee oo", "I'm thinking Miku", "Hits u with a pipe"]
                    const status: string = statuses[Math.floor(Math.random() * statuses.length)]
                    client.user.setActivity(status, { type: ActivityType.Custom })
                }
            }
        }
    }, 60000)
}

export { invoke }