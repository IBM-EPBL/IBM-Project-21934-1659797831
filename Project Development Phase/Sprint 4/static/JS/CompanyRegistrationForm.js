var store = 1,rows_created = 1,deleted_row = 0;
var names = [],Email = [],Department =[];
let table = document.createElement('table')
let thead = document.createElement('thead')
let tbody = document.createElement('tbody')
let button = document.createElement('input')
table.appendChild(thead)
table.appendChild(tbody)

function check() {
    document.getElementsByName('addAgents').forEach(val => {
        if(!val.checked){
            document.querySelector('.create-agents').classList.remove('disabled')
            newEle()
        }
        else {
            document.querySelector('.create-agents').classList.add('disabled')
        }
    })
}

document.querySelector('button[role=verifySignup]').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('.black-screen').classList.remove('disabled')
});

document.querySelector('#submitData').addEventListener('click', function(event) {
    newAgentsData()
});

function newAgentsData() {
    var formData = new FormData();
    let companyForm = document.forms.companySignup
    let name = companyForm.name.value
    let desc = companyForm.desc.value
    let email = companyForm.email.value
    let number = companyForm.number.value

    formData.append('file', document.getElementById("companyLogo").files[0]);

    formData.append('name', name);
    formData.append('email', email);
    formData.append('desc', desc);
    formData.append('number', number);

    $.ajax({
        type: "POST",
        url: "/uploadCompany",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if(response.message == "success") {
                for(let i=0; i<document.getElementsByName('Name').length; i++) {
                    let obj = {}
                    obj.name = document.getElementsByName('Name')[i].value
                    obj.dept = document.getElementsByName('Department')[i].value
                    obj.mail = document.getElementsByName('Email')[i].value
                    $.ajax({
                        type: "POST",
                        url: "/uploadAgents",
                        data: JSON.stringify(obj),
                        contentType: "application/json",
                        dataType: 'json',
                        success: function(response) {
                            if(response.message.message == "successfully inserted" && i  ==  document.getElementsByName('Name').length - 1){
                                document.querySelector('.black-screen').classList.add('disabled')
                                document.forms.companySignup.reset()
                            }
                        }
                    })
                }
            }
        },
        error: function(errResponse) {
            console.log(errResponse);
        }
    });
}

function newEle(){
    var r = 1,c =3;
    document.querySelector('.Agent-1').appendChild(table)
    for(let i=0;i<r;i++){
        let row = document.createElement('tr')
        for(let j=0;j<c+1;j++) {
            let ele = document.createElement('input')
            if(j === 0 || j === 1 || j === 2){
                ele.setAttribute('type','text')
                ele.setAttribute('class',"input"+(store))
                store=store+1;
                if(i===0 && j===0){
                    ele.name = "Name";
                    ele.placeholder = "Agent Name"
                }else if (i===0 && j===1) {
                    ele.name = 'Email';
                    ele.placeholder = 'Agent Email';
                }else if (i===0 && j===2) {
                    ele.name = 'Department';
                    ele.placeholder = 'Agent Department';
                }
            }else{
                ele = document.createElement('button')
                ele.setAttribute("onclick","del("+rows_created+")")
                ele.setAttribute('class',"register btn btn-danger button-"+rows_created)
                store=store+1;
                let i = document.createElement('i')
                i.classList.add('fa','fa-close')
                ele.appendChild(i)
            }
            let col = document.createElement('td')
            col.appendChild(ele)
            row.appendChild(col)
        }
        tbody.appendChild(row)
        deleted_row = rows_created
        rows_created = rows_created + 1;
    }
    
}
function del(value){
    deleted_row = deleted_row - 1;
    try {
        let button = document.querySelector(".button-"+value)
        button.parentElement.parentElement.remove()
    } catch (error) {
        console.log(error)
    }
    rows_created = deleted_row
}