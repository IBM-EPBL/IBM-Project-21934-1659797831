try {
    let id = {id: 0};
    document.cookie.split('; ').forEach(val => {
        if(val.includes('_id')){
            id = val.split('_id=')[1];
        }
    })
    if(id.id === 0){
        location.href = './login'
    }
} catch (error) {
    
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
        this.clientForm['agent-name'].value = this.name;
        this.clientForm['agent-email'].value = this.email;
        this.clientForm['company-date'].value = ((String(this.date)).split('-').reverse()).join('-')
        this.clientForm['customer-query'].value = this.query
        document.querySelectorAll('.circle').forEach(val => {
            if(val.hasAttribute('style')){
                val.removeAttribute('style')
            }
        })
        if(this.status == "Processing"){
            document.querySelector('.status-1').setAttribute('style','background-color: #d9d8d8;')
        }
        else if(this.status == "Opened"){
            document.querySelector('.status-2').setAttribute('style','background-color: #d9d8d8;')
        }
        else if(this.status == "Review"){
            document.querySelector('.status-3').setAttribute('style','background-color: #d9d8d8;')
        }
        else if(this.status == "Closed"){
            document.querySelector('.status-4').setAttribute('style','background-color: #d9d8d8;')
        }
    }
}

var datas = [];
function myFunc(data){
    datas = data
}

document.querySelectorAll('.ticket-box').forEach(val => {
    val.addEventListener('click', async () => {
        document.forms['assign-task'].reset()
        document.querySelector('.loading-spin').classList.contains('disabled') ? document.querySelector('.loading-spin').classList.remove('disabled') : document.querySelector('.loading-spin').classList.add('disabled')
        document.querySelector('.display-form').classList.contains('disabled') ? document.querySelector('.display-form').classList.remove('disabled') : document.querySelector('.display-form').classList.add('disabled')
        setTimeout(() => {
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
        document.querySelector('.default-index-page').classList.add('disabled');
        document.querySelector('.form-ticket-assign').classList.remove('disabled');
        selected_ticket = val
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
        if(String(content.session_link) != "#")
            document.querySelector('a[target=_blank]').href = `${location.origin}/Chat?session=${content.session_link}`
        new Client(datas[index].name, datas[index].date, datas[index].email, datas[index].query, datas[index].ticket_id, datas[index].ticket_status.message, datas[index].company)
    })
})

function resetToDefault() {
    document.querySelector('.black-screen').classList.add('disabled');
    document.querySelector('.default-index-page').classList.remove('disabled');
    document.querySelector('.form-ticket-assign').classList.add('disabled');
}
