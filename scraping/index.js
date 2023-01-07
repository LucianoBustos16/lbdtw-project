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
    const $rows = $('.tablesorter1 tbody tr')



    const LEADERBOARD_SELECTORS = {
        team: {selector: 'td:nth-child(2)', typeOf: 'string'},
        gamesPlayed: {selector: 'td:nth-child(4)', typeOf: 'number'},
        won: {selector: 'td:nth-child(5)', typeOf: 'number'},
        drawn: {selector: 'td:nth-child(6)', typeOf: 'number'},
        lost: {selector: 'td:nth-child(7)', typeOf: 'number'},
        goalsScored: {selector: 'td:nth-child(8)', typeOf: 'number'},
        goalsAgainst: {selector: 'td:nth-child(9)', typeOf: 'number'},
        goalsDiff: {selector: 'td:nth-child(10)', typeOf: 'number'}

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