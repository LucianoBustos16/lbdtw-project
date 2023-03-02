export const getMatchsToday = async () => {
    try {
        const response = await fetch('https://api.lbdtwplus.com.ar/matchstoday')
        const matchToday = await response.json()
        return matchToday
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }
}