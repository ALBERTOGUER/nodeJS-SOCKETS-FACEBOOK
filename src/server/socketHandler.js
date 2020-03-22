import connection from './connection';
import {
    matchHash,
    createToken,
    validateToken,
    createHash,
    salt
} from './hasher'

export default (io, userName, activeUsers, messageSended) => (socket) => {
    console.log('start sockets')
    connection.query('select * from states where status = 1 ', (err, results) => {
        if (!err) {

            console.log(results);

            io.emit('start', results);
        }
    })
    connection.query('select userName, COUNT(*) FROM states GROUP BY userName ORDER BY COUNT(*) DESC LIMIT 3', (err, results) => {
        if (!err) {

            console.log(results);

            io.emit('activeUserStates', results);
        }
    })
    




    socket.on('senState', (info) => {


        const activeUser = activeUsers.find(a => a.id === socket.id)
        let tiempo = Date.now();
        let usuario = 'user'
        if (activeUser) {
            usuario = activeUser.user
        }

        const data = {
            text: info.text,
            id: socket.id,
            user: usuario,
            tiempo,
            likes: 0
        }
        messageSended.push(data)

        let likes = 0
        let status = 1
        if (validateToken(info.token)) {
            connection.query('insert into states (text, userName,likes, status)  values (?,?,?,?)', [info.text, info.user, likes, status], (err, result) => {
                if (!err) {
                    connection.query('select * from states where status = 1 ', (err, results) => {
                        if (!err) {

                            console.log(results);

                            io.emit('broadcastState', results)
                        }
                    })
                }
            })
        }


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
        /*  const counterLikes = messageSended.find(a => a.id === data.id && Number(a.tiempo) === Number(data.tiempo))
         if (counterLikes) {
             counterLikes.likes++
         }
         console.log(counterLikes); 
         io.emit('broadcastState', messageSended)*/
        if (validateToken(data.token)) {
            connection.query('update states set likes = likes + 1 where id = ?', [data.id], (err, result) => {
                if (!err) {
                    connection.query('select * from states where status = 1 ', (err, results) => {
                        if (!err) {

                            console.log(results);

                            io.emit('broadcastState', results);
                        }
                    })
                }

            })
        }
        
    })

    socket.on('deleteComment', (data) => {
        /* const index = messageSended.findIndex(a => a.id === data.id && Number(a.tiempo) === Number(data.tiempo))
        if (socket.id === data.id) {

            messageSended.splice(index, 1)
        } 
        io.emit('broadcastState', messageSended)*/
        if (validateToken(data.token)) {
            connection.query('update states set status = 0 where id = ?', [data.id], (err, result) => {
                if (!err) {
                    connection.query('select * from states where status = 1 ', (err, results) => {
                        if (!err) {

                            console.log(results);

                            io.emit('broadcastState', results);
                        }
                    })
                }

            })
        }
    })

    socket.on('doLogin', (data) => {
        console.log(data);

        connection.query('select * from usuarios where userName = ?', [data.userName], (err, result) => {
            if (!err) {
                if (result.length === 1) {
                    if (matchHash(data.password, result[0].password)) {
                        const token = createToken({
                            userName: data.userName
                        });

                        if (validateToken(token)) {
                            io.emit('successLogin', token, result);
                        }
                    } else {
                        console.log('failedLogin', 'invalid credentials')
                        io.emit('failedLogin', 'invalid credentials');
                    }
                } else {
                    console.log('failedLogin', 'user not found')
                    io.emit('failedLogin', 'user not found');
                }
            } else {
                console.log('failedLogin', err.message)
                io.emit('failedLogin', err.message);
            }
        });
    });

    socket.on('newUserDB', (data)=>{

        
        let value = salt()
        var hash = createHash(data.password, value);
        
        
        connection.query('insert into usuarios (userName,password) values(?,?)',[data.user,hash],(err,result)=>{
            if(!err){
                io.emit('UserCreated', 'Creado exitosamente');
            }else{
                io.emit('UserCreated', 'Error al crear');
            }
        })
    })

}