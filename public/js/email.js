window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem("adminAccounts");
    this.window.localStorage.removeItem("cemetery-id");
});

getAdmins();
//getListExceed5years();


function getListExceed5years(){
    var today = new Date();
    var dateString = (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0");
    
    
    search(GRAVE, 1, 50, { id: ' ' }, '+created,cemetery_id', 'deceased_id')
    .then( function(data){
        const accounts = JSON.parse(window.localStorage.getItem("adminAccounts"));
        for(let i = 0; i < data.items.length; i++){
            if(data.items[i].deceased_id !== ""){
                if(today.getFullYear() - parseInt(data.items[i].expand.deceased_id.date_burial.toString().substring(0, 4)) >= 5){
                    Email.send({
                        SecureToken : "c3b5b3ae-f08d-4385-8c0b-3b0bea2fcea5",
                        To : accounts[findIndex(data.items[i].cemetery_id)].account,
                        From : "Gravely2021@gmail.com",
                        Subject : "Gravely: Email for Deceased Exhumation",
                        Body : "The grave of "+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname +" has exceeded 5 years.  You may now perform exhumation and transfer the deceased to other location."
                    }).then(
                      message => console.log(message)
                    );
                }
                if(data.items[i].expand.deceased_id.date_death.toString().substring(5, 10) === dateString){
                    //notifications.innerHTML += '<li style="cursor: pointer;" onclick="openDeceased(\''+ data.items[i].deceased_id +'\');" class="list-group-item"><i class="uil uil-calendar-alt" style="color: rgb(220, 108, 75);"></i><small> Today '+ today.toString().substring(0, 10) +' marks the '+ (today.getFullYear() - parseInt(data.items[i].expand.deceased_id.date_death.toString().substring(0, 4))) +' year death anniversary of <b>'+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname + '</b>\''+ "s passing. " +'\'.</small></li>';
                    Email.send({
                        SecureToken : "c3b5b3ae-f08d-4385-8c0b-3b0bea2fcea5",
                        To : accounts[findIndex(data.items[i].cemetery_id)].account,
                        From : "Gravely2021@gmail.com",
                        Subject : "Gravely: Death Anniversary",
                        Body : 'Today '+ today.toString().substring(0, 10) +' marks the '+ (today.getFullYear() - parseInt(data.items[i].expand.deceased_id.date_death.toString().substring(0, 4))) +' year death anniversary of <b>'+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname + ' passing.'
                    }).then(
                      message => console.log(message)
                    );
                }
                if(today.getFullYear() - parseInt(data.items[i].expand.deceased_id.date_burial.toString().substring(0, 4)) === 4 && parseInt(data.items[i].expand.deceased_id.date_burial.toString().substring(5, 7)) === parseInt(today.getMonth() + 2)){
                    //notifications.innerHTML += '<li style="cursor: pointer;" onclick="openDeceased(\''+ data.items[i].deceased_id +'\');" class="list-group-item"><i class="uil uil-bell" style="color: rgb(220, 108, 75);"></i><small> The grave of <b>'+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname +'</b> will reach 5 years next month.</small></li>';
                    Email.send({
                        SecureToken : "c3b5b3ae-f08d-4385-8c0b-3b0bea2fcea5",
                        To : accounts[findIndex(data.items[i].cemetery_id)].account,
                        From : "Gravely2021@gmail.com",
                        Subject : "Gravely: Deceased is ready for exhumation next month",
                        Body : 'The grave of <b>'+ data.items[i].expand.deceased_id.firstname + ' ' + data.items[i].expand.deceased_id.mi + '. ' + data.items[i].expand.deceased_id.lastname +'</b> will reach 5 years next month.'
                    }).then(
                      message => console.log(message)
                    );
                }
            }
        }
    }).catch( function(e){
        console.log(e.message)
    });
}

function findIndex(data){
    const accounts = JSON.parse(window.localStorage.getItem("adminAccounts"));
    var index = 0;
    for(var i = 0; i < Object.keys(accounts).length; i++){
        if(accounts[i].cemID === data){
            index = i;
        }
    }
    return index;
}



// store the emails and cemetery id in localstorage
function getAdmins(){
    search(ADMIN, 1, 20, { id: ' '}, "+created,id").then( function(data){
        var admin = {};
        for(let i = 0; i < data.items.length; i++){
            //console.log("Admin: " + data.items[i].email + " cemetery: " + data.items[i].cemetery_id);
            admin[i] = {
                account: data.items[i].email,
                cemID: data.items[i].cemetery_id
            };
        }
        window.localStorage.setItem("adminAccounts", JSON.stringify(admin));
        //console.log(admin);
    }).catch( function(e){
        console.log(e.message);
    });
}

