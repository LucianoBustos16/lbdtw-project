import { cleanText } from './utils.js'

const SELECTORS = {
	match: '.calendarioInternacional',
	round: 'caption',
	date: '.resultado .fecha',
	hour: '.hora',
	locals: '.local span',
	localsImages: '.local img',
	scores: '.resultado-partido',
	visitants: '.visitante span',
	visitantsImages:  '.visitante img'	
}

export async function getSchedule($) {
	const schedule = []
	const $days = $(SELECTORS.match)

	const getTeamIdFromImageUrl = (url) => {
		return url.slice(url.lastIndexOf('/') + 1).replace(/.(png|svg)/, '')
	}

	$days.each((_, day) => {
		const matches = []
		const $day = $(day)

		const dateRaw = $day.find(SELECTORS.round).text()
		const round = cleanText(dateRaw)

		const $locals = $day.find(SELECTORS.locals)
		const $localsImages = $day.find(SELECTORS.localsImages)
		const $visitants = $day.find(SELECTORS.visitants)
		const $visitantsImages = $day.find(SELECTORS.visitantsImages)
		const $results = $day.find(SELECTORS.scores)
		const $hours = $day.find(SELECTORS.hour)
		const $date = $day.find(SELECTORS.date)

		$results.each((index, result) => {
			const scoreRaw = $(result).text()
			const score = cleanText(scoreRaw)
			console.log(score)
			
			const hourRaw = $($hours[index]).text()
			const hour = hourRaw.replace(/\t|\n|\s:/g, '').trim()

			const dateRaw = $($date[index]).text()
			const date = dateRaw.replace(/\t|\n|\s:/g, '').trim()

			
			const matchDate = new Date(`${date} ${hour} GMT-3`)


			const localNameRaw = $($locals[index]).text()
			const localName = cleanText(localNameRaw)
			const localImg = $($localsImages[index]).attr('src')
			


			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')



			const timestamp = hour === '' ? null : matchDate.getTime()
			


			matches.push({
				timestamp,
				hour: hour === 'vs' ? null : hour,
				teams: [
					{ img: localImg, name: localName},
					{ img: visitantImg, name: visitantName }
				],
				score
			})
		})

		schedule.push({ round, matches })
	})

	return schedule
}