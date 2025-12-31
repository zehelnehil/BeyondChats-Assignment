const sequelize = require('../config/database');
const Article = require('./Article');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync({ alter: true }); // updates schema if changed
        console.log('Database synced.');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

module.exports = {
    sequelize,
    Article,
    syncDatabase,
};
