import { cleanText } from './utils.js'
import { TEAMS } from '../db/index.js'

const shortNames = {
	'2473': 'Lanus',
	'2578': 'Huracan',
	'745': 'Rosario-Central',
	'1313': 'Belgrano',
	'608': 'River',
	'1071': 'Talleres',
	'8625': 'Defensa-y-Justicia',
	'2549': 'San-Lorenzo',
	'2834': 'Godoy-Cruz',
	'3638': 'Instituto',
	'2580': 'Tigre',
	'3579': 'Platense',
	'9280': 'Barracas-Central',
	'570': 'Velez',
	'8629': 'Sarmiento',	
	'1095': 'Newells',
	'540': 'Boca',
	'1243': 'Independiente',
	'846': 'Argentinos',
	'2451': 'Banfield',
	'986': 'Racing-Club',
	'6374': 'Union',
	'2577': 'Arsenal',
	'927': 'Estudiantes',
	'4671': 'Atletico-Tucuman',
	'10752': 'Central-Cordoba',
	'1392': 'Gimnasia-La-Plata',
	'1027': 'Colon',



}

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

	const getTeamIdFromImageUrl = (url) => {
		return url.slice(url.lastIndexOf('/') + 1).replace(/.(png|svg)/, '')
	}

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
			const localId = getTeamIdFromImageUrl(localImg)
			const localShortName = shortNames[localId]


			const visitantNameRaw = $($visitants[index]).text()
			const visitantName = cleanText(visitantNameRaw)
			const visitantImg = $($visitantsImages[index]).attr('src')
			const visitantId = getTeamIdFromImageUrl(visitantImg)
			const visitantShortName = shortNames[visitantId]

			const timestamp = hour === 'vs' ? null : matchDate.getTime()
			console.log(timestamp)


			const hourAr = new Date(timestamp)
			const hours = hourAr.getHours()
			const minutes = "0" + hourAr.getMinutes()

			const day = hourAr.getDate()
			const months = ['Ene','Feb	','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
			const month = months[hourAr.getMonth()]

			const formattedTime = hours + ':' + minutes.substr(-2)
			const formattedDate = day + ' ' + month
			
			matches.push({
				date: formattedDate,
				timestamp,
				hour: formattedTime === 'NaN' ? null : formattedTime,
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