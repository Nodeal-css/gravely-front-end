const deceasedList = document.getElementById('deceased-list');
const filter_btn = document.getElementById('filter-btn');
const btn_search_deceased = document.getElementById('search-deceased');
const burialType = document.getElementById('burial-type');
const next_page = document.getElementById('page+');
const prev_page = document.getElementById('page-');
var filterField = "burial_type_id";
var filterInput = ' ';
var page = 1;

searchDeceasedRecords("firstname", " ", page, "burial_type_id", ' ');

function loadList(data){
    deceasedList.innerHTML = (Object.keys(data).length < 1) ? "<tr><th colspan='12' class='text-center'><b>No record/s found.</b></th></tr>" : "";
    for(let i = 0; i < Object.keys(data).length; i++){
        let currDate = new Date();
        let bdate = new Date(data[i]['date_birth'].substring(0, 10));
        let burial = new Date(data[i]['date_burial'].substring(0, 10));
        if((currDate.getFullYear() - burial.getFullYear()) >= 5){
            deceasedList.innerHTML += '<tr data-group="exceedYears" onClick="deceasedInfo(\''+ data[i]['id'] +'\');" style="cursor: pointer;">' +
            '<th scope="row">'+ (i + 1) +'.</th>' +
            '<td>'+ data[i]['firstname'] +'</td>' +
            '<td>'+ data[i]['lastname'] +'</td>' +
            '<td>'+ data[i]['mi'] +'</td>' +
            '<td>'+ ((data[i]['gender'] == 'M') ? 'Male' : 'Female') +'</td>' +
            '<td>'+ (currDate.getFullYear() - bdate.getFullYear()) +'</td>' +
            '<td>'+ data[i]['date_birth'].substring(0, 10) +'</td>' +
            '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
            '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
            '<td>'+ data[i]['cause_of_death'] +'</td>' +
            '<td>'+ data[i]['memorial'] +'</td>' +
            '<td>'+ getBurialType(data[i]['burial_type_id']) +'</td>' +
            '</tr>';
            continue;
        }
        deceasedList.innerHTML += '<tr onClick="deceasedInfo(\''+ data[i]['id'] +'\');" style="cursor: pointer;">' +
            '<th scope="row">'+ (i + 1) +'.</th>' +
            '<td>'+ data[i]['firstname'] +'</td>' +
            '<td>'+ data[i]['lastname'] +'</td>' +
            '<td>'+ data[i]['mi'] +'</td>' +
            '<td>'+ ((data[i]['gender'] == 'M') ? 'Male' : 'Female') +'</td>' +
            '<td>'+ (currDate.getFullYear() - bdate.getFullYear()) +'</td>' +
            '<td>'+ data[i]['date_birth'].substring(0, 10) +'</td>' +
            '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
            '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
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
    searchDeceasedRecords(field, input, currpage, filterField, filterInput);
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
function searchDeceasedRecords(search_field, search_input, curr_page, searchFieldFilter, searchInputFilter){
    //console.log(searchFieldHelper(search_field, search_input));
    const input1 = searchFieldHelper(search_field, search_input);
    const input2 = searchFieldHelper(searchFieldFilter, searchInputFilter);
    Promise.all([
        search('grave', 1, 1500, { cemetery_id: getSessionAdmin().cemetery_id }, 'cemetery_id'),
        search('deceased', curr_page, 50, {...input1, ...input2}, ''+ search_field + ',-'+ searchFieldFilter, 'burial_type_id')
    ]).then( function(result){
        const arrset1 = new Set(convertArray(result[0], false));
        const arrset2 = new Set(convertArray(result[1], true));
        const deceased = result[1];
        const common = {};
        let x = 0;
        for(const item of arrset2){
            if(arrset1.has(item)){
                common[Object.keys(common).length] = deceased.items[x]; 
            }
            x++;
        }
        loadList(common);
        document.getElementById('items-per-page').innerHTML = Object.keys(common).length + " item/s";
        //console.log('Items: ' + Object.keys(common).length);
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
        case 'cause_of_death':
            obj = { cause_of_death: input };
            break;
        case 'burial_type_id':
            obj = { burial_type_id: input };
            break;
        case 'gender':
            obj = { gender: input };
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
        case 'daldbkw41na3bq8':
            type = "Above ground";
            break;
        case 'eymwxmmmvohat6i':
            type = "In ground";
            break;
        case 'vy83iw6zmszry31':
            type = "Cremation";
            break;
        case 'm7nb93mnl5knx0p':
            type = "Natural Burial";
            break;
        case 'umprqsir5iy28nt':
            type = "Muslim Burial";
            break;
    }
    return type;
}







