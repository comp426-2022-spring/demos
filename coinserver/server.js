// Require minimist module (make sure you install this one via npm).
// Use minimist to process one argument `--port=` on the command line after `node server.js`.
const args = require("minimist")(process.argv.slice(2))
console.log(args)

if (args.help === true) {
    console.log('HELP')
    process.exit(0)
}

// Express
const express = require('express')
const app = express()

const cors = require('cors');

const logdb = require('./database')

const morgan = require('morgan')

//const errorhandler= require('errorhandler')
const fs = require('fs')

// Define allowed argument name 'port'.
//args["port"]
// Define a const `port` using the argument from the command line. 
// Make this const default to port 3000 if there is no argument given for `--port`.
const port = args.port || process.env.PORT || 5000
// Start server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});
// Coin flip functions from a02
// Flip one coin
function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
}
// Flip many coins
function coinFlips(flips) {
    let array = [];
    for (let i = 1; i <= flips; i++) {
        array.push(coinFlip());
    }
    return array;
}
// Count coin flips
function countFlips(array) {
    let counter = {};
    array.forEach(item => {
        if (counter[item]) {
            counter[item]++;
        } else {
            counter[item] = 1;
        }
    });
    return counter;
}
// Call a coin flip
function flipACoin(call) {
    let flip = coinFlip();
    let result;
    if ( flip == call ) {
        result = 'win'
    } else {
        result = 'lose'
    }
    let game = {
        call: call,
        flip: flip,
        result: result
    }
    return game
}

// Use morgan for logging to files
// Create a write stream to append to an access.log file
const accessLog = fs.createWriteStream('access.log', { flags: 'a' })
// Set up the access logging middleware
app.use(morgan('combined', { stream: accessLog }))

app.use( (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        secure: req.secure,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    // 
    console.log(logdata)

    next()
})
// Allow cross-origin requests on all endpoints
app.use(cors())

// Create an endpoint /app/ that has return 200 OK
app.get('/app/', (req, res) => {
    const statusCode = 200
    const statusMessage = 'OK'
    res.status(statusCode).end(statusCode+ ' ' +statusMessage)
});
// Endpoint /app/flip/ that returns JSON {"flip":"heads"} or {"flip":"tails"} 
// corresponding to the results of the random coin flip.
app.get('/app/flip/', (req, res) => {
    const flip = coinFlip()
    res.status(200).json({ "flip" : flip })
});

app.get('/app/flips/:number', (req, res, next) => {
    const flips = coinFlips(req.params.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
});

app.get('/app/flip/call/:guess(heads|tails)/', (req, res) => {
    const game = flipACoin(req.params.guess)
    res.status(200).json(game)
})

// Error test
app.get('/app/error/', (req, res) => {
    throw new Error('Error test works.')
})

// Default API endpoint that returns 404 Not found for any endpoints that are not defined.
app.use(function(req, res){
    const statusCode = 404
    const statusMessage = 'NOT FOUND'
    res.status(statusCode).end(statusCode+ ' ' +statusMessage)
});

// Tell STDOUT that the server is stopped
process.on('SIGINT', () => {
    server.close(() => {
		console.log('\nApp stopped.');
	});
});