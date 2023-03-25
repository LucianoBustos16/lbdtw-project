import * as cheerio from 'cheerio'
import { getLeaderBoardLPF } from './LPF.js'
import {getLeaderBoardLaLiga} from './LaLiga.js'
import { getNextMatch } from './nextmatch.js'
import { getSchedule } from './schedule.js'
import { getMatchsToday } from './matchstoday.js'
import { logError, logInfo, logSuccess } from './log.js'
import { writeDBFile } from '../db/index.js'

// URLS para scrapear
export const SCRAPINGS = {
    LPF: {
        url: 'https://www.promiedos.com.ar/primera',
        scraper: getLeaderBoardLPF,
    },
    LaLiga: {
      url: 'https://www.promiedos.com.ar/espana',
      scraper: getLeaderBoardLaLiga,
  },
  //   leaderboardLPF: {
  //     url: 'https://www.promiedos.com.ar/primera',
  //     scraper: getLeaderBoard,
  // },

    // nextmatch: {
    //     url: 'https://es.besoccer.com/equipo/belgrano',
    //     scraper: getNextMatch,
    // },
    schedule: {
        url: 'https://www.marca.com/futbol/argentina/calendario.html?intcmp=MENUMIGA&s_kw=futbol-argentina-calendario',
        scraper: getSchedule,
  },
    // matchstoday: {
    //   url: 'https://www.promiedos.com.ar/',
    //   scraper: getMatchsToday,
    // },

}

export const cleanText = text =>
text
    .replace(/\t|\n|\s:/g, ' ')
    .replace(/.*:/g, ' ')
    .trim()

export const cleanHour = text =>
text
    .replace(/\t|\n|\s:/g, ' ')
    // .replace(/.*:/g, ' ')
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
    console.log(url)

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

