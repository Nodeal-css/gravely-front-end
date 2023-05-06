

window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem("accountObject");
    this.window.localStorage.removeItem("cemeteryObject");
    this.window.localStorage.removeItem("subObject");
    this.window.localStorage.removeItem("subscription-id");
    this.window.localStorage.removeItem("cemetery-id");
});