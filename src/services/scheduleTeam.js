//Nombre del equipo a buscar
const teamName = 'Belgrano'

//Traer los datos de la API
const response = await fetch('https://api.lbdtwplus.com.ar/teams')
  .then(response => {
    //Filtrar solo los partidos que incluyen al equipo buscado
    const filteredMatches = response.data.filter(match => match.team.localName === teamName || match.team.visitorName === teamName)
    
    //Mostrar los partidos filtrados
    console.log(filteredMatches)
  })
  .catch(error => {
    console.error(error)
  })
  