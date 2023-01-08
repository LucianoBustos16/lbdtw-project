import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const URLS = {
    leaderboard: 'https://www.promiedos.com.ar/primera'
}

async function scrape (url) {
    const res = await fetch(url)
    const html = await res.text()
    return cheerio.load(html)
  }

async function getLeaderBoard () {
    const $ = await scrape(URLS.leaderboard)
    const $rows = $('table.tablesorter1 tbody tr')



    const LEADERBOARD_SELECTORS = {
        rank: {selector: 'td:nth-child(1)', typeOf: 'number'},
        teamName: {selector: 'td:nth-child(2)', typeOf: 'string'},
        points: {selector: 'td:nth-child(3)', typeOf: 'number'},
        matchesPlayed: {selector: 'td:nth-child(4)', typeOf: 'number'},
        matchesWon: {selector: 'td:nth-child(5)', typeOf: 'number'},
        matchesDrawn: {selector: 'td:nth-child(6)', typeOf: 'number'},
        matchesLost: {selector: 'td:nth-child(7)', typeOf: 'number'},
        goalsFor: {selector: 'td:nth-child(8)', typeOf: 'number'},
        goalsAgainst: {selector: 'td:nth-child(9)', typeOf: 'number'},
        goalDifference: {selector: 'td:nth-child(10)', typeOf: 'number'}

    }

    const cleanText = text => text
    .replace(/\t|\n|\s:/g, ' ')
    .replace(/.*:/g, ' ')
    .trim()
    

    const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

    let leaderboard = []
    $rows.each((_, el) => {
        const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
          const rawValue = $(el).find(selector).text()
          const cleanedValue = cleanText(rawValue)
    
          const value = typeOf === 'number'
            ? Number(cleanedValue)
            : cleanedValue
    
          return [key, value]
        })

        leaderboard.push(Object.fromEntries(leaderBoardEntries))        
        })

        return leaderboard
    }


const leaderboard = await getLeaderBoard()
const filePath = path.join(process.cwd(), './db/leaderboard.json')

await writeFile(filePath, JSON.stringify(leaderboard, null, 2), 'utf-8')