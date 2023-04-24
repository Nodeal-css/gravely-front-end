const inputID = ['firstname', 'lastname', 'mi', 'address', 'phone'];
const update_btn = document.getElementById('update');
const delete_btn = document.getElementById('delete-contract');
const locate = document.getElementById('locate');

loadInfo(getContractID());

window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem('contract-id');
});

document.getElementById('edit').onclick = function() {
    for(let i = 0; i < inputID.length; i++){
        document.getElementById(inputID[i]).removeAttribute('readonly');
    }
    document.getElementById('edit').style.display="none";
    document.getElementById('close').style.display="inline";
    document.getElementById('update').style.display="inline";
}

document.getElementById('close').onclick = function(){
    closeEditBTN();
}

update_btn.addEventListener('click', function(){
    const data = {
        id: getContractID(),
        fname: document.getElementById('firstname').value,
        lname: document.getElementById('lastname').value,
        mi: document.getElementById('mi').value,
        address: document.getElementById('address').value,
        tel: document.getElementById('phone').value
    }

    if(!input_validation(['firstname', 'lastname', 'mi', 'address', 'phone'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }

    update('contract', data).then( function(){
        alert('Contract record has been updated.');
        loadInfo(getContractID());
        closeEditBTN();
    }).catch( function(e){
        console.log(e.message);
    });
});

delete_btn.addEventListener('click', function(){
    if(confirm('Do you want to delete this record?')){
        remove(CONTRACT, getContractID()).then( function(){
            alert('Contract has been removed');
            window.location.href = "../pages/adminContacts.html";
            window.localStorage.removeItem('contract-id');
        }).catch( function(e){
            console.log(e.message);
        });
    }
});

locate.addEventListener('click', function(){
    search(GRAVE, 1, 1, { contract_id: getContractID() }, '+created,contract_id', '')
    .then( function(data){
        window.localStorage.setItem('grave-id-search', data.items[0].id);
        location.href = "../pages/AdminCemeteryMap.html";
    }).catch( function(e){
        console.log(e.message);
    });
});

function closeEditBTN(){
    for(let i = 0; i < inputID.length; i++){
        document.getElementById(inputID[i]).setAttribute('readonly', true);
    }
    document.getElementById('edit').style.display="inline";
    document.getElementById('close').style.display="none";
    document.getElementById('update').style.display="none";
}

function loadInfo(input){
    if(input === null){
        alert('Contract not found, returning to list of contracts.');
        window.location.href = "adminContacts.html";
        return;
    }else{
        search(CONTRACT, 1, 1, { id: input }, '+created,id', '')
        .then( function(data){
            document.getElementById('firstname').value = data.items[0].fname;
            document.getElementById('lastname').value = data.items[0].lname;
            document.getElementById('mi').value = data.items[0].mi;
            document.getElementById('address').value = data.items[0].address;
            document.getElementById('phone').value = data.items[0].tel;
        }).catch( function(e){
            console.log(e.message);
        });
    }
}

function getContractID(){
    return window.localStorage.getItem('contract-id');
}

function input_validation(id = []){
    let flag = true;
    for(let i = 0; i < id.length; i++){
        let input = document.getElementById(id[i]);
        if(!input.checkValidity()){
            flag = false;
            break;
        }
    }
    return flag;
}

