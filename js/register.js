var admin = document.querySelector("#admin");
var cemetery = document.querySelector("#cemetery");
var subscribe = document.querySelector("#subscribe");
//buttons
var admin_reg = document.querySelector("#admin-register");
var cemetery_reg = document.querySelector("#cem-register");
var register = document.querySelector("#subscribe-btn");
var btn_gcash = document.querySelector("#btn-gcash");
//containers
var admin_container = document.querySelector("#admin-container");
var cemetery_container = document.querySelector("#cemetery-container");
var subscribe_container = document.querySelector("#subscribe-container");


admin_reg.addEventListener('click', async () => {
    admin_container.style.display = 'none';
    cemetery_container.style.display = 'block';
    subscribe_container.style.display = 'none';
    admin.classList.remove("active");
    cemetery.classList.add("active");
    subscribe.classList.remove("active");
});

cemetery_reg.addEventListener('click', async () => {
    cemetery_container.style.display = 'none';
    admin_container.style.display = 'none';
    subscribe_container.style.display = 'block';
    cemetery.classList.remove("active");
    subscribe.classList.add("active");
    admin.classList.remove("active");
    document.querySelector('#cemetery-name').value = document.querySelector('#cem-name').value;
});

btn_gcash.addEventListener('click', async () => {
    document.getElementById('sub-content').style.display = 'block';
});

register.addEventListener('click', function(){
    var fname = document.querySelector("#fname").value;
    var lname = document.querySelector("#lname").value;
    var mi = document.querySelector("#mi").value;
    var email = document.querySelector("#email").value;
    var pass = document.querySelector("#pass").value;
    var re_pass = document.querySelector("#re-pass").value;

    var cem_name = document.querySelector("#cem-name").value;
    var cem_address = document.querySelector("#cem-address").value;
    var tel1 = document.querySelector("#telephone-1").value;
    var tel2 = document.querySelector("#telephone-2").value;
    var contact = document.querySelector("#contact").value;

    var cost = document.querySelector("#cost").value;
    var status = document.querySelector("#status").value;
    var expiry = document.querySelector("#expiry").value;

    var account = {
        "username": fname + ' ' + lname,
        "email": email,
        "emailVisibility": true,
        "password": pass,
        "passwordConfirm": re_pass,
        "firstname": fname,
        "lastname": lname,
        "mi": mi
    };
    var cem = {
        "name": cem_name,
        "address": cem_address,
        "tel1": tel1,
        "tel2": tel2,
        "contact": contact
    };
    var sub = {
        "payment": cost,
        "status": status,
        "expiry_date": expiry
    };

    registerAdmin(account, cem, sub).then( async () => {
        alert("Admin, Cemetery, Subscription has been added");
    }).catch((err) => {
        alert(err);
    });
    /*
    console.log(account);
    console.log(cem);
    console.log(sub);
    */
});

/** 
  registerAdmin({  
    "username": "test_username1223",
    "email": "test1223@gmail.com",
    "emailVisibility": true,
    "password": "12345678",
    "passwordConfirm": "12345678",
    "firstname": "test",
    "lastname": "test",
    "mi": "tt"}, {   
      "name": "test",
      "address": "test",
      "tel1": "test",
      "tel2": "test",
      "contact": "test"
    }, {    
        "payment": 123,
        "status": "test",
      "expiry_date": "2022-01-01 10:00:00.123Z"
    }
  )
*/
