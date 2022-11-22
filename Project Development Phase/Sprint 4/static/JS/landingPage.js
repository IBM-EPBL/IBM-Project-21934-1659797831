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

let insideurl = `${location.origin}/login,${location.origin}/signup,${location.origin}/,${location.origin}/CompanyRegistrationForm,${location.origin}`
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
    try {
        let id = {id: 0};
        document.cookie.split('; ').forEach(val => {
            if(val.includes('_id')){
                id = val.split('_id=')[1];
            }
        })
        if(id.id !== 0){
            
            location.href = './home'
        }
    } catch (error) {
        
    }
} else {
    document.querySelectorAll('.navbar-text')[0].classList.add('disabled')
    document.querySelectorAll('.navbar-text')[1].classList.add('disabled')
    document.querySelectorAll('.user-profile')[0].classList.remove('disabled')
}

