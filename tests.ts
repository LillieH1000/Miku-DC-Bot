import checks from "./globals/checks.ts"
import { subDays } from "date-fns"

// Date Check

const date = new Date();

// 60 Days
console.log(`60 Days: ${checks.checkDate(subDays(date, 60))}`)
// 50 Days
console.log(`50 Days: ${checks.checkDate(subDays(date, 50))}`)
// 40 Days
console.log(`40 Days: ${checks.checkDate(subDays(date, 40))}`)
// 30 Days
console.log(`30 Days: ${checks.checkDate(subDays(date, 30))}`)
// 20 Days
console.log(`20 Days: ${checks.checkDate(subDays(date, 20))}`)
// 10 Days
console.log(`10 Days: ${checks.checkDate(subDays(date, 10))}`)
// 5 Days
console.log(`5 Days: ${checks.checkDate(subDays(date, 5))}`)
// Current Day
console.log(`Current Day: ${checks.checkDate(date)}`)