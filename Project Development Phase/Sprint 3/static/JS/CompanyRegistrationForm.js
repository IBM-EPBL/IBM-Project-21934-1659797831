var store = 1,rows_created = 1,deleted_row = 0;
var names = [],Email = [],Department =[];
let table = document.createElement('table')
let thead = document.createElement('thead')
let tbody = document.createElement('tbody')
let button = document.createElement('input')
table.appendChild(thead)
table.appendChild(tbody)

document.querySelector('button[role=verifySignup]').addEventListener('click', function(event) {
    event.preventDefault();
})
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