import { TEAMS } from '../db/index.js'
import { cleanText} from './utils.js'

const LEADERBOARD_SELECTORS = {
  team: {selector: 'td:nth-child(2)', typeOf: 'string'},
  points: {selector: 'td:nth-child(3)', typeOf: 'number'},
  matchesPlayed: {selector: 'td:nth-child(4)', typeOf: 'number'},
  matchesWon: {selector: 'td:nth-child(5)', typeOf: 'number'},
  matchesDrawn: {selector: 'td:nth-child(6)', typeOf: 'number'},
  matchesLost: {selector: 'td:nth-child(7)', typeOf: 'number'},
  goalsFor: {selector: 'td:nth-child(8)', typeOf: 'number'},
  goalsAgainst: {selector: 'td:nth-child(9)', typeOf: 'number'},
  goalDifference: {selector: 'td:nth-child(10)', typeOf: 'number'}

}

export async function getLeaderBoardLPF ($) {
    const $rows = $('table#posiciones tbody tr')

    const getTeamFrom = ({ name }) => TEAMS.find(team => team.name === name) 

    const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)


    let LPF = []
    let rankCounter = 1; // Inicializar el contador de rango

    $rows.each((index, el) => {
        const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
          const rawValue = $(el).find(selector).text()
          
          const cleanedValue = cleanText(rawValue)
    
          const value = typeOf === 'number'
            ? Number(cleanedValue)
            : cleanedValue
    
          return [key, value]
        })

        const { team: teamName, ...leaderBoardForTeam } = Object.fromEntries(leaderBoardEntries)
        const team = getTeamFrom ({ name: teamName })
        

        LPF.push({
          rank: rankCounter, // Usar el contador de rango
            ...leaderBoardForTeam,
            team
        });     
        
         // Incrementar el contador de rango y reiniciarlo si llega a 14
         rankCounter++;
         if (rankCounter > 14) {
             rankCounter = 1;
         }        
        })

        return LPF
    }