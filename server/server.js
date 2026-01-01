require('dotenv').config();
const app = require('./src/app');
const { syncDatabase } = require('./src/models');

const PORT = process.env.PORT || 3000;

const { fork } = require('child_process');
const path = require('path');

const startServer = async () => {
    await syncDatabase();

    // Start the API Server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Start the Background Worker
    const workerPath = path.resolve(__dirname, 'src/worker.js');
    const worker = fork(workerPath);

    worker.on('message', (msg) => {
        console.log('[Worker]', msg);
    });

    worker.on('error', (err) => {
        console.error('[Worker Error]', err);
    });

    console.log('Background worker started.');
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
});

// Explicitly keep the process alive just in case (though app.listen should do it)
// Some environments might be weird.
setInterval(() => { }, 60000); // 1 minute keep-alive tick

