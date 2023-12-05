import 'dotenv/config'
import { inquirerMenu, leerInput, listCities, nextStep } from './helpers/inquirer.js'
import { Search } from './models/Search.js'

const main = async () => {
  const search = new Search()
  let opt = ''

  do {
    opt = await inquirerMenu()
    switch (opt) {
      case '1': {
        // Espero la ciudad que el usuario escriba
        const city = await leerInput('Escriba el nombre de la ciudad: ')
        // le paso la ciudad que busco a una funcion la cual fetchea por ese valor
        const cities = await search.searchCity(city)
        if (cities.length === 0) {
          console.log('No se encontraron ciudades')
          break
        }
        // muestro las ciudades que encontro con inquirer
        const idCity = await listCities(cities)
        if (idCity === '0') continue
        // busco el objeto ciudad que selecciono el usuario en el array de ciudades que me devolvio la api
        const selectedCity = (cities.find(e => e.id === idCity))
        search.addRecord(selectedCity.nombre)
        // busco el clima de la ciudad seleccionada
        // eslint-disable-next-line camelcase
        const { temp_min, temp_max, temp, desc } = await search.searchWeather(selectedCity.lat, selectedCity.lng)
        console.clear()
        console.log('Informacion de ciudad'.green.underline)
        console.log('Ciudad:'.green, selectedCity.nombre)
        console.log('Latitud:'.green, selectedCity.lat)
        console.log('Longitud:'.green, selectedCity.lng)
        console.log('Temperatura actual'.green, temp)
        console.log('Temperatura maxima'.green, temp_max)
        console.log('Temperatura minima'.green, temp_min)
        console.log('Descripcion:'.green, desc.charAt(0).toUpperCase() + desc.substring(1))
        break
      }
      case '2': {
        search.readDB()
        search.historial.forEach((ciudad, index) => {
          const idx = `${index + 1}.`.green
          console.log(`${idx} ${ciudad}`)
        })
        break
      }
    }
    if (opt !== '0') await nextStep()
  } while (opt !== '0')
}
main()
