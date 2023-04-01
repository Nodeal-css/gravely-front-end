const deceased_list = document.getElementById('load-deceased');
const btn_search_deceased = document.getElementById('btn-search');
const cemetery_option = document.getElementById('cemetery');

loadCemeteries();

function loadCemeteries(){
    search(CEMETERY, 1, 20, { id: ' ' }, '+created,id', '')
    .then( function(data){
        cemetery_option.innerHTML = '<option value="" selected disabled>Choose Cemetery</option>';
        for(let i = 0; i < data.items.length; i++){
            cemetery_option.innerHTML += '<option value="'+ data.items[i].id +'">'+ data.items[i].name +'</option>';
        }
    }).catch( function(e){
        console.log(e.message);
    });
}

btn_search_deceased.addEventListener('click', function(){
    const searchItems = {
        firstname: document.getElementById('fname').value,
        lastname: document.getElementById('lname').value,
        mi: document.getElementById('mi').value,
        date_death: document.getElementById('date-died').value,
        date_birth: document.getElementById('date-born').value,
        date_burial: document.getElementById('date-burial').value
    };
    searchDeceasedRecords(searchItems);
});

function loadList(data){
    deceased_list.innerHTML = "";
    for(let i = 0; i < Object.keys(data).length; i++){
        let current = new Date();
        let bday = new Date(data[i]['date_birth'].substring(0, 10));
        deceased_list.innerHTML += '<tr onClick="deceasedInfo(\''+ data[i]['id'] +'\');" style="cursor: pointer;">' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i]['firstname'] +'</td>' +
        '<td>'+ data[i]['lastname'] +'</td>' +
        '<td>'+ data[i]['mi'] +'</td>' +
        '<td>'+ data[i]['gender'] +'</td>' +
        '<td>'+ (current.getFullYear() - bday.getFullYear()) +'</td>' +
        '<td>'+ data[i]['date_birth'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['date_burial'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['cause_of_death'] +'</td>' +
        '<td>'+ data[i]['memorial'] +'</td>' +
        '<td>'+ getBurialType(data[i]['burial_type_id']) +'</td>' +
    '</tr>';
    }
}

function searchDeceasedRecords(input){
    Promise.all([
        search(GRAVE, 1, 1500, { cemetery_id: cemetery_option.value }, '+created,cemetery_id', 'cemetery_id'),
        search(DECEASED, 1, 1500, input, '+created,firstname,lastname,mi,date_death,date_birth,date_burial', 'burial_type_id')
    ])
    .then( function(result){
        const graveData = new Set(convertArray(result[0], false));
        const deceasedData = new Set(convertArray(result[1], true));
        const deceased = result[1];
        const common = {}
        if(cemetery_option.value === ""){
            for(let i = 0; i < deceased.items.length; i++){
                common[i] = deceased.items[i];
            }
        }else{
            var x = 0;
            for(const item of deceasedData){
                if(graveData.has(item)){
                    common[x] = deceased.items[x];
                }
                x++;
            }
        }
        loadList(common);
    }).catch( function(e){
        console.log(e.message);
    });
}


function convertArray(arr, flag){
    var res = [];
    for(let i = 0; i < arr.items.length; i++){
        if(flag){
            res[i] = arr.items[i].id;
            continue;
        }
        res[i] = arr.items[i].deceased_id;
    }
    return res;
}



function getBurialType(burial_id){
    let type = "";
    switch(burial_id){
        case 'pzcou9z7i198uhf':
            type = "Above ground";
            break;
        case '3gk7c2h67lhgbzr':
            type = "In ground";
            break;
        case 'yfr3d0hrq4cr7np':
            type = "Cremation";
            break;
        case '78wkk9veroh5ghi':
            type = "Inhumation";
            break;
        case '05yv7yvw72m6i76':
            type = "Mummification";
            break;
        case 'qtribu329jeeom9':
            type = "Mass burial";
            break;
    }
    return type;
}

function deceasedInfo(id){
    console.log('clicked: ' + id);
    window.localStorage.setItem('deceased-id', id);
    window.location.href = "../pages/guestDeceasedInfo.html";
}