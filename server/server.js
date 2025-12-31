require('dotenv').config();
const app = require('./src/app');
const { syncDatabase } = require('./src/models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await syncDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
});

// Explicitly keep the process alive just in case (though app.listen should do it)
// Some environments might be weird.
setInterval(() => { }, 60000); // 1 minute keep-alive tick

