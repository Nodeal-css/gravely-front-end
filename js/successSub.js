initializeSubscription();

window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem("accountObject");
    this.window.localStorage.removeItem("cemeteryObject");
    this.window.localStorage.removeItem("subObject");
});

function initializeSubscription(){
    var account = JSON.parse(window.localStorage.getItem("accountObject"));
    var cem = JSON.parse(window.localStorage.getItem("cemeteryObject"));
    var sub = JSON.parse(window.localStorage.getItem("subObject"));
    sub["id"] = successPayment().subscription_id
    cem["subscription_id"] = successPayment().subscription_id;

    registerAdmin(account, cem, sub).then( function () {
        console.log("account has been added");
        alert("You have signed up an Admin, Cemetery, and subscription details,\nThank you for trusting Gravely!\nredirecting to login page.");
    }).catch(function(err) {
        console.log(err.message);
    });
}