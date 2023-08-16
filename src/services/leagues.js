export const getAllLeagues = async () => {
    try {
        const response = await fetch('https://api.lbdtwplus.com.ar/leagues')
        const teams = await response.json()
        return teams
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }
}

