const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN});

const Discord = require('discord.js');
const logger = require('pino')()
const client = new Discord.Client();
const fs = require('fs');
const {bep2, bep20, erc20, native} = require('./chains/global');
require('dotenv').config()

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', () => {
    client.user.setStatus('online');
    client.user.setPresence({
        game: {
            name: 'Running ' + process.env.COMMIT_ID,
            type: "Playing"
        }
    });
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', function (message) {
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        logger.warn(error);
        message.reply('there was an error trying to execute that command!').catch((err) => {
            logger.error(err);
        });
    }

})

module.exports = {
    logger,
    priceChannelId: process.env.PRICE_CHANNEL_ID,
    bep2,
    bep20,
    erc20,
    native,
}
