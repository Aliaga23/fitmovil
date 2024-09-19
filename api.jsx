// api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/api', // Reemplaza con la IP y puerto de tu servidor
  headers: { 'Content-Type': 'application/json' },
});

export default instance;