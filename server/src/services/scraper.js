const axios = require('axios');
const cheerio = require('cheerio');
const { Article } = require('../models');

class ScraperService {
    constructor() {
        this.baseUrl = 'https://beyondchats.com/blogs';
    }

    async scrape() {
        try {
            console.log('Starting scrape (Targeted List)...');

            const targetUrls = [
                'https://beyondchats.com/blogs/choosing-the-right-ai-chatbot-a-guide/',
                'https://beyondchats.com/blogs/google-ads-are-you-wasting-your-money-on-clicks/',
                'https://beyondchats.com/blogs/should-you-trust-ai-in-healthcare/',
                'https://beyondchats.com/blogs/why-we-are-building-yet-another-ai-chatbot/',
                'https://beyondchats.com/blogs/best-ai-chatbot-for-handling-open-ended-conversations/'
            ];

            for (const url of targetUrls) {
                const { title, date, content } = await this.getFullArticleData(url);

                if (title && content) {
                    const [article, created] = await Article.findOrCreate({
                        where: { url },
                        defaults: {
                            title,
                            content,
                            published_at: date || new Date()
                        }
                    });

                    if (!created) {
                        // Update existing article content to fix missing images or formatting
                        await article.update({
                            title,
                            content,
                            published_at: date || new Date()
                        });
                        console.log(`Updated: ${title}`);
                    } else {
                        console.log(`Saved: ${title}`);
                    }
                }
            }

            console.log('Scrape complete.');
        } catch (error) {
            console.error('Scrape failed:', error);
            throw error;
        }
    }

    async getMetaData(url) {
        // Kept for backward compatibility if needed, but getFullArticleData does the work now
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const title = $('h1').first().text().trim();
            const date = $('time').first().attr('datetime');
            return { title, date: date ? new Date(date) : new Date() };
        } catch (e) {
            return { title: 'Unknown Title', date: new Date() };
        }
    }

    async getFullArticleData(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const title = $('h1').first().text().trim();
            const dateStr = $('time').first().attr('datetime');
            const date = dateStr ? new Date(dateStr) : new Date();

            // Attempt to find content
            let contentEl = $('.entry-content');
            if (!contentEl.length) contentEl = $('.post-content');
            if (!contentEl.length) contentEl = $('article');

            // Find Featured Image (og:image or explicit class)
            let featuredImage = $('meta[property="og:image"]').attr('content');

            // If featured image exists, prepend it as an img tag if not already present
            let contentHtml = contentEl.length ? contentEl.html() : '';

            if (featuredImage && !contentHtml.includes(featuredImage)) {
                // Check if it's a valid image URL
                if (featuredImage.startsWith('http')) {
                    contentHtml = `<img src="${featuredImage}" alt="${title}" class="featured-image mb-4 w-full rounded-lg shadow-md" />` + contentHtml;
                }
            }

            // Resolve relative URLs for images inside content
            const $content = cheerio.load(contentHtml || '', null, false); // false to treat as fragment
            $content('img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && !src.startsWith('http')) {
                    // Assuming relative to root, simplified handling
                    if (src.startsWith('/')) {
                        $(el).attr('src', `https://beyondchats.com${src}`);
                    } else {
                        // Relative to current path, tough to guess without robust logic, but usually starts with /wp-content
                        $(el).attr('src', `https://beyondchats.com/${src}`);
                    }
                }
            });

            return {
                title,
                date,
                content: $content.html()
            };

        } catch (e) {
            console.error(`Error fetching article data ${url}:`, e.message);
            return { title: '', date: null, content: '' };
        }
    }

    // Deprecated but kept for interface compatibility
    async getArticleContent(url) {
        const { content } = await this.getFullArticleData(url);
        return content;
    }
}

module.exports = new ScraperService();
