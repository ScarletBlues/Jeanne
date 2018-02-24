const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const chalk = require('chalk');

let userSettingsSchema = new Schema({
    userID: String,
    level: String,
    points: String,
    blacklisted: Boolean
}, {collection: 'userSettings'});

class Database {
    constructor(options = {}) {
        this.URI = `mongodb://${options.user}:${options.password}@${options.host}:${options.port}/${options.db}`;
        this.models = {user: Mongoose.model('userSettings', userSettingsSchema)};
        this.cache = {user: {}};
    }

    static get name() {
        return 'MongoDatabase';
    }

    load(jeanne) {
        return new Promise((resolve, reject) => {
            this.jeanne = jeanne;
            Mongoose.Promise = global.Promise;
            Mongoose.connect(this.URI).catch((e) => {
                return reject(e)
            });
            Mongoose.connection.on('error', (e) => this.jeanne.logger.error(chalk.red.bold(`[DB] Mongoose error: ${e}`)));
            Mongoose.connection.once('open', () => this.jeanne.logger.info(chalk.green.bold('[DB] Mongoose Connected')));
            return resolve(this);
        });
    }

    destroy() {
        return new Promise((resolve, reject) => {
            this.jeanne = undefined;
            Mongoose.disconnect().catch((e) => {
                return reject(e)
            });
            Mongoose.connection.removeAllListeners('error');
            Mongoose.connection.removeAllListeners('open');
            return resolve();
        });
    }
}

module.exports = Database;
