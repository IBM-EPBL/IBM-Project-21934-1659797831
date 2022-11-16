var date = new Date(), verficationCode = undefined, seconds = 30
let timer = setInterval(() => {
  if(seconds >= 1){
    document.querySelector('.resend').innerText = seconds
    seconds -= 1
  }
},1000)
document.forms.signup.onsubmit = function(event){
    event.preventDefault();
    document.forms.signup.style.pointerEvents = "none";
    document.forms.signup.style.opacity = .5;
    document.querySelector(".spin-ab").removeAttribute("hidden")
    try {
      let serverEmail = {
        Name: document.forms.signup.name.value,
        Email: document.forms.signup.email.value
      }
      $.ajax({
        type: "POST",
        url: "/verify_mail",
        data: JSON.stringify(serverEmail),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
          if(response[0].Success == "Ok"){
            setTimeout(function(){
              document.forms.signup.style.removeProperty("pointer-events")
              document.forms.signup.style.removeProperty("opacity")
              document.querySelector(".spin-ab").setAttribute("hidden","")
              document.querySelector('.preSignup').setAttribute('class', 'preSignup disabled')
              document.querySelector('.Email-Address').innerText = document.forms.signup.email.value
              if(seconds == 0){
                console.log('resend');
              }
              document.querySelector('.afterSignup').setAttribute('class', 'afterSignup')
              verficationCode = response[0].Code  
            },5000)
          }
          else if( response[0].Error == "An Same Email is already Existing"){
            setTimeout(function(){
              document.forms.signup.style.removeProperty("pointer-events")
              document.forms.signup.style.removeProperty("opacity")
              document.querySelector(".spin-ab").setAttribute("hidden","")
              document.querySelector('.insertError').innerText = response[0].Error
              changeError()
            },5000)
          }
        }
      })
    } catch (error) {}
}

function checkVerifyCode(){
  let code = document.forms.signup.verify_code.value
  if(code.length == 4){
    if(code == verficationCode){
      let form = document.forms.signup
      let user_details = {
        name: form.name.value,
        email: form.email.value,
        number: form.number.value,
        password: form.password.value,
        Cpassword: form.confirmPassword.value
      }
      $.ajax({
        type: "POST",
        url: "/signup_form",
        data: JSON.stringify(user_details),
        contentType: "application/json",
        dataType: 'json',
      })
      document.forms.signup.style.pointerEvents = "none";
      document.forms.signup.style.opacity = .5;
      document.querySelector(".spin-ab").removeAttribute("hidden")
      setTimeout(function(){
        document.forms.signup.reset();
        document.forms.signup.style.removeProperty("pointer-events")
        document.forms.signup.style.removeProperty("opacity")
        document.querySelector(".spin-ab").setAttribute("hidden","")
        document.querySelector('.preSignup').setAttribute('class', 'preSignup')
        document.querySelector('.afterSignup').setAttribute('class', 'afterSignup disabled')
        location.href = './login'
      },3000)
    }else{
      console.log(`Code didn't Matched`);
    }
  }
}

function checkNumber(){
  let phoneNumber = document.forms.signup.number.value
  if(phoneNumber.length != 10){
    document.querySelector('.insertError').innerText = "Enter a valid Phone Number"
    changeError()
  }
}

function sendVerification(){
  try {
    $.ajax({
      type: "POST",
      url: "/sendmail",
      data: 'sekarmoorthy@gmail.com',
      contentType: "application/text",
      dataType: 'text' 
    }).done((response) => {
      console.log(response);
    })
  } catch (error) {}
}

function checkPassword(){
  let password = document.forms.signup.password.value
  let Cpassword = document.forms.signup.confirmPassword.value
  if(password != Cpassword){
    document.querySelector('.password-match').style.transform = 'scale(1)'
  }else{
    document.querySelector('.password-match').style.transform = 'scale(0)'
  }
}

function changeError(){
  document.querySelector('#Error-Message').setAttribute('class','enable')
  setTimeout(() => {
    document.querySelector('#Error-Message').setAttribute('class', 'goRight')
  }, 5000)
  setTimeout(() => {
    document.querySelector('#Error-Message').removeAttribute('class')
  }, 6000)
}

try {
  let cookie = document.cookie.split('=')[1]
  let message = cookie.split('"')[1]

  document.querySelector('.insertError').innerText = message
  changeError()
} catch (error) {}

document.querySelectorAll("img")[1].src = "/static/Images/signup-tran.gif?uploaded="+date.getTime();