const express = require('express')
// const cors = require('cors')
const app = express()

// Make Express use its own built-in body parser for both URL-encoded and JSON
app.use(express.urlencoded({"extended":"true","type":"application/x-www-form-urlencoded"}))
app.use(express.json())
// app.use(cors({
//     origin: '*'
// }))

const logging = (req, res, next) => {
    console.log(req.body.number)
    next()
}

var port = 5000

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%',port))
})

function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails';
}

app.get('/app', (req, res) => {
    res.status(200).end('OK')
    res.type('text/plain')
})

app.get('/app/echo/:number', express.json(), (req, res) => {
    res.status(200).json({ 'message': req.params.number })
})

//app.get('/app/echo/', (req, res) => {
  //  res.status(200).json({ 'message': req.query.number })
//})

app.get('/app/echo/', logging, (req, res) => {
    res.status(200).json({ 'message': req.body.number })
})

app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(200).json({ 'flip' : flip })
})

// app.get('/app/bodytest', (req, res, next) => {
//     res.statusCode = 200
//     res.statusMessage = 'OK'
//     console.log(req.query.guess)
//     res.send(req.query.guess)
// });

app.get('/app/flip/call', (req, res) => {
    const game = flipACoin(req.query.guess)
    res.status(200).json(game)
});

app.use(function(req, res) {
    res.status(404).end("Endpoint does not exist")
    res.type("text/plain")
})

