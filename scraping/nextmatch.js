    import { TEAMS } from '../db/index.js'
    import { cleanText} from './utils.js'

    const teamId = {
        'Lanús': 'Lanus',
        'CA Huracán': 'Huracan',
        'Rosario Central': 'Rosario-Central',
        'Belgrano': 'Belgrano',
        'River Plate': 'River',
        'Talleres Córdoba': 'Talleres',
        'Defensa y Justicia': 'Defensa-y-Justicia',
        'San Lorenzo': 'San-Lorenzo',
        'Godoy Cruz': 'Godoy-Cruz',
        'Instituto': 'Instituto',
        'Tigre': 'Tigre',
        'Platense': 'Platense',
        'Barracas Central': 'Barracas-Central',
        'Vélez Sarsfield': 'Velez',
        'Sarmiento': 'Sarmiento',	
        "Newell's Old Boys": 'Newells',
        'Boca Juniors': 'Boca',
        'Independiente': 'Independiente',
        'Argentinos Juniors': 'Argentinos',
        'Banfield': 'Banfield',
        'Racing Club': 'Racing-Club',
        'Unión Santa Fe': 'Union',
        'Arsenal de Sarandí': 'Arsenal',
        'Estudiantes La Plata': 'Estudiantes',
        'Atl.Tucumán': 'Atletico-Tucuman',
        'Central Córdoba': 'Central-Cordoba',
        'Gimnasia La Plata': 'Gimnasia-La-Plata',
        'Colón': 'Colon',
    }

    const NEXTMATCH_SELECTORS = {
        live: {selector: '.info-head .match-status-label .live', typeOf: 'string'},
        competition: {selector: '.info-head .middle-info', typeOf: 'string'},
        teamLocal: {selector: 'div:nth-child(2) .team-name .name', typeOf: 'string'},
        teamVisitant: {selector: 'div:nth-child(4) .team-name .name', typeOf: 'string'},
        marker: {selector: '.marker .time', typeOf: 'string'},
        goalsLocal: {selector: '.marker .green .r1', typeOf: 'number'},
        goalsVisitant: {selector: '.marker .green .r2', typeOf: 'number'},
        date: {selector: '.date', typeOf: 'string'},
        hour: {selector: '.match_hour', typeOf: 'string'},
    }

    

    export async function getNextMatch($) {
        const $rows = $('#mod_detail_team_matches_on .match-list-new div:nth-child(2) .panel-body .match-link a ')
    
        const getTeamFrom = ({ name }) => TEAMS.find(team => team.name === name)
    
        const nextMatchSelectorEntries = Object.entries(NEXTMATCH_SELECTORS)
    
        let nextmatch = []
        $rows.each((_, el) => {
            const nextMatchEntries = nextMatchSelectorEntries.map(([key, {selector, typeOf}]) => {
                const rawValue = $(el).find(selector).text()
    
    
                const value = typeOf ==='number'
                ? Number(rawValue)
                : rawValue
    
            
                return [key, value]
            })
    
            const { teamLocal: localTeamId, teamVisitant: visitantTeamName, date, hour, ...nextMatchForTeams } = Object.fromEntries(nextMatchEntries)
            const localTeam = getTeamFrom({ name: teamId[localTeamId] })
            const visitantTeam = getTeamFrom({ name: teamId[visitantTeamName] })


            const matchDate = new Date(`${date} ${hour} GMT+1`)
            const timestamp = Date.parse(matchDate)

            const horario = new Date(timestamp);
            const options = {
                timeZone: "America/Argentina/Buenos_Aires",
                hour12: false, // Opcional, para mostrar la hora en formato de 24 horas
              }
            const hourAr = horario.toLocaleString("es-AR", options)
            const [fecha, horaCompleta] = hourAr.split(" ");
            const [hora, minutos, segundos] = horaCompleta.split(":");
            const hourMatch = (`${hora}:${minutos}`)

            // console.log("-----------------------")
            // console.log(`Hora original (matchDate): ${matchDate}`)
            // console.log(`timestamp: ${timestamp}`)
            // console.log(`horario: ${horario}`)
            // console.log(`hourAr: ${hourAr}`)
            // console.log(`hourMatch: ${hourMatch}`)

            const day = horario.getDate()
			const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
			const month = months[horario.getMonth()]

			const formattedDate = day + ' ' + month

            const upgrade = new Date();
            const currentUTCHour = upgrade.getUTCHours(); // obtener la hora actual en UTC
            const currentUTCMinute = upgrade.getUTCMinutes(); // obtener los minutos actuales en UTC
            const argentinaHour = currentUTCHour - 3; // ajustar la hora a Argentina restando 3 horas
            const currentHour = argentinaHour < 0 ? argentinaHour + 24 : argentinaHour; // manejar los casos donde la hora es negativa
            const currentMinute = currentUTCMinute;
            const hourUpgrade = `${currentHour}:${currentMinute}`

           

            nextmatch.push({
              ...nextMatchForTeams,
              hourUpgrade,
              hourMatch,
              formattedDate,
              localTeam,
              visitantTeam,

            })

            
        })
            return nextmatch
    }