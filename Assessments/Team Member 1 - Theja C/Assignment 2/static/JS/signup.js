var date = new Date()
document.forms.signup.onsubmit = function(event){
    event.preventDefault();
    document.forms.signup.style.pointerEvents = "none";
    document.forms.signup.style.opacity = .5;
    document.querySelector(".spin-ab").removeAttribute("hidden")
    setTimeout(function(){
        location.href = "../login"
        document.forms.signup.reset()
        document.forms.signup.style.removeProperty("pointer-events")
        document.forms.signup.style.removeProperty("opacity")
        document.querySelector(".spin-ab").setAttribute("hidden","")
    },5000)
}
document.querySelectorAll("img")[1].src = "/static/Images/signup-tran.gif?uploaded="+date.getTime();