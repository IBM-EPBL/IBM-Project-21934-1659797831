$(document).ready(function(){
    var server_user;
    const urlP = new URLSearchParams(window.location.search)
    const session = urlP.get("session")
    var socket = io.connect(`${location.origin}/`)
    var private = io.connect(`${location.origin}/private`)
    let details = JSON.parse(localStorage.getItem("details"))
    let user = details.mail
    document.querySelector('.profile-name').innerText = details.name
    private.emit('username', {'session_id': session, 'email': user})
    var getUser = setInterval(function(){
        console.log("Still gettin")
        var get_user = io.connect(`${location.origin}/getUser`)
        get_user.emit('getUser', {'session_id': session, 'email': user})
        if(server_user != undefined){
            console.log("cleared",server_user)
            document.querySelector('.status').classList.remove('status-offline')
            document.querySelector('.status').classList.remove('status-online')
            clearInterval(getUser)
            return
        }
        get_user.on('server_client', function(user){
            server_user = user
            console.log(server_user)
        })
    },5000)
    socket.on('connect', function(){
        socket.send("User connected!")
    })
    document.querySelector("#sendBtn").addEventListener('click',function(){
        let message = document.querySelector("#message").value
        let div = document.createElement("div")
        div.classList.add('user-message')
        let innerDiv = document.createElement('div')
        innerDiv.classList.add('justify-content-end')
        let p = document.createElement('p')
        p.innerText = message
        innerDiv.appendChild(p)
        div.appendChild(innerDiv)
        document.querySelector(".messages").appendChild(div)
        document.querySelector("#message").value = ''
        private.emit('private_message', {'session_id':session,'email':server_user, message})
    })
    private.on('recieve_private_message', function(data){
        let div = document.createElement("div")
        div.classList.add('message')
        let innerDiv = document.createElement('div')
        innerDiv.classList.add('justify-content-start')
        let p = document.createElement('p')
        p.innerText = data
        innerDiv.appendChild(p)
        div.appendChild(innerDiv)
        document.querySelector(".messages").appendChild(div)
    })
})

