const app = require('../main');
const axios = require('axios');

async function getPrice() {
    try {
        const {data} = await axios.get('https://api.coingecko.com/api/v3/coins/tixl-new');
        const exObject = {
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
        return exObject;
    } catch (e) {
        app.logger.error(e);
        return e;
    }
}

module.exports.getPrice = getPrice();
