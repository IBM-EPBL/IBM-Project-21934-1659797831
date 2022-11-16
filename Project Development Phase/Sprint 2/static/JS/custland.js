try {
    document.querySelector('.ticket-icons').addEventListener('click', function() {
        location.href = "./ticketHistory"
        alert()
    });
    document.querySelectorAll('span[class=navbar-text]').forEach(val => {
        val.setAttribute('class', 'navbar-text disabled')
    });
    document.querySelector('.user-profile').setAttribute('class', 'user-profile position-relative')
    document.querySelector('.display-user').addEventListener('click', function() {
        let user_profile = document.querySelector('.display-user-profile')
        user_profile.style.display == 'none' ? user_profile.removeAttribute('style') : user_profile.style.display = 'none'
    });
    history.pushState('home','home','/home')
} catch (error) {}

async function getCompanyList (){ 
    await fetch('./getCompany').then((response) => {
        response.json().then(data => {
            console.log(data);
            data.forEach(val => {
                let company_info = document.createElement('div')
                company_info.setAttribute('class', 'company-info')
                let logo = document.createElement('div')
                logo.setAttribute('class', 'logo')
                let img = document.createElement('img')
                img.src = val.url
                img.setAttribute('class', 'company-logo')
                logo.appendChild(img)
                company_info.appendChild(logo)
                let company_description = document.createElement('div')
                company_description.setAttribute('class', 'company-description disabled')
                let title = document.createElement('div')
                title.setAttribute('class', 'title')
                let desc_img = document.createElement('img')
                desc_img.src = val.url
                desc_img.width = 60
                title.appendChild(desc_img)
                let p = document.createElement('p')
                p.innerText = val.name
                title.appendChild(p)
                let company_desc = document.createElement('div')
                company_desc.setAttribute('class', 'company-desc text-center')
                company_desc.innerText = val.Description
                company_description.appendChild(title)
                company_description.appendChild(company_desc)
                let button = document.createElement('button')
                button.setAttribute('class', 'btn btn-primary')
                button.innerText = 'Raise Your Query'
                company_description.appendChild(button)
                company_info.appendChild(company_description)
                document.querySelector('.company-line-list').appendChild(company_info)
            })
            document.querySelectorAll('.company-info').forEach(val => {
                val.addEventListener('click', function() {
                    let logo = val.firstChild
                    if(logo.className == 'logo') logo.setAttribute('class', 'logo disabled')
                    else logo.setAttribute('class', 'logo')
                    let desc = val.lastChild
                    if(desc.className == 'company-description disabled') desc.setAttribute('class', 'company-description')
                    else desc.setAttribute('class', 'company-description disabled')
                })
            })
            // document.querySelector('.Name_Profile').innerHTML = user
        })
    })
}
getCompanyList()