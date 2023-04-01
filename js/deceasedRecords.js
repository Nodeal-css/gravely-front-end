const deceasedList = document.getElementById('deceased-list');
const filter_btn = document.getElementById('filter-btn');
const btn_search_deceased = document.getElementById('search-deceased');
const burialType = document.getElementById('burial-type');
const next_page = document.getElementById('page+');
const prev_page = document.getElementById('page-');
var page = 1;

searchDeceasedRecords("firstname", " ", page);

function loadList(data){
    deceasedList.innerHTML = "";
    for(let i = 0; i < Object.keys(data).length; i++){
        let currDate = new Date();
        let bdate = new Date(data[i]['date_birth'].substring(0, 10));
        deceasedList.innerHTML += '<tr onClick="deceasedInfo(\''+ data[i]['id'] +'\');" style="cursor: pointer;">' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i]['firstname'] +'</td>' +
        '<td>'+ data[i]['lastname'] +'</td>' +
        '<td>'+ data[i]['mi'] +'</td>' +
        '<td>'+ data[i]['gender'] +'</td>' +
        '<td>'+ (currDate.getFullYear() - bdate.getFullYear()) +'</td>' +
        '<td>'+ data[i]['date_birth'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['date_burial'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['cause_of_death'] +'</td>' +
        '<td>'+ data[i]['memorial'] +'</td>' +
        '<td>'+ getBurialType(data[i]['burial_type_id']) +'</td>' +
        '</tr>';
    }
}


filter_btn.addEventListener('click', function(){
    if(document.getElementById('filter-tab').style.display == 'block'){
        document.getElementById('filter-tab').style.display = 'none';
        return;
    }
    document.getElementById('filter-tab').style.display = 'block';
});


btn_search_deceased.addEventListener('click', function(){
    page = 1;
    getFindInputs(page);
    document.getElementById('page-list').innerHTML = "Page " + page;
});

next_page.addEventListener('click', function(){
    page++;
    getFindInputs(page);
    document.getElementById('page-list').innerHTML = "Page " + page;
});
prev_page.addEventListener('click', function(){
    if(page != 1){
        page--;
    }
    getFindInputs(page);
    document.getElementById('page-list').innerHTML = "Page " + page;
});

function getFindInputs(currpage){
    let field = document.getElementById('search-type').value;
    let input = document.getElementById('search-input').value;
    searchDeceasedRecords(field, input, currpage);
}
/*
function loadDeceasedRecords(rows){
    search('deceased', 2, rows, { id: '' }, '+created,id', 'burial_type_id')
    .then( function(data){
        loadList(data.items);
    }).catch( function(err){
        console.log(err.message);
    });
}*/


//get parameters such as search type, and input
function searchDeceasedRecords(search_field, search_input, curr_page){
    //console.log(searchFieldHelper(search_field, search_input));
    Promise.all([
        search('grave', 1, 1500, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,cemetery_id'),
        search('deceased', curr_page, 50, searchFieldHelper(search_field, search_input), '+created,'+ search_field, 'burial_type_id')
    ]).then( function(result){
        const arrset1 = new Set(convertArray(result[0], false));
        const arrset2 = new Set(convertArray(result[1], true));
        const deceased = result[1];
        const common = {};
        let x = 0;
        for(const item of arrset2){
            if(arrset1.has(item)){
                common[x] = deceased.items[x]; 
            }
            x++;
        }
        loadList(common);
    }).catch( function(err){
        console.log(err.message);
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
//sample use
//search(DECEASED, 1, 100, { lastname: 'John', firstname: ''},  '-created,lastname,firstname', 'burial_type_id')

//switch case function to specify the field of searching
function searchFieldHelper(field, input){
    let obj = {};
    switch(field){
        case 'id':
            obj = { id: input};
            break;
        case 'firstname':
            obj = { firstname: input};
            break;
        case 'lastname':
            obj = { lastname: input};
            break;
        case 'mi':
            obj = { mi: input};
            break;
        case 'date_birth':
            obj = { date_birth: input};
            break;
        case 'date_death':
            obj = { date_death: input};
            break;
        case 'date_burial':
            obj = { date_burial: input};
            break;
        default:
            obj = { firstname: input};
            break;
    }
    return obj;
}

function deceasedInfo(id){
    console.log('clicked: ' + id);
    window.localStorage.setItem('deceased-id', id);
    window.location.href = "../pages/adminDeceasedInfo.html";
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



