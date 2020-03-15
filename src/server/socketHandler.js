export default (io, userName, activeUsers, messageSended) => (socket) => {
    console.log('start sockets')

    io.emit('start', messageSended);
    socket.on('senState', (text) => {

        const activeUser = activeUsers.find(a => a.id === socket.id)
        let tiempo = Date.now();
        let usuario = 'user'
        if (activeUser) {
            usuario = activeUser.user
        }

        const data = {
            text,
            id: socket.id,
            user: usuario,
            tiempo,
            likes: 0
        }
        messageSended.push(data)
        console.log(messageSended);
        io.emit('broadcastState', messageSended)

    })

    socket.on('sendName', (text) => {

        userName = text
        if (!activeUsers.find(u => u.id === socket.id)) {
            activeUsers.push({
                id: socket.id,
                user: text
            })
            console.log(activeUsers);

        } else if (activeUsers.find(a => a.id === socket.id && a.user !== text)) {
            const activeUser = activeUsers.find(a => a.id === socket.id)
            activeUser.user = text
            console.log(activeUsers)

        }
        io.emit('broadcastUser', activeUsers)
    })

    socket.on('sendLike', (data) => {
        const counterLikes = messageSended.find(a => a.id === data.id && Number(a.tiempo) === Number(data.tiempo))
        if (counterLikes) {
            counterLikes.likes++
        }
        console.log(counterLikes);
        io.emit('broadcastState', messageSended)

    })

    socket.on('deleteComment', (data) => {
        const index = messageSended.findIndex(a => a.id === data.id && Number(a.tiempo) === Number(data.tiempo))
        if (socket.id === data.id) {

            messageSended.splice(index, 1)
        }
        io.emit('broadcastState', messageSended)

    })

}