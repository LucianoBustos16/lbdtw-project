import * as cheerio from 'cheerio'
import {writeFile} from 'node:fs/promises'
import path from 'node:path'

const URLS = {
	schedule: 'https://ar.marca.com/claro/futbol/primera-division/fixture.html'
}

async function scrape (url) {
	const res = await fetch(url)
	const html = await res.text()
	return cheerio.load(html)
}

async function getSchedule () {
	const $ = await scrape(URLS.schedule)
	const $rows = $('.jor tbody tr')

	const SELECTORS = {
		round: {selector: '.jor caption', typeOf: 'string'},
		date: {selector: '.resultado .fecha', typeOf: 'date'},
		hour: {selector: '.hora', typeOf: 'date'},
		locals: {selector: '.local span', typeOf: 'string'},
		localsImages: {selector: '.local img', typeOf: 'string'},
		scores: {selector: '.resultado-partido', typeOf: 'string'},
		visitants: {selector: '.visitante span', typeOf: 'string'},
		visitantsImages:  {selector: '.visitante img', typeOf: 'string'}	
	}
	

	const cleanText = text => text
    .replace(/\t|\n|\s:/g, ' ')
    .trim() 

	const scheduleSelectorEntries = Object.entries(SELECTORS)

	let schedule = []
	$rows.each((_, el) => {
		const scheduleEntries = scheduleSelectorEntries.map(([key, {selector, typeOf}]) => {
			const rawValue = $(el).find(selector).text()
			const cleanedValue = cleanText (rawValue)

			const value = typeOf === 'number'
			? Number(cleanText)
			: cleanedValue

			return [key, value]
		})
		schedule.push(Object.fromEntries(scheduleEntries))
	})

	return schedule
}

const schedule = await getSchedule ()

const filePatch = path.join(process.cwd(), './db/schedule.json')

await writeFile(filePatch, JSON.stringify(schedule, null, 2, 'utf-8' ))

 