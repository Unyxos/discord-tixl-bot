const axios = require('axios');

module.exports = {
    exchanges: [
        ['Binance DEX', 'https://www.binance.org/en/trade/MTXLT-286_BNB'],
    ],

    async getBinanceDexPrice() {
        try {
            const {data} = await axios.get('https://dex.binance.org/api/v1/ticker/24hr?symbol=MTXLT-286_BNB');
            return data;
        } catch (err) {
            return err;
        }
    }
}