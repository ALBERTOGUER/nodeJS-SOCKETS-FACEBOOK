export default (socketClient) => {

    const stateText = document.getElementById('state-text')
    const sendState = document.getElementById('send-state')
    const states = document.getElementById('states')
    const sendUserName = document.getElementById('sendUserName')
    const userName = document.getElementById('userName')
    const userTitle = document.getElementById('userTitle')
    const doLogin = document.getElementById('do-login');
    const wall = document.getElementById('wall');
    const login = document.getElementById('login');
    const activeUserStates = document.getElementById('activeUserStates');
    const buttonRegister = document.getElementById('buttonRegister');
    const inputNewUser = document.getElementById('inputNewUser');
    const inputNewPassword = document.getElementById('inputNewPassword');
    const message = document.getElementById('message');

    const clienData = {
        token: '',
        user:''
    };

    function updateClientData(token,user) {
        clienData.token = token;
        clienData.user = user;
    }

    buttonRegister.addEventListener('click',()=>{
        if(inputNewUser.value.length > 0 && inputNewPassword.value.length > 0){
            let data = {
                
                user: inputNewUser.value,
                password: inputNewPassword.value
            } 
            socketClient.emit('newUserDB', data) 
        }
    })

    sendState.addEventListener('click', () => {
        console.log('senstate', stateText.value);

        if (stateText.value.length > 0) {
            let data = {
                token: clienData.token,
                user: clienData.user,
                text: stateText.value
            } 
            socketClient.emit('senState', data)
        }
    })

    const sendLike = (id) => {
        let data = {
            id,
            token : clienData.token
        }
        socketClient.emit('sendLike', data)
    }

    const deleteComment = (id) => {
        let data = {
            id,
            token : clienData.token

        }
        socketClient.emit('deleteComment', data)
    }

    sendUserName.addEventListener('click', () => {
        if (userName.value) {
            console.log(userName.value);

            socketClient.emit('sendName', userName.value)
        }
    })

    doLogin.addEventListener('click', () => {
        if (userName.value.length > 0 && password.value.length > 0) {
            socketClient.emit('doLogin', {
                userName: userName.value,
                password: password.value
            });
            socketClient.emit('sendName', userName.value)
        }
    });

    return {
        sendLike,
        deleteComment,
        states,
        userTitle,
        wall,
        login,
        updateClientData,
        activeUserStates,
        message
    }
}