import { cleanText} from './utils.js'

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

export async function getSchedule ($) {
	// const $ = await scrape(URLS.schedule)
	const $rows = $('.jor tbody tr')


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
