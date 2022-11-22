var serverLink = undefined,tStatus = undefined, tId = undefined, previous = undefined;
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
        this.init()
    }
    init() {
        this.clientForm.reset()
        this.clientForm['customer-name'].value = this.name;
        this.clientForm['customer-email'].value = this.email;
        this.clientForm['customer-date'].value = ((String(this.date)).split('-').reverse()).join('-')
        this.clientForm['customer-query'].value = this.query
        document.querySelectorAll('.circle').forEach(val => {
            if(val.hasAttribute('style')){
                val.removeAttribute('style')
            }
        })
        if(this.status == "Processing"){
            document.querySelector('.status-1').setAttribute('style','background-color: #d9d8d8;')
            previous = 1
        }
        else if(this.status == "Opened"){
            document.querySelector('.status-2').setAttribute('style','background-color: #d9d8d8;')
            previous = 2
        }
        else if(this.status == "Review"){
            document.querySelector('.status-3').setAttribute('style','background-color: #d9d8d8;')
            previous = 3
        }
        else if(this.status == "Closed"){
            document.querySelector('.status-4').setAttribute('style','background-color: #d9d8d8;')
            previous = 4
        }
        this.startSelectStatus()
    }
    startSelectStatus() {
        tId = this.ticket_id
        tStatus = undefined;
        document.querySelectorAll('.status-name').forEach(val => {
            val.addEventListener('click', async function() {
                tStatus = val.innerText
                document.querySelector(`.status-${previous}`).removeAttribute('style')
                previous = val.classList[1]
                document.querySelector(`.status-${val.classList[1]}`).setAttribute('style','background-color: #d9d8d8;')
            })
        })
    }
}

var datas = [];
function myFunc(data){
    datas = data
}

try {
    let id = {id: 0};
    document.cookie.split('; ').forEach(val => {
        if(val.includes('_id')){
            id.id = val.split('_id=')[1];
        }
    })
    if(document.cookie === ''){location.href = `${location.origin}/tempLogin`}
    if(id.id == 0){
        
    }
} catch (error) {
    
}

document.querySelectorAll('.ticket-box').forEach(val => {
    val.addEventListener('click', async () => {
        document.forms['assign-task'].reset()
        document.querySelector('.loading-spin').classList.contains('disabled') ? document.querySelector('.loading-spin').classList.remove('disabled') : document.querySelector('.loading-spin').classList.add('disabled')
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
        const index = datas.findIndex(objects => {
            return objects.ticket_id == ticket_id
            
        })
        selected_ticket = val
        document.querySelector('.default-index-page').classList.add('disabled');
        document.querySelector('.form-ticket-assign').classList.remove('disabled');
        const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/getCustomeDetails.json', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "request": "getTicketLink",
                    "value": Number(ticket_id)
                }
            )
        });
        const content = await rawResponse.json();
        console.log(content.session_link)
        if(String(content.session_link) != "#")
            document.querySelector('a[target=_blank]').href = `${location.origin}/Chat?session=${content.session_link}`
        new Client(datas[index].name, datas[index].date, datas[index].email, datas[index].query, datas[index].ticket_id, datas[index].ticket_status.message, datas[index].company)
    })
})

document.querySelector('button[role=Status]').addEventListener('click', async function() {
    const rawResponse = await fetch('https://jp-tok.functions.appdomain.cloud/api/v1/web/fcd05172-d405-4c41-b460-d62a1ff87d93/CCR/insertTicket.json', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
            "status": "updateStatus",  
            "ticket_status": tStatus, 
            "ticket_id": tId
            }
        )
    });
    const content = await rawResponse.json();
    if(content.message == "Successfully Updated Query" ) {
        resetToDefault()
    }
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
