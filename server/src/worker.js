require('dotenv').config();
const { Article, syncDatabase } = require('./models');
const searchService = require('./services/search');
const llmService = require('./services/llm');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeGenericContent(url) {
    try {
        const { data } = await axios.get(url, {
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        // Naive generic extractor: get all paragraphs
        const paragraphs = $('p').map((i, el) => $(el).text()).get().join('\n\n');
        return paragraphs.substring(0, 5000); // Limit context
    } catch (e) {
        console.error(`Failed to scrape ${url}: ${e.message}`);
        return "";
    }
}

async function startWorker() {
    await syncDatabase();
    console.log("Worker started. Checking for pending articles...");

    const articles = await Article.findAll({ where: { status: 'PENDING' } });

    if (articles.length === 0) {
        console.log("No pending articles found.");
        return;
    }

    for (const article of articles) {
        console.log(`Processing article: ${article.title}`);

        // 1. Search Google
        const sourceLinks = await searchService.search(article.title);

        // 2. Scrape content from sources
        const references = [];
        for (const link of sourceLinks) {
            console.log(`Scraping reference: ${link.url}`);
            let content = link.content; // Use pre-filled content if available (e.g. from Mock)

            if (!content) {
                content = await scrapeGenericContent(link.url);
            }

            if (content) {
                references.push({ ...link, content });
            }
        }

        // 3. Call LLM
        console.log("Calling LLM...");
        const updatedContent = await llmService.rewriteArticle(article.content, references);

        // 4. Update Article
        article.updated_content = updatedContent;
        article.source_articles = references.map(r => ({ title: r.title, url: r.url }));
        article.citations = references; // or just links
        article.status = 'PROCESSED';
        await article.save();

        console.log(`Article ${article.id} processed successfully.`);
    }

    console.log("All pending articles processed.");
}

startWorker().then(() => {
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
