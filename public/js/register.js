const admin_panel = document.querySelector("#admin");
const cemetery_panel = document.querySelector("#cemetery");
const subscribe_panel = document.querySelector("#subscribe");
//buttons
const admin_reg = document.querySelector("#admin-register");
const cemetery_reg = document.querySelector("#cem-register");
const reg = document.querySelector("#subscribe-btn");
const btn_gcash = document.querySelector("#btn-gcash");
//containers
const admin_container = document.querySelector("#admin-container");
const cemetery_container = document.querySelector("#cemetery-container");
const subscribe_container = document.querySelector("#subscribe-container");

const id_names = {
    "fname": "first name",
    "lname": "last name",
    "mi": "Middle initial",
    "email": "Email",
    "pass": "password",
    "re-pass": "re-entered password",
    "cem-name": "cemetery name",
    "cem-address": "cemetery address",
    "telephone-1": "telephone line 1",
    "telephone-2": "telephone line 2",
    "contact": "contact"
}


admin_reg.addEventListener('click', function(){
    //form validation for admin
    const admin_id_names = ["email", "pass", "re-pass", "fname", "lname", "mi"];
    for(let i = 0; i < admin_id_names.length; i++){
        if(!input_validation(admin_id_names[i])){
            alert("Please Enter a valid " + id_names[admin_id_names[i]] + ".");
            return;
        }
    }
    if(document.getElementById('pass').value !== document.getElementById('re-pass').value){
        alert("The password you entered does not match the re-entered password.");
        return;
    }

    showCemetery();
    checkEmailExist(document.querySelector("#email").value);
});

cemetery_reg.addEventListener('click', function(){
    //forma validation
    const cemetery_id_names = ["cem-name", "cem-address", "telephone-1", "telephone-2", "contact"];
    for(let i = 0; i < cemetery_id_names.length; i++){
        if(!input_validation(cemetery_id_names[i])){
            alert("Please enter a valid " + id_names[cemetery_id_names[i]] + ".");
            return;
        }
    }
    showSubscription();
});

btn_gcash.addEventListener('click', function(){
    let date = new Date();
    const daysOfyear = 365;
    date.setDate(date.getDate() + daysOfyear);
    let format = date.toISOString().substring(0, 10);
    
    document.getElementById('sub-content').style.display = 'block';
    document.getElementById('expiry').value = format;
});

reg.addEventListener('click', function(){
    const account = {
        "username": document.querySelector("#fname").value + '_' + document.querySelector("#lname").value,
        "email": document.querySelector("#email").value,
        "emailVisibility": true,
        "password": document.querySelector("#pass").value,
        "passwordConfirm": document.querySelector("#re-pass").value,
        "firstname": document.querySelector("#fname").value,
        "lastname": document.querySelector("#lname").value,
        "mi": document.querySelector("#mi").value
    };
    const cem = {
        "name": document.querySelector("#cem-name").value,
        "address": document.querySelector("#cem-address").value,
        "tel1": document.querySelector("#telephone-1").value,
        "tel2": document.querySelector("#telephone-2").value,
        "contact": document.querySelector("#contact").value
    };
    const sub = {
        "payment": document.querySelector("#cost").value,
        "status": document.querySelector("#status").value,
        "expiry_date": document.querySelector("#expiry").value
    };
    const subscriber = {
        name: {
          given_name: document.getElementById('fname').value,
          surname: document.getElementById('lname').value
        },
        email_address: document.getElementById("email").value
    }
    
    create(CEMETERY, cem).then(function(cemResponse){
        const cemID = cemResponse.id;
        account["cemetery_id"] = cemID;
        create(ADMIN, account).then(function(){
            alert("Successfully registered, returning to admin sign in page");
            window.location.href = "../index.html";
        }).catch( function(e){
            console.log(e.message);
        });
    }).catch( function(e){
        console.log(e.message);
    });
});

//This function will check if the format of input is not followed, or if it is empty.
function input_validation(id){
    let input = document.getElementById(id);
    let flag = false;
    if(input.checkValidity()){
        flag = true;
    }
    return flag;
}

//search email if it already exists
function checkEmailExist(input){
    search("admin", 1, 1, { email: input }, "+created,email", "cemetery_id")
    .then( function(data){
        if(data.items.length > 0 && input != ""){
            alert("Email already existed, please try a new one.");
            document.querySelector("#email").value = "";
            showAdmin();
        }
    }).catch( function(err){
        console.log(err.message);
    })
}

function showAdmin(){
    admin_container.style.display = 'block';
    cemetery_container.style.display = 'none';
    subscribe_container.style.display = 'none';
    admin_panel.classList.add("active");
    cemetery_panel.classList.remove("active");
    subscribe_panel.classList.remove("active");
}

function showCemetery(){
    admin_container.style.display = 'none';
    cemetery_container.style.display = 'block';
    subscribe_container.style.display = 'none';
    admin_panel.classList.remove("active");
    cemetery_panel.classList.add("active");
    subscribe_panel.classList.remove("active");
}

function showSubscription(){
    cemetery_container.style.display = 'none';
    admin_container.style.display = 'none';
    subscribe_container.style.display = 'block';
    cemetery_panel.classList.remove("active");
    subscribe_panel.classList.add("active");
    admin_panel.classList.remove("active");
    document.querySelector('#cemetery-name').value = document.querySelector('#cem-name').value;
}
