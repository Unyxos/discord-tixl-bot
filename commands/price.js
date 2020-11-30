const app = require('../main');
const bep2 = require('../chains/bep2');
const erc20 = require('../chains/erc20');

module.exports = {
    name: 'price',
    description: '',
    args: false,
    usage: '',
    async execute (message, args) {
        console.log(await bep2.getBinanceDexPrice())
        console.log(await erc20.getProbitPrice())
        console.log(await erc20.getBilaxyPrice())
        console.log(await erc20.getUniswapV2Price())
    }
};
