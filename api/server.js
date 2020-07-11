var express = require('express')
var app = express()
var server = app.listen(8080, '0.0.0.0')
var io = require('socket.io').listen(server)

var sockets = []

io.on('connection', socket => {
  console.log('connected')
  sockets.push(socket)

  socket.on('disconnect', () => {
    console.log('disconnected')
    sockets = sockets.filter(e => e != socket)
  })

  socket.on('data', (msg) => {
    console.log('data')
    sockets.filter(e => e != socket).forEach(s => {
      console.log('emit data')
      s.emit('data', msg)
    })
  })
})

app.get("/connectioncount", (req, res) => {
  res.send(sockets.length)
})