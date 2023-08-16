export const findLeaderboardBy = async ({shortName}) => {
    try {
        const response = await fetch(`https://api.lbdtwplus.com.ar/${shortName}`)
        const teamStats = await response.json()
        return teamStats
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }


}
