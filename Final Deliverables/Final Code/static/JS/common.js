let insideurl = `${location.origin}/login,${location.origin}/signup,${location.origin}/,${location.origin}/CompanyRegistrationForm,${location.origin},${location.origin}/tempLogin,${location.origin}/agentPage`
let url = location.href
let id = {id: 0};
try {
    document.cookie.split('; ').forEach(val => {
        if(val.includes('_id')){
            id = val.split('_id=')[1];
        }
    })
} catch (error) {}

if(location.href == `${location.origin}/admin/32280/ccrfolks` || location.href == `${location.origin}/customer` || location.href == `${location.origin}/agentPage`) {
    if (location.href == `${location.origin}/admin/32280/ccrfolks` || location.href == `${location.origin}/agentPage`) {
        document.querySelectorAll('.navbar-text')[0].classList.add('disabled')
        document.querySelectorAll('.navbar-text')[1].classList.add('disabled')
        document.querySelectorAll('.user-profile')[0].classList.remove('disabled')
        document.querySelector('.display-user').addEventListener('click', function() {
            let user_profile = document.querySelector('.display-user-profile')
            user_profile.style.display == 'none' ? user_profile.removeAttribute('style') : user_profile.style.display = 'none'
        });
        document.querySelector('.signout').addEventListener('click', function() {
            var allCookies = document.cookie.split(';');
            for (var i = 0; i < allCookies.length; i++)
                document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
            location.href='./'
        })
    }
} else {
    if (insideurl.includes(url)) {
        document.querySelectorAll('.navbar-text')[0].classList.remove('disabled')
        document.querySelectorAll('.navbar-text')[1].classList.remove('disabled')
        document.querySelectorAll('.user-profile')[0].classList.add('disabled')
        document.querySelector("button[role=login]").addEventListener('click', function(event){
            location.href = "../login"
        })
        document.querySelector("button[role=signup]").addEventListener('click', function(){
            location.href = "../signup"
        })
        try {
            if(id.id !== 0){
                if(url == `${location.origin}/`)
                    location.href = './home'
                else
                    location.href = url
            }
        } catch (error) {}
    } else {
        if(!insideurl.includes(url))
            if (id.id === 0) 
                location.href = `${location.origin}/`
    }
}