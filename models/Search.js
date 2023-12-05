import fs from 'fs'
import axios from 'axios'

export class Search {
  constructor () {
    this.historial = []
  }

  get paramsMapbox () {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: 'es',
      proximity: 'ip'
    }
  }

  get paramsWeather () {
    return {
      appid: process.env.OPENWATHER_KEY,
      units: 'metric',
      lang: 'es'

    }
  }

  async searchCity (lugar = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
        timeout: 3000,
        headers: { 'X-Custom-Header': 'foobar' }
      })
      const resp = await instance.get()
      return resp.data.features.map(lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
      }))
    } catch (error) {
      console.log(error)
    }
    return [
    ]
  }

  async searchWeather (lat, lon) {
    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather?',
        params: { ...this.paramsWeather, lat, lon }
      })
      const resp = await instance.get()
      const { main, weather } = resp.data
      return {
        desc: weather[0].description,
        temp: main.temp,
        temp_max: main.temp_max,
        temp_min: main.temp_min
      }
    } catch (error) {
      console.log(error)
    }
    return {
    }
  }

  addRecord (ciudad = '') {
    if (this.historial.includes(ciudad)) return
    this.historial = this.historial.splice(0, 4)
    this.historial.unshift(ciudad)
    this.DBSave()
  }

  DBSave () {
    const payload = {
      historial: this.historial
    }
    fs.writeFileSync('./db/database.json', JSON.stringify(payload))
  }

  readDB () {
    if (!fs.existsSync('./db/database.json')) return
    const info = fs.readFileSync('./db/database.json', { encoding: 'utf-8' })
    const data = JSON.parse(info)
    this.historial = data.historial
  }
}
