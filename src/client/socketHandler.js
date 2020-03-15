

export default (socketClient, ui) => {

    socketClient.on('start', (data) => {

       
        console.log(data);


         ui.states.innerHTML = ''
         data.forEach(message => {
          ui.states.innerHTML += `<div class="comment">
         <div class="userTime">
          <img class="imgUser" src="https://growingsmilestx.com/wp-content/uploads/2019/04/206855.png"></img>
         <div class="up">
         <h4>${message.user}</h4>
         <span class="span">${message.tiempo}</span>
         </div>
         </div>
         <hr>
         <p>${message.text}</p>
         <p><img class="imgLike" src="https://i.ya-webdesign.com/images/like-button-png-5.png"></img> ${message.likes}</p>
         <hr>
         <button class="like" onClick="window.ui.sendLike('${message.id}')">Me gusta</button>
         <button class="like" onClick="window.ui.deleteComment('${message.id}','${message.tiempo}')">Eliminar publicación</button>
         <hr>
         </div>`
        })
    })

    socketClient.on('broadcastState', (data) => {
        console.log('broadcastState', data);
        ui.states.innerHTML = ''
        data.forEach(message => {
         ui.states.innerHTML += `<div class="comment">
        <div class="userTime">
        <img class="imgUser" src="https://growingsmilestx.com/wp-content/uploads/2019/04/206855.png"></img>
        <div class="up">
        <h4>${message.user}</h4>
        <span class="span">${message.tiempo}</span>
        </div>
        </div>
        <p>${message.text}</p>
        <p><img class="imgLike" src="https://i.ya-webdesign.com/images/like-button-png-5.png"></img> ${message.likes}</p>
        <hr>
        <button  class="like" onClick="window.ui.sendLike('${message.id}','${message.tiempo}')">Me gusta</button>
        <button  class="like" onClick="window.ui.deleteComment('${message.id}','${message.tiempo}')">Eliminar publicación</button>
        <hr>
        </div>`
        })
    })


   

    socketClient.on('broadcastUser', (data) => {
        console.log(data);

        let activeUser = data.find(a => a.id === socketClient.id)
        console.log();

        ui.userTitle.innerText = activeUser.user
    })
}