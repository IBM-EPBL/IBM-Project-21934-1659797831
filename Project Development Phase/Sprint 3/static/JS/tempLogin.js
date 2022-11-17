document.querySelector('button[role=signin]').addEventListener('click', async function(event) {
    event.preventDefault();
    let serverEmail = {
        status: "verify",
        username: document.forms.login.email.value,
        password: document.forms.login.password.value
    }
    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/loginVerify.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverEmail)
    });
    const content = await rawResponse.json();
    if (content.message == "Dummy Password Matched") {
        document.querySelector('.prelogin').classList.add('disabled')
        document.querySelector('.afterlogin').classList.remove('disabled')
    }
    else if(content.message == true) {
        document.cookie = "_id="+content["_id"]+"; "
        get(content["_id"])
        location.href = './agentPage'
    }
})
document.querySelector('button[role=submit]').addEventListener('click', async function(event) {
    event.preventDefault();
    let serverEmail = {
        status: "update",
        username: document.forms.login.email.value,
        password: document.forms.login.newpassword.value
    }
    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/loginVerify.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverEmail)
    });
    const content = await rawResponse.json();
    if (content.message == "Dummy Password Matched") {
        document.querySelector('.prelogin').classList.add('disabled')
        document.querySelector('.afterlogin').classList.remove('disabled')
    }
    else if(content.message == true) {
        console.log("called")
        document.cookie = "_id="+content["_id"]+"; "
        get(content["_id"])
        location.href = './agentPage'
    }
})
async function get(id){
    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getCustomeDetails.json', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "request": "getAgentUserDetails",
                "value": id
            }
        )
    });
    const content = await rawResponse.json();
    localStorage.setItem('details', JSON.stringify(content))
}
