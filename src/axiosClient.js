import axios from 'axios'

const baseURL = 'https://api.gothereforeministries.org'
//const baseURL = 'http://localhost:8040'

const axiosClient = axios.create({
  baseURL
})

module.exports = { axiosClient, baseURL }
