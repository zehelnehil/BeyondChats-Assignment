import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const getArticles = () => api.get('/articles');
export const getArticle = (id) => api.get(`/articles/${id}`);
export const scrapeArticles = () => api.post('/articles/scrape');

export default api;
