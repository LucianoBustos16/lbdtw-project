import * as cheerio from 'cheerio'
import { getLeaderBoard } from './leaderboard.js'
import { getNextMatch } from './nextmatch.js'
import { getSchedule } from './schedule.js'
import { logError, logInfo, logSuccess } from './log.js'
import { writeDBFile } from '../db/index.js'

// URLS para scrapear
export const SCRAPINGS = {
    leaderboard: {
        url: 'https://www.promiedos.com.ar/primera',
        scraper: getLeaderBoard,
    },

    nextmatch: {
        url: 'https://es.besoccer.com/equipo/partidos/belgrano',
        scraper: getNextMatch,
    },
  //   schedule: {
  //     url: 'https://ar.marca.com/claro/futbol/primera-division/fixture.html',
  //     scraper: getSchedule,
  // },

}

export const cleanText = text =>
text
    .replace(/\t|\n|\s:/g, ' ')
    .replace(/.*:/g, ' ')
    .trim()

export async function scrape(url) {
    const res = await fetch(url)  // Recuperamos el HTML
    const html = await res.text() // Lo transformamos en string
    return cheerio.load(html)
} 

export async function scrapeAndSave(name){
    const start = performance.now()
   try { 
    const { scraper, url } = SCRAPINGS[name]
    logInfo(`Scraping [${name}]...`)
    const $ = await scrape(url)
    const content = await scraper($)
    logSuccess(`[${name}] scraped successfully`)

    logInfo(`Writting [${name}] to database...`)

    await writeDBFile(name, content)

    logSuccess(`[${name}] written successfully`)
  } catch (e) {
    logError(e)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    logInfo (`[${name}] scraped in ${time} seconds`)
  }
}

