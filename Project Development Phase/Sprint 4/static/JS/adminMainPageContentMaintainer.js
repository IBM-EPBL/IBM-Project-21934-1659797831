var ticket_id = undefined, selected_ticket = undefined;
var details = {
    id: undefined,
    tid: undefined,
    aname: undefined,
    amail: undefined
}
class Client {
    constructor(name, date, email, query, ticket_id, status, company){
        this.name = name;
        this.date = date;
        this.email = email;
        this.query = query;
        this.ticket_id = ticket_id;
        this.status = status;
        this.company = company
        this.clientForm = document.forms['assign-task']
        this.agentDetails = undefined
        this.init()
    }
    init() {
        this.clientForm.reset()
        this.clientForm['customer-name'].value = this.name;
        this.clientForm['customer-email'].value = this.email;
        this.clientForm['customer-date'].value = ((String(this.date)).split('-').reverse()).join('-')
        this.clientForm['customer-query'].value = this.query
        this.clientForm['company-name'].value = this.company
        this.clientForm['company-date'].value = new Date().toISOString().split('T')[0];
        try {
            document.querySelectorAll('.company-department').forEach(val => {val.remove()})
            document.querySelectorAll('.agent-dropdown').forEach(val => {val.remove()})
            document.querySelectorAll('.loading-spin')[1].classList.remove('disabled')
        } catch (error) {}
        this.getCompany()
    }
    getCompany(){
        let companyName = {'name': this.clientForm['company-name'].value}
        $.ajax({
            type: "POST",
            url: "/getCompanyDepartment",
            data: JSON.stringify(companyName),
            contentType: "application/json",
            dataType: 'json',
            success: function(response) {
                document.querySelectorAll('.loading-spin')[0].classList.add('disabled')
                try {
                    document.querySelectorAll('.company-department').forEach(val => {val.remove()})
                } catch (error) {}
                let dept = response.department
                dept.forEach(val => {
                    let a = document.createElement('a')
                    a.href = '#'
                    a.classList.add('dropdown-item')
                    a.classList.add('company-department')
                    a.innerText = val
                    document.querySelectorAll('.dropdown-menu')[0].appendChild(a)
                })
                document.querySelectorAll('.company-department').forEach(val => {
                    val.addEventListener('click', function() {
                        document.querySelectorAll('.loading-spin')[1].classList.remove('disabled')
                        document.forms['assign-task']['company-agent-category'].value = val.innerText
                        document.querySelectorAll('.agent-dropdown').forEach(val => {
                            val.remove()
                            document.forms['assign-task']['company-agent-name'].value = ""
                            document.forms['assign-task']['agent-email'].value = ""
                        })
                        let department = {'name': val.innerText}
                        $.ajax({
                            type: "POST",
                            url: "/getAgentDetails",
                            data: JSON.stringify(department),
                            contentType: "application/json",
                            dataType: 'json',
                            success: function(response) {
                                document.querySelectorAll('.loading-spin')[1].classList.add('disabled')
                                try {
                                    document.querySelectorAll('.agent-dropdown').forEach(val => {val.remove()})
                                } catch (error) {}
                                this.agentDetails = response.agentdetails
                                this.agentDetails.name.forEach(val => {
                                    let a = document.createElement('a')
                                    a.href = '#'
                                    a.classList.add('dropdown-item')
                                    a.classList.add('agent-dropdown')
                                    a.innerText = val
                                    document.querySelectorAll('.dropdown-menu')[1].appendChild(a)
                                })
                                document.querySelectorAll('.agent-dropdown').forEach(val => {
                                    val.addEventListener('click', () => {
                                        document.forms['assign-task']['company-agent-name'].value = val.innerText
                                        let index = this.agentDetails.name.indexOf(val.innerText,0)
                                        document.forms['assign-task']['agent-email'].value = this.agentDetails.mail[index]
                                        details.id = this.agentDetails.id[index], details.tid = ticket_id, details.aname = val.innerText, details.amail = this.agentDetails.mail[index]
                                        document.querySelectorAll('.dropdown-menu')[1].classList.contains('show') ? document.querySelectorAll('.dropdown-menu')[1].classList.remove('show') : document.querySelectorAll('.dropdown-menu')[1].classList.add('show')
                                    })
                                })
                            }
                        })
                        document.querySelectorAll('.dropdown-menu')[0].classList.contains('show') ? document.querySelectorAll('.dropdown-menu')[0].classList.remove('show') : document.querySelectorAll('.dropdown-menu')[0].classList.add('show')
                    })
                })
                document.querySelector('.company-agent-category').addEventListener('change input forminput', function() {
                    
                })
            }
        })
    }
}

