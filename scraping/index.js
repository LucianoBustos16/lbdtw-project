import * as cheerio from 'cheerio'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)

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
        team: {selector: 'td:nth-child(2)', typeOf: 'string'},
        points: {selector: 'td:nth-child(3)', typeOf: 'number'},
        matchesPlayed: {selector: 'td:nth-child(4)', typeOf: 'number'},
        matchesWon: {selector: 'td:nth-child(5)', typeOf: 'number'},
        matchesDrawn: {selector: 'td:nth-child(6)', typeOf: 'number'},
        matchesLost: {selector: 'td:nth-child(7)', typeOf: 'number'},
        goalsFor: {selector: 'td:nth-child(8)', typeOf: 'number'},
        goalsAgainst: {selector: 'td:nth-child(9)', typeOf: 'number'},
        goalDifference: {selector: 'td:nth-child(10)', typeOf: 'number'}

    }

    const getTeamFrom = ({ name }) => TEAMS.find(team => team.name === name)

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

        const { team: teamName, ...leaderBoardForTeam } = Object.fromEntries(leaderBoardEntries)
        const team = getTeamFrom ({ name: teamName })
        

        leaderboard.push({
            ...leaderBoardForTeam,
            team
        }
        )        
        })

        return leaderboard
    }


const leaderboard = await getLeaderBoard()

await writeFile(`${DB_PATH}/leaderboard.json`, JSON.stringify(leaderboard, null, 2), 'utf-8')