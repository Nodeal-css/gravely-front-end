const filter_btn = document.getElementById('filter-btn');
const contact_list = document.getElementById('contact-list');
const btn_search_contact = document.getElementById('search-contact');
const num_rows = document.getElementById('num-rows');

loadContactRecords(10);

function loadList(data){
    contact_list.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        contact_list.innerHTML += '<tr style="cursor: pointer;" onclick="contractInfo(\''+ data[i].id +'\');">' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i].fname +'</td>' + // firstname
        '<td>'+ data[i].lname +'</td>' + // lastname
        '<td>'+ data[i].mi +'</td>' + // mi
        '<td>'+ data[i].created.substring(0, 10) +'</td>' + // date recorded
        '<td>'+ data[i].address +'</td>' + // address
        '<td>'+ data[i].tel +'</td>' + // tel
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
    let type = document.getElementById('search-type').value;
    let input = document.getElementById('search-input').value;
    searchContactRecords(type, input);
});

num_rows.addEventListener('input', function(){
    loadContactRecords(document.getElementById('num-rows').value);
    document.getElementById('search-input').value = "";
});

function loadContactRecords(rows){
    search('contract', 1, rows, { id: '' }, '+created,id', '')
    .then( function(data){
        loadList(data.items);
    }).catch( function(e){
        console.log(e.message);
    })
}

function searchContactRecords(field, input){
    search('contract', 1, 100, searchFieldHelper(field, input), '+created,' + field, '')
    .then( function(data){
        loadList(data.items);
        document.getElementById('num-rows').value = '100';
    }).catch( function(e){
        console.log(e.message);
    });
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