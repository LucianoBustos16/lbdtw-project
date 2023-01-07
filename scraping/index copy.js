import * as cheerio from 'cheerio'

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
    const $rows = $('#tablapts .tablesorter1 > tbody > tr')

    const LEADERBOARD_SELECTORS = {
        team: tds[1],
        points: 'tds[2]',
        gamesPlayed: 'tds[3]',
        won: 'tds[4]',
        drawn: 'tds[5]',
        lost: 'tds[6]',
        goalsScored: 'tds[7]',
        goalsAgainst: 'tds[8]',
        goalsDiff: 'tds[9]'

    }

    const cleanText = text => text
    .replace(/\t|\n|\s:/g, ' ')
    .replace(/.*:/g, ' ')
    

    const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

    $rows.each((index, el) => {
        const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, selector]) => {
            const rawValue = $(el).find(selector).text()
            const value = cleanText(rawValue)
            return [key, value]
        })
        
        console.log(Object.fromEntries(leaderBoardEntries))
        
        })
    }


await getLeaderBoard()