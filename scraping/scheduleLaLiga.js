import { cleanText } from './utils.js'
import { TEAMS } from '../db/index.js'

const teamId = {
	'450': 'Osasuna',
	'179': 'Sevilla',
	'176': 'Celta',
	'177': 'Espanyol',
	'192': 'Valladolid',
	'449': 'Villareal',
	'178': 'Barcelona',
	'184': 'Rayo-Vallecano',
	'1737': 'Cadiz',
	'188': 'Real-Sociedad',
	'191': 'Valencia',
	'2893': 'Girona',
	'1564': 'Almeria',
	'186': 'Real-Madrid',
	'174': 'Athletic-Bilbao',
	'181': 'Mallorca',
	'1450': 'Getafe',
	'175': 'Atletico-Madrid',
	'185': 'Betis',
	'954': 'Elche',
	'173': 'Alaves',
	'5683': 'Granada',
	'407' : 'Las-Palmas',
}

const SELECTORS = {
	match: '.agendas',
	round: 'caption',
	date: '.resultado .fecha',
	hour: '.resultado',
	locals: '.local span',
	localsImages: '.local img',
	scores: '.resultado ',
	visitants: '.visitante span',
	visitantsImages: '.visitante img'
}

export async function getScheduleLaLiga($) {
	const schedule = []
	const $rounds = $(SELECTORS.match)

	const getTeamIdFromImageUrl = (url) => {
		return url.slice(url.lastIndexOf('/') + 1).replace(/.(png|svg)/, '')
	}

	$rounds.each((index, ronda) => {
		const matches = []
		const $ronda = $(ronda)

		const $localsImages = $ronda.find(SELECTORS.localsImages)
		const $visitantsImages = $ronda.find(SELECTORS.visitantsImages)
		const $results = $ronda.find(SELECTORS.scores)
		const $hours = $ronda.find(SELECTORS.hour)
		const $date = $ronda.find(SELECTORS.date)

		$results.each((index, result) => {
			const scoreRaw = $(result).text()
			const score = cleanText(scoreRaw)

			const hourRaw = $($hours[index]).text()
			const fechaHora = hourRaw.length > 0 ? hourRaw.replace(/\t|\n|\s:/g, '').trim() : null
			const separado = fechaHora.split(" ")
			const dateRaw = separado[0]
			const hour = separado[1] + ':00'

			const date = dateRaw.replace(/\t|\n|\s:/g, '').trim()
			const [dayNumber, monthNumber] = date.split('/')
			const prefixDate = `2023-${monthNumber}-${dayNumber}`
			
			const localImg = $($localsImages[index]).attr('src')
			const localId = getTeamIdFromImageUrl(localImg)
			const localShortName = teamId[localId]

			const visitantImg = $($visitantsImages[index]).attr('src')
			const visitantId = getTeamIdFromImageUrl(visitantImg)
			const visitantShortName = teamId[visitantId]

			const matchDate = new Date(`${prefixDate} ${hour} GMT+2`)
			const timestamp = Date.parse(matchDate)		
			
			const horario = new Date(timestamp);
            const optionsHours = {
                timeZone: "America/Argentina/Buenos_Aires",
                hour12: false, // Opcional, para mostrar la hora en formato de 24 horas,
              }

			  const optionsDay = {
                weekday: 'long',
              }

            const hourAr = horario.toLocaleString("es-AR", optionsHours)
            const [fecha, horaCompleta] = hourAr.split(" ");
            const [hora, minutos, segundos] = horaCompleta.split(":");
            const hourMatch = (`${hora}:${minutos}`)

			const hourArgTimeStamp = horario.getTime() - (3 * 60 * 60 * 1000); // Restamos 3 horas para ajustar a GMT+3
			const dateArg = new Date(hourArgTimeStamp);


			const weekDay = dateArg.toLocaleDateString("es-AR", optionsDay)

			const [day, month] = fecha.split("/")

			const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
			const monthServer = months[horario.getMonth()]

			const formattedDate = day + ' ' + monthServer


			
			const getTeamFrom = ({ name }) => TEAMS.find(team => team.teamId === name)
			const localTeam = TEAMS.find(team => team.id === localShortName)
			const visitantTeam = TEAMS.find(team => team.id === visitantShortName)
			

			const team = getTeamFrom({ name: localTeam, name: visitantTeam })

			console.log(localTeam)
			
			matches.push({
				formattedDate: formattedDate,
				timestamp: timestamp,
				hourMatch: hourMatch === 'NaN:aN' ? score : hourMatch,
				teams: [
					{
						id: localId,
						name: team,
						shortName: localShortName,
						...localTeam
					},
					{
						id: visitantId,
						name: team,
						shortName: visitantShortName,
						...visitantTeam
					}
				],
				score
			})
		})

		schedule.push({
			fecha: index + 1,
			matches
		})
	})

	return schedule
}