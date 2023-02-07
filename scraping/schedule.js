import { cleanText } from './utils.js'

const SELECTORS = {
	match: '.agendas',
	round: 'caption',
	date: '.resultado .fecha',
	hour: '.hora',
	locals: '.local span',
	localsImages: '.local img',
	scores: '.resultado',
	visitants: '.visitante span',
	visitantsImages:  '.visitante img'	
}

export async function getSchedule($) {
	const schedule = []
	const $rounds = $(SELECTORS.match)

	$rounds.each((_, ronda) => {
		const matches = []
		const $ronda = $(ronda)

		const roundRaw = $ronda.find(SELECTORS.round).text()
		const round = cleanText(roundRaw)

		const $locals = $ronda.find(SELECTORS.locals)
		const $localsImages = $ronda.find(SELECTORS.localsImages)
		const $visitants = $ronda.find(SELECTORS.visitants)
		const $visitantsImages = $ronda.find(SELECTORS.visitantsImages)
		const $results = $ronda.find(SELECTORS.scores)
		const $hours = $ronda.find(SELECTORS.hour)
		const $date = $ronda.find(SELECTORS.date)
		
		$results.each((index, result) => {
			const scoreRaw = $(result).text()
			const score = cleanText(scoreRaw)
			
			const hourRaw = $($hours[index]).text()
			const hour = hourRaw.replace(/\t|\n|\s:/g, '').trim()


			const dateRaw = $($date[index]).text()
			const date = dateRaw.replace(/\t|\n|\s:/g, '').trim()

			
			const localNameRaw = $($locals[index]).text()
			const localName = cleanText(localNameRaw)
			const localImg = $($localsImages[index]).attr('src')
			


			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')


		
			matches.push({
				date,
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