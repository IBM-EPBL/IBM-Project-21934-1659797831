document.querySelector('button[role=verifySignup]').addEventListener('click', function(event) {
    event.preventDefault();
    alert()
})
function check() {
    document.getElementsByName('addAgents').forEach(val => {
        if(!val.checked){
            document.querySelector('.create-agents').classList.remove('disabled')
        }
        else {
            document.querySelector('.create-agents').classList.add('disabled')
        }
    })
}