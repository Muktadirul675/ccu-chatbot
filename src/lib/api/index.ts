import axios from 'axios';

const API_BASE_URL = "https://ccu-chatbot.mesawestmarketingpartners.com/api"

export const api = axios.create({
    baseURL: API_BASE_URL,
})
