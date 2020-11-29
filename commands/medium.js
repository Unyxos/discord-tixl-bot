const app = require('../main');
const Parser = require('rss-parser');
const parser = new Parser();
const moment = require('moment');

module.exports = {
    name: 'medium',
    description: '',
    args: true,
    usage: '',
    async execute (message, args) {
        message.delete().catch((err) => {
            app.logger.error(err);
        })
        let feed = await parser.parseURL('https://medium.com/feed/tixlorg');
        let embedContent = '';
        for (let i = 0; i < 5; i++) {
            let parsedDate = moment(feed.items[i].isoDate).utc().format('Do MMMM YYYY')
            embedContent += `[${parsedDate}] [${feed.items[i].title}](${feed.items[i].link})\n`
        }
        embedContent += `\nFind all other articles on [Medium.com](https://medium.com/tixlorg)`;

        message.channel.send({
            embed: {
                title: "Last 5 Medium articles",
                description: embedContent,
            }
        }).catch((err) => {
            app.logger.error(err);
        })
    }
};
