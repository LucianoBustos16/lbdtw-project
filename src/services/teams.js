export const getAllTemas = async () => {
    try {
        const response = fetch('https://api.lbdtwplus.com.ar/teams')
        const teams = await response.json()
        return teams
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }
}