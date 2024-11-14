// api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backendfitmrp-production.up.railway.app/api', // Reemplaza con la IP y puerto de tu servidor
  headers: { 'Content-Type': 'application/json' },
});

export default instance;