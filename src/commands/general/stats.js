const {Command} = require('sylphy');
const reload = require('require-reload');
const config = reload('../../../config.json');
const utils = require('../../utils/utils.js');

class Stats extends Command {
    constructor(...args) {
        super(...args, {
            name: 'stats',
            description: 'show some bot stats',
            group: 'general',
            cooldown: 10
        });
    }

    async handle({msg, client}) {
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                author: {
                    name: `${client.user.username}'s Statistics:`,
                    url: 'http://kurozero.xyz/',
                    icon_url: `${client.user.avatarURL}`
                },
                thumbnail: {
                    url: `${client.user.avatarURL}`
                },
                fields: [{
                    name: 'Memory Usage',
                    value: `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`,
                    inline: true
                },
                    {
                        name: 'Shards',
                        value: `Current: ${msg.channel.guild.shard.id}\nTotal: ${client.shards.size}`,
                        inline: true
                    },
                    {
                        name: 'Version',
                        value: 'v0.0.0',
                        inline: true
                    },
                    {
                        name: 'Node Version',
                        value: `${process.version}`,
                        inline: true
                    },
                    {
                        name: 'Uptime',
                        value: `${utils.formatSeconds(process.uptime())}`,
                        inline: false
                    },
                    {
                        name: 'Voice Connections',
                        value: `${client.voiceConnections.size}`,
                        inline: false
                    },
                    {
                        name: 'Guilds',
                        value: `${client.guilds.size}`,
                        inline: true
                    },
                    {
                        name: 'Channels',
                        value: `${Object.keys(client.channelGuildMap).length}`,
                        inline: true
                    },
                    {
                        name: 'Users',
                        value: `${client.users.size}`,
                        inline: true
                    },
                    {
                        name: 'Average Users/Guild',
                        value: `${(client.users.size / client.guilds.size).toFixed(2)}`,
                        inline: true
                    },
                    {
                        name: 'Total commands used',
                        value: `${commandsProcessed}`,
                        inline: true
                    },
                    {
                        name: 'Average',
                        value: `${(commandsProcessed / (client.uptime / (1000 * 60))).toFixed(2)}/min`,
                        inline: true
                    }
                ]
            }
        });
    }
}

module.exports = Stats;