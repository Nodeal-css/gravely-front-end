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


admin_reg.addEventListener('click', function(){
    //form validation for admin
    const admin_id_names = ["email", "pass", "re-pass", "fname", "lname", "mi"];
    for(let i = 0; i < admin_id_names.length; i++){
        if(!input_validation(admin_id_names[i])){
            alert("Invalid input: Please fill up all the forms correctly.");
            return;
        }
    }
    if(document.getElementById('pass').value !== document.getElementById('re-pass').value){
        alert("The password you entered does not match the re-entered password.");
        return;
    }

    admin_container.style.display = 'none';
    cemetery_container.style.display = 'block';
    subscribe_container.style.display = 'none';
    admin_panel.classList.remove("active");
    cemetery_panel.classList.add("active");
    subscribe_panel.classList.remove("active");
});

cemetery_reg.addEventListener('click', function(){
    //forma validation
    const cemetery_id_names = ["cem-name", "cem-address", "telephone-1", "telephone-2", "contact"];
    for(let i = 0; i < cemetery_id_names.length; i++){
        if(!input_validation(cemetery_id_names[i])){
            alert("Invalid input: Please fill up all the forms correctly.");
            return;
        }
    }
    cemetery_container.style.display = 'none';
    admin_container.style.display = 'none';
    subscribe_container.style.display = 'block';
    cemetery_panel.classList.remove("active");
    subscribe_panel.classList.add("active");
    admin_panel.classList.remove("active");
    document.querySelector('#cemetery-name').value = document.querySelector('#cem-name').value;
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
    var account = {
        "username": document.querySelector("#fname").value + '_' + document.querySelector("#lname").value,
        "email": document.querySelector("#email").value,
        "emailVisibility": true,
        "password": document.querySelector("#pass").value,
        "passwordConfirm": document.querySelector("#re-pass").value,
        "firstname": document.querySelector("#fname").value,
        "lastname": document.querySelector("#lname").value,
        "mi": document.querySelector("#mi").value
    };
    var cem = {
        "name": document.querySelector("#cem-name").value,
        "address": document.querySelector("#cem-address").value,
        "tel1": document.querySelector("#telephone-1").value,
        "tel2": document.querySelector("#telephone-2").value,
        "contact": document.querySelector("#contact").value
    };
    var sub = {
        "payment": document.querySelector("#cost").value,
        "status": document.querySelector("#status").value,
        "expiry_date": document.querySelector("#expiry").value
    };
    
    registerAdmin(account, cem, sub).then( function () {
        //redirect to admin dashboard
        console.log("account has been added");
        alert("You have signed up an Admin, Cemetery, and subscription details,\nThank you for trusting Gravely!\nredirecting to login page.");
        window.location.href = '../index.html';
    }).catch(function(err) {
        console.log(err.message);
    });
 
});

//This function will check if the format of input is not followed, or if it is empty.
function input_validation(id){
    let input = document.getElementById(id);
    let flag = false;
    if(input.checkValidity() && input.value != ""){
        flag = true;
    }
    return flag;
}



/*
    Assignment:
    - Create a form validation for registering admin, cemetery and subscription
    - Fix the given date of expiry, users must not able to edit it.(done)
*/