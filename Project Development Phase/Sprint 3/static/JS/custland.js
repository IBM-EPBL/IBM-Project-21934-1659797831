var company_id = undefined, customer_id = "";
try {
    document.querySelector('.ticket-icons').addEventListener('click', function() {
        location.href = "./ticketHistory"
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
    try {
        let id = {id: 0};
        document.cookie.split('; ').forEach(val => {
            if(val.includes('_id')){
                id.id = val.split('_id=')[1];
            }
        })
        if(id.id !== 0){
            get(id)
        }
    } catch (error) {
        
    }
} catch (error) {}

async function get(id){
    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getUserDetails.json', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    });
    const content = await rawResponse.json();
    localStorage.setItem('details', JSON.stringify(content.userDetails))
    document.querySelector('.Name_Profile').innerText = content.userDetails.name
}

async function getCompanyList (){ 
    await fetch('./getCompany').then((response) => {
        response.json().then(data => {
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
                button.setAttribute('class', 'btn btn-primary raise-query')
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
            document.querySelectorAll('.raise-query').forEach(val => {
                val.addEventListener('click', async function() {
                    let queryForm = document.forms.query
                    queryForm.cname.value = val.parentElement.firstChild.innerText
                    document.querySelector('.company-form-logo').src = val.parentElement.firstChild.firstChild.src
                    let details = JSON.parse(localStorage.getItem('details'))
                    queryForm.name.value = details.name
                    queryForm.email.value = details.mail
                    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getCustomeDetails.json', {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(
                            {
                                "request": "getCompandCustId",
                                "value1": details.mail,
                                "value2": val.parentElement.firstChild.innerText
                            }
                        )
                    });
                    const content = await rawResponse.json();
                    customer_id = content.custId
                    company_id = content.CompId
                    document.querySelector('.company-list').classList.add('disabled')
                    document.querySelector('.queryForm').classList.remove('disabled')
                })
            })
        })
    })
}
getCompanyList()

document.querySelector('.signout').addEventListener('click', function() {
    var allCookies = document.cookie.split(';');
    for (var i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
    location.href='./'
})

document.querySelector('button[role=submitQuery]').addEventListener('click', async function(event) {
    event.preventDefault()
    const date = new Date();
    let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/insertTicket.json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "status": "insert",  
          "cust_id": customer_id, 
          "ticket_status": "Processing",
          "comp_id": company_id, 
          "ticket_desc": document.querySelector('textarea').value, 
          "date": currentDate
        }
      )
    });
    const content = await rawResponse.json();
    if(content.message == "Successfully Raised Query") {
        document.querySelector('.company-list').classList.remove('disabled')
        document.querySelector('.queryForm').classList.add('disabled')
        document.forms.query.reset()
    } else if (content.message == "Failed to Raised Query") {
        
    }
  })