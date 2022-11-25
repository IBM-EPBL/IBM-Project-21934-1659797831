const date = new Date()

history.pushState('login','login','/login')

document.forms.login.onsubmit = async function(event){
    event.preventDefault();
    document.querySelector('button[role=verifyLogin]').style.opacity = '.5' 
    document.querySelector('div.loading-spin').classList.remove('disabled')
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
      if(content.message == true) {
        document.cookie = "_id="+content["_id"]+"; "
        location.href = './home'
      }
}

async function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log(profile)
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      alert("You have been signed out successfully");
  });
}

try {
    let cookies = document.cookie.split('; ')
    let message = undefined;
    cookies.forEach((val) => {
        if(val.includes('Message')){
            message = val.replace('Message=')
            document.querySelector('.insertError').innerText = message
            document.querySelector('#Error-Message').setAttribute('class','enable')
            setTimeout(() => {
                document.querySelector('#Error-Message').setAttribute('class', 'goRight')
            }, 5000)
            setTimeout(() => {
                document.querySelector('#Error-Message').removeAttribute('class')
            }, 6000)
        }
    })
} catch (error) {}
