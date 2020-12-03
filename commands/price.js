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
        const erc20data = await erc20.getPrice;
        let embedText = `Price for TXL (ERC20):\n`;
        embedText += `**USD**: $${erc20data.market.price.usd.toFixed(3)}\n`;
        embedText += `**BTC**: ${erc20data.market.price.btc}\n`;
        embedText += `**ETH**: ${erc20data.market.price.eth}\n`;
        embedText += `**Market Cap**: $${new Intl.NumberFormat().format(erc20data.market.mcap.usd)}\n\n`;
        console.log(embedText);
    }
};
