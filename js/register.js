var admin = document.querySelector("#admin");
var cemetery = document.querySelector("#cemetery");
var subscribe = document.querySelector("#subscribe");
//buttons
var admin_reg = document.querySelector("#admin-register");
var cemetery_reg = document.querySelector("#cem-register");
var register = document.querySelector("#subscribe-btn");
//containers
var admin_container = document.querySelector("#admin-container");
var cemetery_container = document.querySelector("#cemetery-container");
var subscribe_container = document.querySelector("#subscribe-container");


admin_reg.addEventListener('click', function(){
    admin_container.style.display = 'none';
    cemetery_container.style.display = 'block';
    subscribe_container.style.display = 'none';
    admin.classList.remove("active");
    cemetery.classList.add("active");
    subscribe.classList.remove("active");
});

cemetery_reg.addEventListener('click', function(){
    cemetery_container.style.display = 'none';
    admin_container.style.display = 'none';
    subscribe_container.style.display = 'block';
    cemetery.classList.remove("active");
    subscribe.classList.add("active");
    admin.classList.remove("active");
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

    var cem_sub_name = document.querySelector("#cemetery-name").value;

    var data = [{fname, lname, mi, email, pass, re_pass},{cem_name, tel1, tel2, contact},{cem_sub_name}];
    console.log(data);
});

/*
fname
lname
mi
email
pass
re-pass

cem-name
cem-address
telephone-1
telephone-2
contact

cemetery-name
*/
