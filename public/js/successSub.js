subscriptionMode();

window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem("accountObject");
    this.window.localStorage.removeItem("cemeteryObject");
    this.window.localStorage.removeItem("subObject");
    this.window.localStorage.removeItem("subscription-id");
});

function initializeSubscription(){
    var account = JSON.parse(window.localStorage.getItem("accountObject"));
    var cem = JSON.parse(window.localStorage.getItem("cemeteryObject"));
    var sub = JSON.parse(window.localStorage.getItem("subObject"));
    if(account !== null && cem !== null && sub !== null){
        /*
        registerAdmin(account, cem, sub).then( function(){
            console.log("Successfully subscribed");
        }).catch( function(e){
            console.log(e.message);
        });*/
        create(SUBSCRIPTION, sub).then(function(subResponse){
            const subID = subResponse.id;
            cem["subscription_id"] = subID;
            create(CEMETERY, cem).then(function(cemResponse){
                const cemID = cemResponse.id;
                account["cemetery_id"] = cemID;
                create(ADMIN, account).then(function(){
                    console.log("Successfully subscribed");
                    //window.localStorage.removeItem("accountObject");
                    //window.localStorage.removeItem("cemeteryObject");
                    //window.localStorage.removeItem("subObject");
                }).catch( function(e){
                    console.log(e.message);
                });
            }).catch( function(e){
                console.log(e.message);
            });
        }).catch( function(e){
            console.log(e.message);
        });
    }else{
        alert("Registration error: connection error");
    }
}

function subscriptionMode(){
    if(window.localStorage.getItem("accountObject") !== null){
        initializeSubscription();
        return;
    }else{
        updateSubsciption();
    }
}

function updateSubsciption(){
    const subID = window.localStorage.getItem("subscription-id");
    let date = new Date();
    const daysOfyear = 365;
    date.setDate(date.getDate() + daysOfyear);
    let format = date.toISOString().substring(0, 10);
    update(SUBSCRIPTION, { id: subID, expiry_date: format }).then( function(){
        console.log("Thank you for re-subscribing");
        window.localStorage.removeItem("subscription-id");
    }).catch( function(e){
        console.log(e.message);
    });
}