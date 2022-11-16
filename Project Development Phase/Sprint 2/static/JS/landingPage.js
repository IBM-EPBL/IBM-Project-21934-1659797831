try {
    setTimeout(function(){
        if(document.cookie.startsWith("_ID:") === true) return
        // document.querySelector(".cookies").style.display = "flex"
    },5000)
    // $('button').on('click',function(){
    //     document.cookie =  '_ID:' + Math.random().toString(36).substr(2, 9) + ";SESSIONID=123";
    //     document.querySelector(".cookies").style.display = "none"
    // })
    document.querySelector('span.cancelCookie').addEventListener('click',()=>{
        document.querySelector(".cookies").style.display = "none"
    })
} catch (error) {}

let insideurl = 'http://127.0.0.1:5000/login,http://127.0.0.1:5000/signup,http://127.0.0.1:5000/,http://127.0.0.1:5000/CompanyRegistrationForm'
let url = location.href
if (insideurl.includes(url)) {
    document.querySelectorAll('.navbar-text')[0].classList.remove('disabled')
    document.querySelectorAll('.navbar-text')[1].classList.remove('disabled')
    document.querySelectorAll('.user-profile')[0].classList.add('disabled')
    document.querySelector("button[role='login']").addEventListener('click', function(event){
        location.href = "../login"
    })
    document.querySelector("button[role='signup']").addEventListener('click', function(){
        location.href = "../signup"
    })
} else {
    document.querySelectorAll('.navbar-text')[0].classList.add('disabled')
    document.querySelectorAll('.navbar-text')[1].classList.add('disabled')
    document.querySelectorAll('.user-profile')[0].classList.remove('disabled')
}

try {
    let cookies = document.cookie.split('; ')
    let session_id_client = undefined;
    cookies.forEach((val) => {
        if(val.includes('_id')){
            session_id_client = val.replace('_id=')
        }
    })
    let session = {
        "session_id": session_id_client
    }
    async (()=>$.ajax({
        type: "POST",
        url: "/session_info",
        data: JSON.stringify(session),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
            if(response[0].message == 'No info'){

            }else{
                user_details = {
                    Name: response[0].Name,
                    Email: response[0].Email,
                    Number: response[0].Number
                }
                location.href = './home'
            }
        }
    }))()
} catch (error) {}