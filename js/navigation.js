const menu = document.querySelector('.menu-btn');
const notif = document.querySelector('#notif-btn');
const log_out = document.getElementById('logout');
var header = new Headers();
var flag = false;

check_session();

//transfer this script to js file
menu.addEventListener('click', function(){
    let sidebar = document.getElementById('sidebarMenu');
    let main = document.getElementById('main-content');
    if(flag){
        sidebar.style.animation = 'navShow 0.8s';
        sidebar.style.left = '0px';
        main.style.paddingLeft = '240px';
        flag = false;
        menu.style.animation = 'reversespin 0.3s';
        return;
    }
    menu.style.animation = 'spin 0.3s';
    sidebar.style.animation = 'navHide 0.8s';
    sidebar.style.left = '-300px';
    main.style.paddingLeft = '0px';
    flag = true;
});

notif.addEventListener('click', function(){
    document.getElementById('notif-tab').style.display = 'block';
})

log_out.addEventListener('click', function(){
    if(confirm("Confirm signing out Gravely")){
        signout();
        window.location.href = '../index.html';
    }
});

function check_session(){
    if(!isLoggedIn()){
        console.log('Session: not active');
        alert('Invalid access, please sign in');
        window.location.href = '../index.html';
        return;
    }
    console.log('Session: active');
}
