export const getNextMatch = async () => {
    try {
        const response = await fetch('https://api.lbdtwplus.com.ar/nextmatch')
        const nextMatch = await response.json()
        return nextMatch
    }
    catch (e) {
        // Enviar el error a un servicio de reporte de error
        return []
    }
}