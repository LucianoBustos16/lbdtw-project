import { cleanText, cleanHour } from './utils.js'

const SELECTORS = {
	matchs: '.evsc__ct .evsc__group.is-football',
	competition: '.evsc__group__tl',
	partido: '.evsc__i',
	date: '.resultado .fecha',
	hour: '.evsc__i__info',
	locals: 'a .evsc__team:nth-child(1) .evsc__team__name',
	localsImages: 'a .evsc__team:nth-child(1) img',
	localScore: 'a .evsc__team:nth-child(1) .evsc__team__scr',
	visitantScore: 'a .evsc__team:nth-child(2) .evsc__team__scr',
	visitants: 'a .evsc__team:nth-child(2) .evsc__team__name',
	visitantsImages: 'a .evsc__team:nth-child(2)  img',
	// scores: 'tr td:nth-child(2) .pepito ',
}

export async function getMatchsToday($) {
	const matchstoday = []
	const $days = $(SELECTORS.matchs)

	// const getTeamIdFromImageUrl = (url) => {
	// 	return url.slice(url.lastIndexOf('/') + 1).replace(/.(png|svg)/, '')
	// }

	$days.each((_, day) => {
		const matches = []
		const $day = $(day)

		const competitionRaw = $day.find(SELECTORS.competition).text()
		const competition = cleanText(competitionRaw)

		const $locals = $day.find(SELECTORS.locals)
		const $localsImages = $day.find(SELECTORS.localsImages)
		const $visitants = $day.find(SELECTORS.visitants)
		const $visitantsImages = $day.find(SELECTORS.visitantsImages)
		const $horarios = $day.find(SELECTORS.partido)
		const $hours = $day.find(SELECTORS.hour)

		const $localScores = $day.find(SELECTORS.localScore)
		const $visitantScores = $day.find(SELECTORS.visitantScore)

		$horarios.each((index, horario) => {
			const score = $(horario).text()

			const hourRaw = $($hours[index]).text()
			const hour = cleanHour(hourRaw)

			const localNameRaw = $($locals[index]).text()
			const localName = cleanText(localNameRaw)
			const localImg = $($localsImages[index]).attr('src')
			// const localId = getTeamIdFromImageUrl(localImg)

			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')
			// const visitantId = getTeamIdFromImageUrl(visitantImg)

			const localScoreRaw = $($localScores[index]).text()
			const localScore = cleanText(localScoreRaw)
			const visitantScoreRaw = $($visitantScores[index]).text()
			const visitantScore = cleanText(visitantScoreRaw)

			matches.push({
				hour,
				teams: [
					{ localImg, name: localName, localScore,  },
					{ visitantImg, name: visitantName, visitantScore }
				],
				// score
			})
		})

		matchstoday.push({ competition, matches })
	})

	return matchstoday
}