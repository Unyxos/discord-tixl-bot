const axios = require('axios');

const exchanges = [
    ['Binance DEX', 'https://www.binance.org/en/trade/MTXLT-286_BNB'],
];
async function getBinanceDexPrice() {
    try {
        const {data} = await axios.get('https://dex.binance.org/api/v1/ticker/24hr?symbol=MTXLT-286_BNB');
        return data[0];
    } catch (err) {
        return err;
    }
}

module.exports = {
    exchanges,
    getBinanceDexPrice,
}
