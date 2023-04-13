const menu = document.querySelector('.menu-btn');
const notif = document.querySelector('#notif-btn');
const log_out = document.getElementById('logout');
const cem_name = window.localStorage.getItem('cemetery-name');
var flag = false;

check_session();
currCemetery();

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
    var notifications = document.getElementById('notifications');
    var today = new Date();
    var dateString = (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0");
    console.log(dateString);
    search(GRAVE, 1, 50, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,cemetery_id', 'deceased_id')
    .then( function(data){
        notifications.innerHTML = "";
        for(let i = 0; i < data.items.length; i++){
            if(data.items[i].deceased_id !== ""){
                if(data.items[i].expand.deceased_id.date_death.toString().substring(5, 10) === dateString){
                    notifications.innerHTML += '<li style="cursor: pointer;" onclick="openDeceased(\''+ data.items[i].deceased_id +'\');" class="list-group-item"><i class="uil uil-calendar-alt" style="color: rgb(220, 108, 75);"></i><small> Today '+ today.toString().substring(0, 10) +' marks the '+ (today.getFullYear() - parseInt(data.items[i].expand.deceased_id.date_death.toString().substring(0, 4))) +' year death anniversary of <b>'+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname + '</b>\''+ "'s passing. " +'\'.</small></li>';
                }
                if(today.getFullYear() - parseInt(data.items[i].expand.deceased_id.date_burial.toString().substring(0, 4)) >= 5){
                    notifications.innerHTML += '<li style="cursor: pointer;" onclick="openDeceased(\''+ data.items[i].deceased_id +'\');" class="list-group-item"><i class="uil uil-bell" style="color: rgb(220, 108, 75);"></i><small> The grave of <b>'+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname +'</b> has exceeded 5 years.</small></li>';
                }
            }
        }
    }).catch( function(e){
        console.log(e.message)
    });
});

log_out.addEventListener('click', function(){
    if(confirm("Do you really want to sign out?")){
        localStorage.removeItem('cemetery-name');
        localStorage.removeItem('deceased-id');
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

function currCemetery(){
    if(document.getElementById('cem-name') != null){
        document.getElementById('cem-name').innerHTML = cem_name;
    }
}

function openDeceased(id){
    window.localStorage.setItem('deceased-id', id);
    location.href = "../pages/adminDeceasedInfo.html";
}
