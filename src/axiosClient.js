import axios from 'axios'

const baseURL = 'https://api.lifereferencemanual.net'
//const baseURL = 'http://localhost:8040'

const axiosClient = axios.create({
  baseURL
})

module.exports = { axiosClient, baseURL }
