const app = require('../main');
const bep2 = require('../chains/tixl-bep2');
const erc20 = require('../chains/tixl-erc20');
const Discord = require('discord.js');

const axios = require('axios');

async function getMajorCurrenciesPrice() {
    try {
        const btcData = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        const ethData = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
        const bnbData = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
        return {
            btc: parseFloat(btcData.data.price),
            eth: parseFloat(ethData.data.price),
            bnb: parseFloat(bnbData.data.price),
        };
    } catch (e) {
        app.logger.error(e);
        return e;
    }
}

module.exports = {
    name: 'price',
    description: '',
    args: false,
    usage: '',
    async execute (message, args) {
        if (message.channel.id !== app.priceChannelId) return message.delete().catch(err => app.logger.error(err));
        const erc20data = await erc20.getPrice;
        let embedText = '';
        embedText += `**USD**: $${erc20data.market.price.usd.toFixed(3)} (24h change : ${erc20data.market.priceChangePercentage.toFixed(2)}%)\n`;
        embedText += `**BTC**: ${erc20data.market.price.btc}\n`;
        embedText += `**ETH**: ${erc20data.market.price.eth}\n`;
        embedText += `**Volume**: $${new Intl.NumberFormat().format(erc20data.market.volume.usd)}\n`;
        embedText += `**Market Cap**: $${new Intl.NumberFormat().format(erc20data.market.mcap.usd)}\n\n`;
        embedText += `**__Trade Tixl on__** :\n`;
        for (let i = 0; i < erc20data.tickers.length; i++) {
            if (i === erc20data.tickers.length - 1) {
                embedText += `[${erc20data.tickers[i].market.name}](${erc20data.tickers[i]['trade_url']}) (TXL-${erc20data.tickers[i].target})`;
            } else {
                embedText += `[${erc20data.tickers[i].market.name}](${erc20data.tickers[i]['trade_url']}) (TXL-${erc20data.tickers[i].target}), `;
            }
        }
        embedText += '\n\n_Data provided by [Coingecko](https://www.coingecko.com/en)_'
        message.channel.send({
            embed: {
                title: 'Price for TXL (ERC20)',
                description: embedText,
            }
        }).catch((err) => app.logger.error(err));
    }
};
