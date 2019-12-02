var http = require('http').createServer(require('express')());
var io = require('socket.io')(http);
io.on('connection', (socket)=> socket.on('getTrainedData', ( ) => 
                    require("./prefixTree").getSuffixes().
                    then( d => io.emit('gotTrainedData', d ))));
http.listen(3000,() => console.log('Open autoWordSuggester.html'))