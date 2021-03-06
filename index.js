if (parseFloat(process.versions.node) < 8) {
    throw new Error('Incompatible node version. Install Node 8.0 or higher.');
}

const chalk = require('chalk');
const path = require('path');
const moment = require('moment');
const {Crystal} = require('sylphy');
global.Promise = require('bluebird');

require('longjohn');
require('dotenv-safe').config({
    path: path.join(__dirname, '.env'),
    allowEmptyValues: true
});


const cluster = new Crystal(path.join('src', 'jeanne.js'), parseInt(process.env.PROCESS_COUNT, 10));
const timestamp = () => `[${chalk.grey(moment().format('HH:mm:ss'))}]`;

cluster.on('clusterCreate', (id) => console.log(`${timestamp()} [MASTER]: CLUSTER ${chalk.cyan.bold(id)} ONLINE`));

cluster.createClusters()
    .then(() => console.log(`${timestamp()} [MASTER]: ` + chalk.magenta('We\'re live, ladies and gentlemen.')))
    .catch((err) => console.error(err));
