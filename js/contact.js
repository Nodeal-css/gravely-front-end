const filter_btn = document.getElementById('filter-btn');
const contact_list = document.getElementById('contact-list');
const insert_contact = document.getElementById('insert-contact');
const btn_search_contact = document.getElementById('search-contact');

loadContactRecords();

function loadList(data){
    contact_list.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        contact_list.innerHTML += '<tr>' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i].fname +'</td>' + // firstname
        '<td>'+ data[i].lname +'</td>' + // lastname
        '<td>'+ data[i].mi +'</td>' + // mi
        '<td>'+ data[i].created +'</td>' + // date recorded
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

insert_contact.addEventListener('click', function(){
    let contact = {
        "fname": document.getElementById('c-fname').value,
        "lname": document.getElementById('c-lname').value,
        "mi": document.getElementById('c-mi').value, 
        "address": document.getElementById('c-address').value,
        "tel": document.getElementById('c-tel').value
    };

    create('contract', contact).then( function(){
        console.log('Inserted a contact record');
        alert('Inserted a contact record');
        $("#add-contact").modal('hide');
        loadContactRecords();
    }).catch( function(err){
        console.log(err.message);
    });
});

btn_search_contact.addEventListener('click', function(){
    let type = document.getElementById('search-type').value;
    let input = document.getElementById('search-input').value;
    searchContactRecords(type, input);
});

function loadContactRecords(){
    search('contract', 1, 100, { id: '' }, '+created,id', '')
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