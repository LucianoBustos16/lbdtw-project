export const findLeaderboardBy = async ({teamId}) => {
    try {
        const response = await fetch(`https://api.lbdtwplus.com.ar/leaderboardLPF/${teamId}`)
        const teamStats = await response.json()
        return teamStats
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }
}
