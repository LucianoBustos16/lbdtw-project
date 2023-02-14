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
			const [dayNumber, monthNumber] = date.split('/')
			const prefixDate = `2023-${monthNumber}-${dayNumber}`
			
			const matchDate = new Date(`${prefixDate} ${hour} GMT+1`)
			
			const localNameRaw = $($locals[index]).text()
			const localName = cleanText(localNameRaw)
			const localImg = $($localsImages[index]).attr('src')
			


			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')

			const timestamp = hour === 'vs' ? null : matchDate.getTime()


			const hourAr = new Date(timestamp)
			const hours = hourAr.getHours()
			const minutes = "0" + hourAr.getMinutes()

			const day = hourAr.getDate()
			const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
			const month = months[hourAr.getMonth()]

			const formattedTime = hours + ':' + minutes.substr(-2)
			const formattedDate = day + ' ' + month


			matches.push({
				date: formattedDate,
				timestamp,
				hour: formattedTime === 'NaN' ? null : formattedTime,
				teams: [
					{ localImg, localName},
					{ visitantImg, visitantName }
				],
				score
			})
		})

		schedule.push({ round, matches })
	})

	return schedule
}