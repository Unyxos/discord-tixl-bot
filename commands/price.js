const app = require('../main');
const axios = require('axios');
module.exports = {
    name: 'price',
    description: '',
    args: false,
    usage: '',
    async execute (message, args) {
        if (message.channel.id !== app.priceChannelId) return message.delete().catch(err => app.logger.error(err));
        const {data} = await axios.get('https://api.coingecko.com/api/v3/coins/tixl-new');
        const erc20data = {
            tickers: data.tickers,
            market: {
                price : {
                    btc: data['market_data']['current_price'].btc,
                    eth: data['market_data']['current_price'].eth,
                    usd: data['market_data']['current_price'].usd,
                },
                mcap: {
                    btc: data['market_data']['market_cap'].btc,
                    eth: data['market_data']['market_cap'].eth,
                    usd: data['market_data']['market_cap'].usd,
                },
                volume: {
                    btc: data['market_data']['total_volume'].btc,
                    eth: data['market_data']['total_volume'].eth,
                    usd: data['market_data']['total_volume'].usd,
                },
                priceChange: data['market_data']['price_change_24h'],
                priceChangePercentage: data['market_data']['price_change_percentage_24h'],
            }
        }
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
