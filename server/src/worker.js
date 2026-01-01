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

async function processPendingArticles() {
    try {
        const articles = await Article.findAll({ where: { status: 'PENDING' } });

        if (articles.length === 0) {
            return;
        }

        console.log(`Found ${articles.length} pending articles.`);

        for (const article of articles) {
            console.log(`Processing article: ${article.title}`);

            try {
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
                article.citations = references;
                article.status = 'PROCESSED';
                await article.save();

                console.log(`Article ${article.id} processed successfully.`);

            } catch (err) {
                console.error(`Error processing article ${article.id}:`, err);
                article.status = 'TENTATIVE_FAILED'; // Optional: Mark as failed so we don't loop forever
                await article.save();
            }
        }
    } catch (error) {
        console.error("Worker loop error:", error);
    }
}

async function startWorker() {
    await syncDatabase();
    console.log("Worker started. Polling for pending articles...");

    // Initial run
    await processPendingArticles();

    // Loop
    setInterval(async () => {
        await processPendingArticles();
    }, 10000); // Check every 10 seconds
}

startWorker().catch(e => {
    console.error("Fatal worker error:", e);
    process.exit(1);
});
