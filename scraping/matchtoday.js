import * as cheerio from 'cheerio'
import {writeFile} from 'node:fs/promises'
import path from 'node:path'

const URLS = {
    matchstoday: 'https://www.ole.com.ar/estadisticas/futbol/primera-division.html?tab=posiciones'
}

async function scrape(url) {
    const res = await fetch(url)
    const html = await res.text()
    return cheerio.load(html)
}

async function getMatchsToday() {
    const $ = await scrape(URLS.matchstoday)
    const $rows = $('.sc-976302e1-2')

    const MATCHSTODAY_SELECTORS = {
        match: '.sc-976302e1-7 .sc-976302e1-8 span',
        date: '.el-table-title',
        hour: '.fs-table-text_4',
        locals: '.el-text-1',
        localsImages: '.fs-table-text_3 img',
        visitants: '.el-text-7',
        visitantsImages: '.fs-table-text_5 img',
        scores: '.fs-table-text_8'
    }

    
    const cleanText = text => text
        .replace(/\t|\n|\s:/g, ' ')
    // .replace(/.*:/g, ' ')
    .trim()
    const matchsTodaySelectorEntries = Object.entries(MATCHSTODAY_SELECTORS)

    let matchstoday = []
    $rows.each((_, el) => {
        const matchsTodayEntries = matchsTodaySelectorEntries.map(([key, {selector, typeOf}]) => {
            const rawValue = $(el).find(selector).text()
            const cleanedValue = cleanText(rawValue)

            const value = typeOf ==='number'
            ? Number(cleanedValue)
            : cleanedValue

            return [key, value]
        })

        matchstoday.push(Object.fromEntries(matchsTodayEntries))
    })
return matchstoday
}

const matchstoday = await getMatchsToday()
const filePath = path.join(process.cwd() , './db/matchstoday.json')

 await writeFile(filePath, JSON.stringify(matchstoday, null, 2, 'utf-8'))