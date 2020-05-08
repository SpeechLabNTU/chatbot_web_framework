const sio = require('socket.io')

const io = sio()

io.on('connection', (socket) => {
  console.log(socket.id + ' connected')
  socket.join(socket.id)
})

module.exports = io