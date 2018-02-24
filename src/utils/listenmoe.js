const Moe = require('listenmoe.js').ListenMoeJS;
const chalk = require('chalk');

class ListenMoe {
    constructor() {
        this.moe = new Moe();
        this.currentTrack = this.moe.getCurrentTrack();
    }

    start(logger) {
        this.moe.connect();
        this.moe.on('open', () => {
            logger.info(chalk.blue.bold('[MOE] WebSocket connection opened'));
        });
        this.moe.on('close', () => {
            logger.info(chalk.blue.bold('[MOE] WebSocket connection closed'));
        });
        this.moe.on('error', (error) => { // Handle any thrown errors
            logger.error(chalk.red.bold(`[MOE] ${error.message}`));
        });
    }

    stop() {
        this.moe.disconnect();
        this.moe.removeAllListeners();
    }
}

module.exports = ListenMoe;
