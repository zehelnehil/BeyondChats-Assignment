const { Article } = require('../models');
const scraperService = require('../services/scraper');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({ order: [['published_at', 'ASC']] }); // Oldest first? or just list.
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const [updated] = await Article.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedArticle = await Article.findByPk(req.params.id);
            return res.json(updatedArticle);
        }
        throw new Error('Article not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const deleted = await Article.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Article not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.triggerScrape = async (req, res) => {
    try {
        // Run scraper in background or await?
        // Await for this assignment demo so we see result.
        await scraperService.scrape();
        res.json({ message: 'Scrape completed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
