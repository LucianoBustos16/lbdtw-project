import { TEAMS } from '../db/index.js'
import { cleanText} from './utils.js'

const NEXTMATCH_SELECTORS = {
    live: {selector: '.info-head .match-status-label .live', typeOf: 'string'},
    competition: {selector: '.info-head .middle-info', typeOf: 'string'},
    teamLocal: {selector: 'div:nth-child(2) .team-name .name', typeOf: 'string'},
    teamLocalImage: {selector: 'div:nth-child(2) .team-name img', typeOf: 'string'},
    teamVisitant: {selector: 'div:nth-child(4) .team-name .name', typeOf: 'string'},
    marker: {selector: '.marker .time', typeOf: 'string'},
    goalsLocal: {selector: '.marker .green .r1', typeOf: 'number'},
    goalsVisitant: {selector: '.marker .green .r2', typeOf: 'number'},
    date: {selector: '.date', typeOf: 'string'},
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

        

        const {team: teamName, ...nextMatchForTeam } = Object.fromEntries(nextMatchEntries)
        const team = getTeamFrom ({ name: teamName})

        nextmatch.push({
            ...nextMatchForTeam,
            team
        }
        )
    })

return nextmatch
}
