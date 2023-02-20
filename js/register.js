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
    admin_container.style.display = 'none';
    cemetery_container.style.display = 'block';
    subscribe_container.style.display = 'none';
    admin_panel.classList.remove("active");
    cemetery_panel.classList.add("active");
    subscribe_panel.classList.remove("active");
});

cemetery_reg.addEventListener('click', function(){
    cemetery_container.style.display = 'none';
    admin_container.style.display = 'none';
    subscribe_container.style.display = 'block';
    cemetery_panel.classList.remove("active");
    subscribe_panel.classList.add("active");
    admin_panel.classList.remove("active");
    document.querySelector('#cemetery-name').value = document.querySelector('#cem-name').value;
});

btn_gcash.addEventListener('click', function(){
    document.getElementById('sub-content').style.display = 'block';
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
        alert("You have signed up an Admin, Cemetery, and subscription details,\nThank you for trusting Gravely!");
        window.location.href = '../index.html';
    }).catch(function(err) {
        console.log(err.message);
    });
 
});

/*
    Assignment:
    Create a form validation for registering admin, cemetery and subscription
*/