import { cleanText } from './utils.js'
import { TEAMS } from '../db/index.js'

const teamId = {
	'Lanus': 'Lanus',
	'Huracan': 'Huracan',
	'Rosario Central': 'Rosario-Central',
	'Belgrano': 'Belgrano',
	'River Plate': 'River',
	'Talleres (C)': 'Talleres',
	'Def y Justicia': 'Defensa-y-Justicia',
	'San Lorenzo': 'San-Lorenzo',
	'Godoy Cruz': 'Godoy-Cruz',
	'Instituto': 'Instituto',
	'Tigre': 'Tigre',
	'Platense': 'Platense',
	'Barracas Central': 'Barracas-Central',
	'Velez': 'Velez',
	'Sarmiento (J)': 'Sarmiento',	
	"Newells": 'Newells',
	'Boca Juniors': 'Boca',
	'Independiente': 'Independiente',
	'Argentinos': 'Argentinos',
	'Banfield': 'Banfield',
	'Racing Club': 'Racing-Club',
	'Union': 'Union',
	'Arsenal': 'Arsenal',
	'Estudiantes (LP)': 'Estudiantes',
	'Atl Tucuman': 'Atletico-Tucuman',
	'Central Cba (SdE)': 'Central-Cordoba',
	'Gimnasia (LP)': 'Gimnasia',
	'Colon': 'Colon',
}

const SELECTORS = {
	matchs: '#partidos #fixturein',
	competition: '.tituloin',
	partido: 'tbody tr:not(:first-child):not(.tituloin):not(.goles)',
	hour: 'tr:not(:first-child):not(.tituloin):not(.goles) td:first-child',
	locals: 'td:nth-child(2) .datoequipo',
	localsImages: 'td:nth-child(2) img',
	localScore: 'tbody tr:not(:first-child):not(.tituloin):not(.goles) .game-r1',
	visitantScore: 'tbody tr:not(:first-child):not(.tituloin):not(.goles) .game-r2',
	visitants: 'td:nth-child(5) .datoequipo',
	visitantsImages: 'td:nth-child(5) img',
}

export async function getMatchsToday($) {
	const matchstoday = []
	const $days = $(SELECTORS.matchs)

	const getTeamIdFromImageUrl = (url) => {
		return url.slice(url.lastIndexOf('/') + 1).replace(/.(png|svg|gif)/, '')
	}

	const getTeamFrom = ({ name }) => TEAMS.find(team => team.id === name)

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

			const hour = $($hours[index]).text()

			const localNameRaw = $($locals[index]).text()
			const clearlocalName = teamId[localNameRaw] ? teamId[localNameRaw] : cleanText(localNameRaw)
			const localName = getTeamFrom({ name: clearlocalName }) ? getTeamFrom({ name: clearlocalName }) : cleanText(localNameRaw)
			const localImg = $($localsImages[index]).attr('src')
			const localId = getTeamIdFromImageUrl(localImg)


			const visitantNameRaw = $($visitants[index]).text()
			const clearvisitantName = teamId[visitantNameRaw] ? teamId[visitantNameRaw] : cleanText(visitantNameRaw)
			const visitantName = getTeamFrom({ name: clearvisitantName }) ? getTeamFrom({ name: clearvisitantName }) : cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')
			const visitantId = getTeamIdFromImageUrl(visitantImg)
			

			const localScoreRaw = $($localScores[index]).text()
			const localScore = cleanText(localScoreRaw)
			const visitantScoreRaw = $($visitantScores[index]).text()
			const visitantScore = cleanText(visitantScoreRaw)

			matches.push({
				hour,
				teams: [
					{ localId, name: localName, localScore,  },
					{ visitantId, name: visitantName, visitantScore }
				],

			})
		})

		

		matchstoday.push({ competition, matches })
	})
	

	return matchstoday
}