document.querySelector('button[role=assignTicket]').addEventListener('click', async function() {
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
          "status": "updated",  
          "ticket_status": "Opened", 
          "ticket_id": details.tid,
          "agent_id": details.id,
          "ticket_date": currentDate
        }
      )
    });
    const content = await rawResponse.json();
    let clientForm = document.forms['assign-task']
    let serverEmail = [
        {
            Status: "session",
            Name: clientForm['customer-name'].value,
            Email: clientForm['customer-email'].value,
            Link: content.session_id
        },
        {
            Status: "session",
            Name: details.aname,
            Email: details.amail,
            Link: content.session_id
        }
    ]
    if(content.message == "Successfully Updated Query") {
        serverEmail.forEach(val => {
            $.ajax({
                type: "POST",
                url: "/sendSessionLink",
                data: JSON.stringify(val),
                contentType: "application/json",
                dataType: 'json',
                success: function(response) {
                    if (response[0].Success == "Ok") {
                        document.querySelector('.ticket-box').childNodes[3].childNodes[1].childNodes[3].childNodes[1].classList.add('green')
                        document.querySelector('.ticket-box').childNodes[3].childNodes[1].childNodes[3].childNodes[1].innerText = 'Opened'
                        document.forms['assign-task'].reset()
                        resetToDefault()
                    }
                }
            })
        })
    }
})



var datas = [];
function myFunc(data){
    datas = data
}

document.querySelectorAll('.ticket-box').forEach(val => {
    val.addEventListener('click', async () => {
        document.forms['assign-task'].reset()
        document.querySelectorAll('.loading-spin')[2].classList.contains('disabled') ? document.querySelectorAll('.loading-spin')[2].classList.remove('disabled') : document.querySelectorAll('.loading-spin')[2].classList.add('disabled')
        document.querySelector('.display-form').classList.contains('disabled') ? document.querySelector('.display-form').classList.remove('disabled') : document.querySelector('.display-form').classList.add('disabled')
        document.querySelector('.submit.cancel').classList.contains('disabled') ? document.querySelector('.submit.cancel').classList.remove('disabled') : document.querySelector('.submit.cancel').classList.add('disabled')
        setTimeout(() => {
            document.querySelector('.submit.cancel').classList.remove('disabled')
            document.querySelector('.loading-spin').classList.add('disabled')
            document.querySelector('.display-form').classList.remove('disabled')
        }, 2500)
        val.classList.forEach(val => {
            if(val.includes('ticket-#'))
                ticket_id = val.replace('ticket-#','')
        })
        let status = val.children[1].children[0].children[1].children[0].innerText
        if (status.includes('Opened') || status.includes('Review') || status.includes('Closed')) {
            console.log("true")
            document.querySelector('button[role=assignTicket]').setAttribute('disabled', '')
        }
        else
            document.querySelector('button[role=assignTicket]').removeAttribute('disabled')
        const index = datas.findIndex(objects => {
            return objects.ticket_id == ticket_id
            
        })
        selected_ticket = val
        new Client(datas[index].name, datas[index].date, datas[index].email, datas[index].query, datas[index].ticket_id, 'Opened', datas[index].company)
        document.querySelector('.default-index-page').classList.add('disabled');
        document.querySelector('.form-ticket-assign').classList.remove('disabled');
    })
})

document.querySelector('.company-agent-name').addEventListener('click', function(){
    document.querySelectorAll('.dropdown-menu')[1].classList.contains('show') ? document.querySelectorAll('.dropdown-menu')[1].classList.remove('show') : document.querySelectorAll('.dropdown-menu')[1].classList.add('show')
    document.querySelectorAll('.dropdown-menu')[0].classList.remove('show')
})

document.querySelector('.company-agent-category').addEventListener('click', function(){
    document.querySelectorAll('.dropdown-menu')[0].classList.contains('show') ? document.querySelectorAll('.dropdown-menu')[0].classList.remove('show') : document.querySelectorAll('.dropdown-menu')[0].classList.add('show')
    document.querySelectorAll('.dropdown-menu')[1].classList.remove('show')
})

document.querySelector('.cancelAgent').addEventListener('click', function(event) {
    event.preventDefault()
    document.querySelector('.black-screen ').classList.remove('disabled')
})

document.querySelector('.stay-agent-form').addEventListener('click', function() {
    document.querySelector('.black-screen').classList.add('disabled')
})

document.querySelector('.leave-agent-form').addEventListener('click', resetToDefault)

function resetToDefault() {
    document.querySelector('.black-screen').classList.add('disabled');
    document.querySelector('.default-index-page').classList.remove('disabled');
    document.querySelector('.form-ticket-assign').classList.add('disabled');
}

function submitCancel() {
    document.querySelector('.default-index-page').classList.remove('disabled')
    document.querySelector('.form-ticket-assign').classList.add('disabled')
}
