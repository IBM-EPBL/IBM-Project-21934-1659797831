const date = new Date()

history.pushState('login','login','/login')

try {
    let cookies = document.cookie.split('; ')
    let message = undefined;
    cookies.forEach((val) => {
        if(val.includes('Message')){
            message = val.replace('Message=')
        }
    })
    document.querySelector('.insertError').innerText = message
    document.querySelector('#Error-Message').setAttribute('class','enable')

    setTimeout(() => {
        document.querySelector('#Error-Message').setAttribute('class', 'goRight')
    }, 5000)
    setTimeout(() => {
        document.querySelector('#Error-Message').removeAttribute('class')
    }, 6000)
} catch (error) {}
