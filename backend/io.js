const sio = require('socket.io')

const io = sio()

io.on('connection', (socket) => {
  console.log(socket.id + ' connected')

  socket.join(socket.id)

  socket.on('join-room', data => {
    console.log('user '+ socket.id +' joined room')
    // socket.join(data.room)
    socket.join(socket.id)
    // socket.emit('room',socket.id)
  })

  socket.on('disconnect', () => {
    console.log('user '+ socket.id +' disconnected')
  })
})

module.exports = io
