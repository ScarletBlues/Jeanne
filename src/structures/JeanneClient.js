const {Client} = require('sylphy');
const Database = require('./Database');
const chalk = require('chalk');
const mysql = require('mysql');
const fs = require('fs');
const ListenMoe = require('../utils/listenmoe');

class JeanneClient extends Client {
    constructor(options = {}) {
        super(options);
        this.settingsManager = require('../utils/settingsManager');
        this.userAgent = `Jeanne d'Arc (https://github.com/Chaldea-devs/Jeanne) v${require('../../package').version}`;
        this.commandsProcessed = 0;
        this.listenmoe = new ListenMoe();
        this.mongo = new Database({
            user: process.env['M_USER'],
            password: process.env['M_PASSWORD'],
            host: process.env['M_HOST'],
            port: process.env['M_PORT'],
            db: 'jeanne'
        });
        this.db_pool = mysql.createPool({
            host: process.env['HOST'],
            port: process.env['PORT'],
            user: process.env['USER'],
            password: process.env['PASSWORD'],
            database: 'jeanne_1',
            ssl: {
                ca: fs.readFileSync('/home/kurozero/.ssh/mysql-ca.pem', 'utf8')
            }
        });
    }

    async shutdown() {
        try {
            await this.settingsManager.handleShutdown(this);
            process.exit(0);
        } catch (e) {
            this.logger.error(chalk.red.bold(e));
            process.exit(0);
        }
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    }
}

module.exports = JeanneClient;
