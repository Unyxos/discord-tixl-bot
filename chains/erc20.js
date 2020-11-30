const axios = require('axios');
const { ChainId, Token, WETH, Fetcher } = require('@uniswap/sdk');
const contractAddress = '0x8eEF5a82E6Aa222a60F009ac18c24EE12dBf4b41';

const exchanges = [
    ['Uniswap v2', 'https://app.uniswap.org/#/swap?inputCurrency=0x8eef5a82e6aa222a60f009ac18c24ee12dbf4b41'],
    ['Probit', 'https://www.probit.com/app/exchange/TXL-BTC'],
    ['Bilaxy', 'https://bilaxy.com/trade/TXL_ETH'],
];

const TXL = new Token(ChainId.MAINNET, contractAddress, 18)

async function getUniswapV2Price() {
    try {
        return await Fetcher.fetchPairData(TXL, WETH[TXL.chainId]);
    } catch (err) {
        return err;
    }
}

async function getBilaxyPrice() {
    try {
        const res = await axios.get('https://newapi.bilaxy.com/v1/ticker/24hr?pair=TXL_ETH');
        return res.data
    } catch (err) {
        return err;
    }
}

async function getProbitPrice() {
    try {
        const res = await axios.get('https://api.probit.com/api/exchange/v1/ticker?market_ids=TXL-BTC');
        return res.data
    } catch (err) {
        return err;
    }
}

module.exports = {
    exchanges,
    getUniswapV2Price,
    getBilaxyPrice,
    getProbitPrice,
}
