import { cleanText } from './utils.js'

const SELECTORS = {
	match: '.agendas',
	round: 'caption',
	hour: '.hora',
	locals: '.local span',
	localsImages: '.local img',
	visitants: '.visitante span',
	visitantsImages: '.visitante img',
	scores: '.resultado-partido',
	date: '.fecha'
}

const shortNames = {
	Argentinos: 'ARGJ',
	Arsenal: 'ARS',
	'Atlético-Tucumán': 'TUC',
	Banfield: 'BAN',
	'Barracas-Central': 'BAR',
	Belgrano: 'BEL',
	'Boca-Juniors': 'CABJ',
	'Central-Cordoba': 'CTR',
	Colon: 'COL',
	'Defensa-y-Justicia': 'DYJ',
	Estudiantes: 'EST',
	'Godoy-Cruz': 'GCM',
    Huracan: 'HUR',
    Independiente: 'GLP',
    Instituto: 'IACC',
    Lanus: 'LAN',
    Newells: 'NOB',
    Platense: 'PLA',
    'Racing-Club': 'RAC',
    'River-Plate': 'CARP',
    'Rosario-Central': 'ROS',
    'San-Lorenzo': 'SL',
    Sarmiento: 'SARM',
    Talleres: 'TDC',
    Tigre: 'TIG',
    Union: 'USF',
    Velez: 'VEL',

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

		const dateRaw = $day.find(SELECTORS.date).text()
		const dateAndLeagueDay = cleanText(dateRaw)
		const date = dateAndLeagueDay.trim() // 01/01/2023
		const [dayNumber, monthNumber, yearNumber] = date.split('/')
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

			const matchDate = new Date(`${prefixDate} ${hour} GMT+2`)

			const localNameRaw = $($locals[index]).text()
			const localName = cleanText(localNameRaw)
			const localImg = $($localsImages[index]).attr('src')
			let localId = getTeamIdFromImageUrl(localImg)
			const localShortName = shortNames[localId]

			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')
			let visitantId = getTeamIdFromImageUrl(visitantImg)
			const visitantShortName = shortNames[visitantId]

			const timestamp = hour === 'vs' ? null : matchDate.getTime()

			matches.push({
				timestamp,
				hour: hour === 'vs' ? null : hour,
                date,
				teams: [
					{ id: localId, name: localName, shortName: localShortName },
					{ id: visitantId, name: visitantName, shortName: visitantShortName }
				],
				score
			})
		})

		schedule.push({ matches })
	})

	return schedule
}