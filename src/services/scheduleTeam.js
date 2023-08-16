  
export const getAllMatch = async () => {
	try {
		const response = await fetch('https://api.lbdtwplus.com.ar/scheduleLaLiga')
		const schedule = await response.json()
		return schedule
	} catch (e) {
		// enviar el error a un servicio de reporte de errores
		return null
	}
}
