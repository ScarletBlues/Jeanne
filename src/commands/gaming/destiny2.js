const {Command} = require('sylphy');
const axios = require('axios');
const getColors = require('get-image-colors');
const {formatTime, round} = require('../../utils/utils');
const config = require('../../../config');
const baseURI = 'https://www.bungie.net/Platform';

class Destiny2 extends Command {
    constructor(...args) {
        super(...args, {
            name: 'destiny2',
            description: 'Get destiny 2 character data',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 10,
            group: 'gaming',
            usage: [
                {name: 'system', type: 'string', optional: false},
                {name: 'displayName', type: 'string', optional: false},
                {name: 'characterNumber', type: 'int', optional: true}
            ]
        });
    }

    async handle({client, rawArgs, logger}, responder) {
        const system = rawArgs[0].toLowerCase();
        const displayName = rawArgs[1];
        let characterNum = rawArgs[2] ? rawArgs[2] : ~~(Math.random() * 3);

        let membershipType;
        if (system === 'xbox') membershipType = 1;
        if (system === 'psn') membershipType = 2;
        if (system === 'blizzard') membershipType = 4;
        if (!membershipType) return responder.send('You did not give a valid system, it can either be xbox, psn or blizzard.');

        if (typeof characterNum === 'string' || characterNum instanceof String) characterNum = parseInt(characterNum);
        if (characterNum > 2) return responder.send('Last argument can only be a number between 0-2');

        let resp;
        try {
            resp = await axios.get(`${baseURI}/Destiny2/SearchDestinyPlayer/${membershipType}/${displayName}/`, {
                headers: {'X-API-Key': config.tokens.destiny2}
            });
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        if (resp.data.ErrorCode !== 1) return responder.send('', {
            embed: {
                color: config.colours.red,
                title: 'Error:',
                description: `Code: ${resp.data.ErrorCode}\nStatus: ${resp.data.ErrorStatus}\nMessage: ${resp.data.Message}`
            }
        });
        if (!resp.data.Response[0]) return responder.send('', {
            embed: {
                color: config.colours.red,
                description: `No user found for **${displayName}**`
            }
        });
        const destinyMembershipId = resp.data.Response[0].membershipId;
        let res;
        try {
            res = await axios.get(`${baseURI}/Destiny2/${membershipType}/Profile/${destinyMembershipId}/`, {
                headers: {'X-API-Key': config.tokens.destiny2},
                params: {components: '200,202'}
            });
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        if (res.data.ErrorCode !== 1) return responder.send('', {
            embed: {
                color: config.colours.red,
                title: 'Error:',
                description: `Code: ${res.data.ErrorCode}\nStatus: ${res.data.ErrorStatus}\nMessage: ${res.data.Message}`
            }
        });
        const charData = res.data.Response.characters.data;
        const characters = Object.keys(charData).map((key) => charData[key]);
        if (!characters[characterNum]) return responder.send('', {
            embed: {
                color: config.colours.red,
                description: `No character found for **${displayName}**\nCharacter number: ${characterNum}`
            }
        });
        const charProgression = res.data.Response.characterProgressions.data;
        const characterProgressions = Object.keys(charProgression).map((key) => charProgression[key]);
        if (!characterProgressions[characterNum]) return responder.send('', {
            embed: {
                color: config.colours.red,
                description: `No character found for **${displayName}**\nCharacter number: ${characterNum}`
            }
        });
        const gender = characters[characterNum].genderType === 0 ? 'Male' : 'Female';
        const cClass = characters[characterNum].classType === 0 ? 'Titan' : characters[characterNum].classType === 1 ? 'Hunter' : 'Warlock';
        const race = characters[characterNum].raceType === 0 ? 'Human' : characters[characterNum].raceType === 1 ? 'Awoken' : 'Exo';
        const emblem = await axios.get(`https://www.bungie.net${characters[characterNum].emblemPath}`, {
            headers: {'Accept': 'image/*'},
            responseType: 'arraybuffer'
        });
        const colors = await getColors(emblem.data, emblem.headers['content-type']);
        const hexEmbedColors = colors.map(color => color.hex());
        const hexEmbedColor = hexEmbedColors[0].replace("#", "0x");
        const embedColor = parseInt(hexEmbedColor);
        const hours = characters[characterNum].minutesPlayedTotal / 60;
        const seconds = characters[characterNum].minutesPlayedTotal * 60;
        const ms = seconds * 1000;
        responder.send('', {
            embed: {
                color: embedColor,
                thumbnail: {url: `https://www.bungie.net${characters[characterNum].emblemPath}`},
                fields: [
                    {name: 'Level', value: characters[characterNum].levelProgression.level, inline: true},
                    {name: 'Light level', value: characters[characterNum].light, inline: true},
                    {name: 'Gender', value: gender, inline: true},
                    {name: 'Class', value: cClass, inline: true},
                    {name: 'Race', value: race, inline: true},
                    {name: 'Time played', value: `${formatTime(ms)}\nA total of ${round(hours, 0)} hours`, inline: false}
                ]
            }
        });
    }
}

module.exports = Destiny2;