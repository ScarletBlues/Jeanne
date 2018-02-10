const ListenMoe = require('listenmoe.js');
const moe = new ListenMoe();

exports.startMoe = (logger, chalk) => {
    moe.connect();
    moe.on('open', () => {
        logger.info(chalk.blue.bold('[MOE] WebSocket connection opened'));
    });
    moe.on('close', () => {
        logger.info(chalk.blue.bold('[MOE] WebSocket connection closed'));
    });
    moe.on('error', (error) => { // Handle any thrown errors
        logger.error(chalk.red.bold(`[MOE] ${error}`));
    });
};

exports.stopMoe = (code) => {
    moe.close(code);
};

exports.currentTrack = moe.getCurrentTrack();

exports.requestTrack = async () => {
    try {
        return await moe.fetchTrack();
    } catch (e) {
        throw e;
    }
};