const axios = require('axios');

const api = axios.create({
  baseURL: 'http://172.16.10.209:9999'
});

export default api;