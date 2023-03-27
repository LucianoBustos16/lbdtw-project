  
export const getAllMatch = async ({league}) => {
	try {
		const response = await fetch(`https://api.lbdtwplus.com.ar/schedule${league}`)
		const schedule = await response.json()
		return schedule
	} catch (e) {
		// enviar el error a un servicio de reporte de errores
		return null
	}
}
