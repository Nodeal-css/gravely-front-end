const locate = document.getElementById('locate');


loadInfo(getDeceasedId());

window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem('deceased-id');
});

locate.addEventListener('click', function(){
    search(GRAVE, 1, 1, { deceased_id: getDeceasedId() }, '+created,deceased_id', '')
    .then( function(data){
        window.location.href = '../pages/guestMap.html?id=' + data.items[0].id + '&lat=' + data.items[0].latitude + '&lng=' + data.items[0].longitude + '&deceased=' + getDeceasedId();
    }).catch( function(e){
        console.log(e.message);
    });
});

function getDeceasedId(){
    const id = window.localStorage.getItem('deceased-id');
    return id;
}

function loadInfo(deceased_id){
    if(deceased_id === null){
        alert('Deceased Info not found, returning to list page.');
        window.location.href = "../pages/guestSearchDeceased.html";
        return;
    }else{
        search('deceased', 1, 1, { id: deceased_id }, '+created,id', 'burial_type_id')
        .then( function(data){
            document.getElementById('fNameInput').value = data.items[0].firstname;
            document.getElementById('miInput').value = data.items[0].mi;
            document.getElementById('lNameInput').value = data.items[0].lastname;
            document.getElementById('birthInput').placeholder = data.items[0].date_birth;
            document.getElementById('gender').value = data.items[0].gender;
            document.getElementById('deathInput').placeholder = data.items[0].date_death;
            document.getElementById('burialInput').placeholder = data.items[0].date_burial;
            document.getElementById('cDeathInput').value = data.items[0].cause_of_death;
            document.getElementById('memorialInput').value = data.items[0].memorial;
            document.getElementById('burial-type-input').value = data.items[0].burial_type_id;
            document.getElementById('deceased-img').setAttribute('src', 'https://gravely.pockethost.io/api/files/deceased/'+ data.items[0].id +'/' + data.items[0].image);
        }).catch( function(e){
            console.log(e.message);
        });
    }
}