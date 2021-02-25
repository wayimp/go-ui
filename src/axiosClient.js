import axios from 'axios'

const baseURL = 'http://localhost:8040'
//const baseURL = 'https://api.lifereferencemanual.net'

const axiosClient = axios.create({
  baseURL
})

module.exports = { axiosClient, baseURL }
