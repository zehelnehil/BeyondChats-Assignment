const { Article } = require('./src/models');

async function reset() {
    console.log('Resetting updated_content for all articles...');
    try {
        await Article.update({ updated_content: null, status: 'PENDING' }, { where: {} });
        console.log('Reset complete.');
    } catch (e) {
        console.error('Reset failed:', e);
    }
}

reset();
