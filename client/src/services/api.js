import axios from 'axios';

// Logic to ensure baseURL ends with /api
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (!url) return '/api';

    // Remove trailing slash
    url = url.replace(/\/$/, '');

    // Append /api if not present
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

export const getArticles = () => api.get('/articles');
export const getArticle = (id) => api.get(`/articles/${id}`);
export const scrapeArticles = () => api.post('/articles/scrape');

export default api;
