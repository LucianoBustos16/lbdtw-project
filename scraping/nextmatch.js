import * as cheerio from 'cheerio'
import {writeFile} from 'node:fs/promises'
import path from 'node:path'

const URLS = {
    nextmatch: 'https://es.besoccer.com/equipo/partidos/belgrano'
}

async function scrape(url) {
    const res = await fetch(url)
    const html = await res.text()
    return cheerio.load(html)
}

async function getNextMatch() {
    const $ = await scrape(URLS.nextmatch)
    const $rows = $('#mod_detail_team_matches_on .match-list-new div:nth-child(2) .panel-body .match-link a ')

    const NEXTMATCH_SELECTORS = {
        live: {selector: '.info-head .match-status-label .live', typeOf: 'string'},
        competition: {selector: '.info-head .middle-info', typeOf: 'string'},
        teamLocal: {selector: 'div:nth-child(2) .team-name .name', typeOf: 'string'},
        teamVisitant: {selector: 'div:nth-child(4) .team-name .name', typeOf: 'string'},
        marker: {selector: '.marker .match_hour', typeOf: 'string'},
        goalsLocal: {selector: '.marker .green .r1', typeOf: 'number'},
        goalsVisitant: {selector: '.marker .green .r2', typeOf: 'number'},
        date: {selector: '.date', typeOf: 'string'},
    }

    const cleanText = text => text
        .replace(/\t|\n|\s:/g, ' ')
    // .replace(/.*:/g, ' ')
    .trim()
    const nextMatchSelectorEntries = Object.entries(NEXTMATCH_SELECTORS)

    let nextmatch = []
    $rows.each((_, el) => {
        const nextMatchEntries = nextMatchSelectorEntries.map(([key, {selector, typeOf}]) => {
            const rawValue = $(el).find(selector).text()
            const cleanedValue = cleanText(rawValue)

            const value = typeOf ==='number'
            ? Number(cleanedValue)
            : cleanedValue

            return [key, value]
        })

        nextmatch.push(Object.fromEntries(nextMatchEntries))
    })
return nextmatch
}

const nextmatch = await getNextMatch()
const filePath = path.join(process.cwd() , './db/nextmatch.json')

 await writeFile(filePath, JSON.stringify(nextmatch, null, 2, 'utf-8'))