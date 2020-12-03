const app = require('../main');
const axios = require('axios');

async function getPrice() {
    try {
        const {data} = await axios.get('https://api.coingecko.com/api/v3/coins/tixl');
        const exObject = {
            tickers: data.tickers,
            market: {
                price : {
                    bnb: data['market_data']['current_price'].bnb,
                    usd: data['market_data']['current_price'].usd,
                },
                mcap: {
                    bnb: data['market_data']['market_cap'].bnb,
                    usd: data['market_data']['market_cap'].usd,
                },
                volume: {
                    bnb: data['market_data']['total_volume'].bnb,
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
