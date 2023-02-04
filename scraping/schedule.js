import { cleanText } from './utils.js'

const SELECTORS = {
	match: '.agendas',
	round: '.agendas caption',
	hour: '.fs-table-text_4',
	locals: '.agendas .local span',
	localsImages: '.fs-table-text_3 img',
	visitants: '.el-text-7',
	visitantsImages: '.fs-table-text_5 img',
	scores: '.fs-table-text_8'
}

const MAPS = {
	'el-bbarrio': 'el-barrio',
	'jijantes-fc': 'jijantes',
	'xbuyer-team': 'xbuyer'
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
		const dateAndLeagueDay = cleanText(dateRaw)
		console.log(dateAndLeagueDay)

		const round = dateAndLeagueDay
		const [dayNumber, monthNumber, yearNumber] = round.split('/')
		const prefixDate = `${yearNumber}-${monthNumber}-${dayNumber}`

		const $locals = $day.find(SELECTORS.locals)
		const $localsImages = $day.find(SELECTORS.localsImages)
		const $visitants = $day.find(SELECTORS.visitants)
		const $visitantsImages = $day.find(SELECTORS.visitantsImages)
		const $results = $day.find(SELECTORS.scores)
		const $hours = $day.find(SELECTORS.hour)

		$results.each((index, result) => {
			const scoreRaw = $(result).text()
			const score = cleanText(scoreRaw)

			const hourRaw = $($hours[index]).text()
			const hour = hourRaw.replace(/\t|\n|\s:/g, '').trim()

			const matchDate = new Date(`${prefixDate} ${hour} GMT-3`)

			const localNameRaw = $($locals[index]).text()
			const localName = cleanText(localNameRaw)
			console.log(localName)
			const localImg = $($localsImages[index]).attr('src')
			let localId = getTeamIdFromImageUrl(localImg)
			localId = MAPS[localId] || localId
			const localShortName = shortNames[localId]

			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')
			let visitantId = getTeamIdFromImageUrl(visitantImg)
			visitantId = MAPS[visitantId] || visitantId
			const visitantShortName = shortNames[visitantId]

			const timestamp = hour === 'vs' ? null : matchDate.getTime()

			matches.push({
				timestamp,
				hour: hour === 'vs' ? null : hour,
				teams: [
					{ id: localId, name: localName, shortName: localShortName },
					{ id: visitantId, name: visitantName, shortName: visitantShortName }
				],
				score
			})
		})

		schedule.push({ round, matches })
	})

	return schedule
}