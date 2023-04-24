const adminList = document.getElementById('admin-list');
const saveAdmin = document.getElementById('admin-register');
const num_rows = document.getElementById('num-rows');

const id_names = {
    "fname": "first name",
    "lname": "last name",
    "mi": "Middle initial",
    "email": "Email",
    "pass": "password",
    "re-pass": "re-entered password"
}

loadUsers(10);

function loadList(arr = []){
    adminList.innerHTML = "";
    for(let i = 0; i < arr.length; i++){
        adminList.innerHTML += '<tr>' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ arr[i].email +'</td>' +
        '<td>'+ '***********' +'</td>' + // change characters
        '<td>'+ arr[i].firstname +'</td>' +
        '<td>'+ arr[i].lastname +'</td>' +
        '<td>'+ arr[i].mi +'</td>' +
        '<td><button class="btn btn-outline-danger" onclick="deleteAccount(\''+ arr[i].id +'\')">Delete</button></td>' +
    '</tr>';
    }
}
loadList();

saveAdmin.addEventListener('click', function(){
    const admin_id_names = ["email", "pass", "re-pass", "fname", "lname", "mi"];
    const admin = {
        username: document.querySelector("#fname").value + '_' + document.querySelector("#lname").value,
        email: document.querySelector("#email").value,
        emailVisibility: true,
        password: document.querySelector("#pass").value,
        passwordConfirm: document.querySelector("#re-pass").value,
        firstname: document.querySelector("#fname").value,
        lastname: document.querySelector("#lname").value,
        mi: document.querySelector("#mi").value,
        cemetery_id: getSessionAdmin().cemetery_id
    }
    for(let i = 0; i < admin_id_names.length; i++){
        if(!inputValidation(admin_id_names[i])){
            alert('Please input a valid ' + id_names[admin_id_names[i]] + '.');
            return;
        }
    }
    checkEmailExist(document.getElementById('email').value);
    if(document.querySelector("#pass").value !== document.querySelector("#re-pass").value){
        alert("Passwords does not match, please try again");
        return;
    }

    register_acc(admin).then( function(){
        alert('New account has been added');
        clearInputFields();
        $("#add-admin-acc").modal('hide');
        loadUsers(10);
    }).catch( function(e){
        console.log(e.message);
    })
});

num_rows.addEventListener('input', function(){
    loadUsers(document.getElementById('num-rows').value);
});

function loadUsers(rows){
    search('admin', 1, rows, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,cemetery_id', '')
    .then( function(data){
        loadList(data.items);
    }).catch( function(e){
        console.log(e.message);
    });
}

function clearInputFields(){
    document.querySelector("#fname").value = "";
    document.querySelector("#lname").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#pass").value = "";
    document.querySelector("#re-pass").value = "";
    document.querySelector("#mi").value = "";
}

function inputValidation(id){
    const input = document.getElementById(id);
    let flag = false;
    if(input.checkValidity()){
        flag = true;
    }
    return flag;
}

function checkEmailExist(input){
    search('admin', 1, 1, { email: input}, '+created,email', 'cemetery_id')
    .then( function(data){
        if(data.items.length > 0){
            const prompt = "Email already existed please try a new one\nIf this is your email have you forgot your password?";
            alert(prompt);
        }
    }).catch( function(e){
        console.log(e.message);
    })
}

function deleteAccount(acc_id){
    if(confirm("Are you sure you want to delete this account?")){
        remove(ADMIN, acc_id);
        alert("Account has been deleted");
        signout();
        window.location.href = '../index.html';
        //loadUsers(10);
    }
}