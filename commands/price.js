const app = require('../main');

module.exports = {
    name: 'price',
    description: '',
    args: false,
    usage: '',
    async execute (message, args) {
        console.log(app.bep2.getBinanceDexPrice())
    }
};
