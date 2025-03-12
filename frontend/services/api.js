import axios from 'axios';
import { API_URL } from '@env'; // Importa variabila API_URL din .env

const api = axios.create({
  baseURL: API_URL, // Backend-ul ASP.NET Core
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
