const filter_btn = document.getElementById('filter-btn');
const contact_list = document.getElementById('contact-list');
const btn_search_contact = document.getElementById('search-contact');
const next_page = document.getElementById('page+');
const prev_page = document.getElementById('page-');
var filterField = "created";
var filterInput = ' ';
var page = 1;

searchContactRecords("id", " ", page, 'fname', ' ');

function loadList(data){
    contact_list.innerHTML = "";
    for(let i = 0; i < Object.keys(data).length; i++){
        let currdate = new Date();
        let created = new Date(data[i]['created'].substring(0, 10));
        if((currdate.getFullYear() - created.getFullYear()) >= 5){
            contact_list.innerHTML += '<tr data-group="exceedYears" style="cursor: pointer;" onclick="contractInfo(\''+ data[i]['id'] +'\');">' +
                '<th scope="row">'+ (i + 1) +'.</th>' +
                '<td>'+ data[i]['fname'] +'</td>' + // firstname
                '<td>'+ data[i]['lname'] +'</td>' + // lastname
                '<td>'+ data[i]['mi'] +'</td>' + // mi
                '<td>'+ data[i]['created'].substring(0, 10) +'</td>' + // date recorded
                '<td>'+ data[i]['address'] +'</td>' + // address
                '<td>'+ data[i]['tel'] +'</td>' + // tel
            '</tr>';
            continue;
        }
        contact_list.innerHTML += '<tr style="cursor: pointer;" onclick="contractInfo(\''+ data[i]['id'] +'\');">' +
                '<th scope="row">'+ (i + 1) +'.</th>' +
                '<td>'+ data[i]['fname'] +'</td>' + // firstname
                '<td>'+ data[i]['lname'] +'</td>' + // lastname
                '<td>'+ data[i]['mi'] +'</td>' + // mi
                '<td>'+ data[i]['created'].substring(0, 10) +'</td>' + // date recorded
                '<td>'+ data[i]['address'] +'</td>' + // address
                '<td>'+ data[i]['tel'] +'</td>' + // tel
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

btn_search_contact.addEventListener('click', function(){
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
    searchContactRecords(field, input, currpage, filterField, filterInput);
}

function searchContactRecords(field, input, currpage, searchFilterField, searchFilterInput){
    const input1 = searchFieldHelper(field, input);
    const input2 = searchFieldHelper(searchFilterField, searchFilterInput);
    Promise.all([
        search('grave', 1, 1500, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,cemetery_id'),
        search('contract', currpage, 50, {...input1, ...input2}, '+created,' + field + ',' + searchFilterField, '')
    ]).then( function(result){
        const gravedata = new Set(convertArray(result[0], false));
        const contractdata = new Set(convertArray(result[1], true));
        const contract = result[1];
        const common = {};
        var x = 0;
        for(const item of contractdata){
            if(gravedata.has(item)){
                common[Object.keys(common).length] = contract.items[x];
            }
            x++;
        }
        //console.log(common);
        loadList(common);
        document.getElementById('items-per-page').innerHTML = Object.keys(common).length + " Item/s";
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
        res[i] = arr.items[i].contract_id;
    }
    return res;
}

//switch case function to specify the field of searching
function searchFieldHelper(field, input){
    let obj = {};
    switch(field){
        case 'id':
            obj = { id: input};
            break;
        case 'fname':
            obj = { fname: input};
            break;
        case 'lname':
            obj = { lname: input};
            break;
        case 'mi':
            obj = { mi: input};
            break;
        case 'address':
            obj = { address: input};
            break;
        case 'created':
            obj = { created: input};
            break;
        default:
            obj = { fname: input};
            break;
    }
    return obj;
}

function contractInfo(id){
    window.localStorage.setItem('contract-id', id);
    window.location.href = "../pages/adminContactInfo.html";
}