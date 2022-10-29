localStorage.clear()
try {
    document.querySelector("button[role='signup']").addEventListener('click', function(){
        location.href = "../signup"
    })
    document.login.onsubmit = function(event){
        event.preventDefault();
        var email = document.querySelector("input[type=email]").value
        localStorage.setItem("username",email)
        location.href = "./Chat"
    }
} catch (error) {
    console.log(error.name)
}