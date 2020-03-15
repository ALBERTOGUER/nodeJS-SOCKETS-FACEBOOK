export default (socketClient) => {

    const stateText = document.getElementById('state-text')
    const sendState = document.getElementById('send-state')
    const states = document.getElementById('states')
    const sendUserName = document.getElementById('sendUserName')
    const userName = document.getElementById('userName')
    const userTitle = document.getElementById('userTitle')


    sendState.addEventListener('click', () => {
        console.log('senstate', stateText.value);

        if (stateText.value.length > 0) {
            socketClient.emit('senState', stateText.value)
        }
    })

    const sendLike = (id,tiempo )=> {
        console.log(id);
        console.log(tiempo);
        let data={
            id,
            tiempo
        }
        socketClient.emit('sendLike', data)
    }

    const deleteComment = (id,tiempo )=> {
        console.log(id);
        console.log(tiempo);
        let data={
            id,
            tiempo
            
        }
        socketClient.emit('deleteComment', data)
    }

    sendUserName.addEventListener('click', ()=>{
        if(userName.value){
            console.log(userName.value);
            
            socketClient.emit('sendName', userName.value)
        }
    })

    return {
        sendLike,
        deleteComment,
        states,
        userTitle
    }
}