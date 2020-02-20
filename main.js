const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN});

const Discord = require('discord.js');
const getJSON = require('get-json');

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    if (message.content === '!price' || message.content === '!Price') {
        if (message.channel["name"] === "bot-dev" || message.channel["name"] === "price-discussion") {
            getJSON('https://dex.binance.org/api/v1/ticker/24hr?symbol=MTXLT-286_BNB', function(error, response){
                getJSON('https://dex.binance.org/api/v1/ticker/24hr?symbol=BNB_USDSB-1AC', function (error, response2) {
                    let usdPrice = response2[0]['lastPrice']
                    let lastPrice = roundToTwo(response[0]['lastPrice'])
                    let priceChangePercentage = response[0]['priceChangePercent'];
                    let priceChange = response[0]['priceChange'];
                    let high = roundToTwo(response[0]['highPrice']);
                    let low = roundToTwo(response[0]['lowPrice']);
                    let volume = roundToTwo(response[0]['quoteVolume']);
                    let changeArray = priceChangePercentage.split('');
                    let changeEmoji;
                    if (changeArray[0] == '-'){
                        changeEmoji = "📉";
                    } else {
                        changeEmoji = "📈";
                    }
                    function getPriceUsd(bnbPrice){
                        return roundToTwo(usdPrice*bnbPrice)
                    }
                    message.channel.send("__**Current Price :**__ " + lastPrice + " BNB ($"+getPriceUsd(lastPrice)+")\n__**24h Change :**__ "+ roundToTwo(priceChangePercentage) +"% "+ changeEmoji +"\n__**24h Low :**__ "+ low +" BNB ($"+getPriceUsd(low)+")\n__**24h High :**__ "+ high +" BNB ($"+getPriceUsd(high)+")\n__**24h Volume :**__ "+ volume +" BNB ($"+getPriceUsd(volume)+")");
                })
            })
        } else {
            message.author.send("Please only use the `!price` command in #price-discussion :smile:")
        }
    } else if (message.content === "!help" || message.content === "!Help"){
        if (message.channel["name"] === "botspam") {
            message.channel.send("__**Current commands:**__\n!price\t\tDisplays price informations (in #price-discussion only)\n!help\t\tDisplays this message (in #botspam only)")
        }
    } else if (message.content.startsWith("!bdepth")){
        const args = message.content.slice(!"bdepth".length).split(' ');
        args.shift();
        if(args.length>1){
            message.author.send("The !bdepth command accepts a maximum of 1 argument, for example: !bdepth 2")
        } else {
            getJSON('https://dex.binance.org/api/v1/depth?symbol=MTXLT-286_BNB', function(error, response){
                function postMessage(asks, bids, depth) {
                    const firstAsk = parseFloat(asks[0][0], 10);
                    const firstBid = parseFloat(bids[0][0], 10);
                    const price = (firstAsk + firstBid)/2;
                    const priceMin = price - depth;
                    const priceMax = price + depth;
                    const askObjects = asks.map(x => ({ price: Number(x[0]), amount: Number(x[1]) })).filter(x => x.price <= priceMax);
                    const bidObjects = bids.map(x => ({ price: Number(x[0]), amount: Number(x[1]) })).filter(x => x.price >= priceMin);
                    const askAmount = askObjects.reduce((a, x) => a += x.amount, 0);
                    const bidAmount = bidObjects.reduce((a, x) => a += x.amount, 0);
                    message.channel.send("```Current spread of: "+depth+" BNB\nCurrent spread bid-ask: "+firstBid+" - "+firstAsk+", using middle price "+price+"\nIn the range "+priceMin+" - "+priceMax+" buyside is "+bidAmount+" BNB and sellside is "+askAmount+" BNB```")
                }
                const asks = response['asks'];
                const bids = response['bids'];
                let depth = Infinity;
                if (args.length === 1 ){
                    if (isNaN(args[0])){
                        //Erreur l'argument n'est pas un chiffre
                        message.author.send("The !bdepth can only accept a number as argument, please try again!")
                    } else {
                        depth = args[0];
                        postMessage(asks, bids, depth)
                    }
                } else {
                    postMessage(asks, bids, depth)
                }
            })
        }
    } else if (message.content.startsWith("!basks")){
        const args = message.content.slice(!"basks".length).split(' ');
        args.shift();
        if(args.length>1){
            message.author.send("The !basks command accepts a maximum of 1 argument, for example: !basks 2")
        } else {
            getJSON('https://dex.binance.org/api/v1/depth?symbol=MTXLT-286_BNB', function(error, response){
                function postMessage(asks, priceLimit) {
                    const askObjects = asks.map(x => ({price: Number(x[0]), amount: Number(x[1])})).filter(x => x.price <= priceLimit);
                    const totalAmount = askObjects.reduce((a,x) => a += x.amount,0);
                    const totalPrice = askObjects.reduce((a,x) => a += (x.price * x.amount),0);
                    const avgPrice = totalPrice /totalAmount;
                    message.channel.send("```At a price limit of: "+priceLimit+" BNB\nAvailable tokens: "+totalAmount+" MTXLT\nTotal price: "+totalPrice+" BNB\nAverage price: "+avgPrice+" BNB```");
                }
                const asks = response['asks'];
                let priceLimit = Infinity;
                if (args.length === 1 ){
                    if (isNaN(args[0])){
                        //Erreur l'argument n'est pas un chiffre
                        message.author.send("The !basks can only accept a number as argument, please try again!");
                    } else {
                        priceLimit = args[0];
                        postMessage(asks, priceLimit)
                    }
                } else {
                    postMessage(asks, priceLimit)
                }
            })
        }
    }
});

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.DISCORD_TOKEN);