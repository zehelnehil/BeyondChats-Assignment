const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_content: {
        type: DataTypes.TEXT,
        allowNull: true, // Populated in Phase 2
    },
    citations: {
        type: DataTypes.JSON, // Store as JSON array of links/titles
        allowNull: true,
    },
    source_articles: {
        type: DataTypes.JSON, // Store links of source articles from Google
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSED', 'FAILED'),
        defaultValue: 'PENDING',
    },
});

module.exports = Article;
