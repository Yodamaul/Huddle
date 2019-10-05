var fs = require('fs');
var https = require('https');
const express = require('express');
const app = express();
const cors = require('cors')
var options = {
  key: fs.readFileSync('./KEY.pem'),
  cert: fs.readFileSync('./CERTIFICATE.pem')
};

// const corsOptions = {
//   credentials:true,
//   origin: function (origin, callback) {
//       callback(null, true)
//   }
// }
// app.use(cors(corsOptions));
var server = https.createServer(options, app);

var io = require('socket.io')(server);
io.origins('*:*')
io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });


});
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/chat.html');
});
// listen for requests :)
const listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
server.listen(443);