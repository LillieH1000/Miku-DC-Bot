import { differenceInDays } from "date-fns"

function checkDate(date: Date): boolean {
    const diff = differenceInDays(new Date(), date)
    if (diff >= 0 && diff <= 30) {
        return true
    }
    return false
}

export default {
    checkDate
}