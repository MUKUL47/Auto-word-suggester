const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const prefixTree = require("./prefixTree")
app.use(express.static(require('path').join(__dirname)));
app.get('/', (req, res) => res.sendFile(__dirname+'/autoWordSuggester.html'))
app.all('*', (req, res) => res.redirect('/'))
io.on('connection', (socket)=> {
    socket.on('getTrainedData', ( ) => {
        prefixTree.getSuffixes().
        then( d => io.emit('gotTrainedData', d ))
    })

    socket.on('trainCustomData', (data) => {
        prefixTree.trainCustomData(data).
        then( d => io.emit('gotTrainedData', d ))
    })
    
});
http.listen(process.env.PORT || 3000)