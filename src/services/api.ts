import axios from 'axios';

const api = axios.create({
  baseURL: 'https://codeforces.com/api/',
  timeout: 30 * 1000
});

export default api;
