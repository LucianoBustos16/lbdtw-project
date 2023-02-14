export const findScheduleTeamBy = async ({localName}) => {
    try {
        const response = await fetch(`https://api.lbdtwplus.com.ar/schedule/${teams.localName}`)
        const scheduleTeam = await response.json()
        return scheduleTeam
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }
}
