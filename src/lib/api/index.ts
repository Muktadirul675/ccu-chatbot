import axios from 'axios';

const API_BASE_URL = "https://ccu-chatbot.vercel.app/api"

export const api = axios.create({
    baseURL: API_BASE_URL,
})
