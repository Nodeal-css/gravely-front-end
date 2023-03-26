const deceasedList = document.getElementById('deceased-list');
const filter_btn = document.getElementById('filter-btn');
const insert_deceased = document.getElementById('create-deceased');
const btn_search_deceased = document.getElementById('search-deceased');
const burialType = document.getElementById('burial-type');
const openModal = document.getElementById('open-modal');
const num_rows = document.getElementById('num-rows');

loadDeceasedRecords(10);

function loadList(data){
    deceasedList.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        deceasedList.innerHTML += '<tr onClick="deceasedInfo(\''+ data[i].id +'\');" style="cursor: pointer;">' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i].firstname +'</td>' +
        '<td>'+ data[i].lastname +'</td>' +
        '<td>'+ data[i].mi +'</td>' +
        '<td>'+ data[i].date_birth +'</td>' +
        '<td>'+ data[i].date_death +'</td>' +
        '<td>'+ data[i].date_burial +'</td>' +
        '<td>'+ data[i].cause_of_death +'</td>' +
        '<td>'+ data[i].memorial +'</td>' +
        '<td>'+ getBurialType(data[i].burial_type_id) +'</td>' +
    '</tr>';
    }
}

openModal.addEventListener('click', function(){
    loadBurialTypes();
});

filter_btn.addEventListener('click', function(){
    if(document.getElementById('filter-tab').style.display == 'block'){
        document.getElementById('filter-tab').style.display = 'none';
        return;
    }
    document.getElementById('filter-tab').style.display = 'block';
});

insert_deceased.addEventListener('click', function(){
    let img = document.getElementById('image-file').value;
    let deceased = {
        "firstname": document.getElementById('d-fname').value,
        "lastname":document.getElementById('d-lname').value,
        "mi": document.getElementById('d-mi').value,
        "cause_of_death": document.getElementById('cause-of-death').value,
        "memorial": document.getElementById('memorial').value,
        "date_death": document.getElementById('dod').value,
        "date_burial": document.getElementById('d-burial').value,
        "date_birth": document.getElementById('dob').value,
        "burial_type_id": document.getElementById('burial-type').value
    };

    create('deceased', deceased).then( function(){
        console.log('Record has been added');
        alert('Inserted deceased record');
        $('#add-deceased').modal('hide');
        clearInput();
        loadDeceasedRecords();
    }).catch( function(err){
        console.log(err);
    });
});

btn_search_deceased.addEventListener('click', function(){
    let field = document.getElementById('search-type').value;
    let input = document.getElementById('search-input').value;
    searchDeceasedRecords(field, input);
});

num_rows.addEventListener('input', function(){
    loadDeceasedRecords(document.getElementById('num-rows').value);
    document.getElementById('search-input').value = "";
});

function loadBurialTypes(){
    search('burial_type', 1, 100, { id: '' }, '+created,id', '')
    .then( function(data){
        burialType.innerHTML = "<option value='' disabled selected>Choose type</option>";
        for(let i = 0; i < data.items.length; i++){
            burialType.innerHTML += "<option value="+ data.items[i].id +">"+ data.items[i].type +"</option>";
        }
        console.log(data.items);
    }).catch( function(err){
        console.log(err.message);
    });
}


function loadDeceasedRecords(rows){
    search('deceased', 1, rows, { id: '' }, '+created,id', 'burial_type_id')
    .then( function(data){
        loadList(data.items);
    }).catch( function(err){
        console.log(err.message);
    });
}


//get parameters such as search type, and input
function searchDeceasedRecords(search_field, search_input){
    //console.log(searchFieldHelper(search_field, search_input));
    search('deceased', 1, 100, searchFieldHelper(search_field, search_input), '+created,'+ search_field, 'burial_type_id')
    .then( function(data){
        loadList(data.items);
        document.getElementById('num-rows').value = '100';
        //console.log(data.items);
    }).catch( function(err){
        console.log(err.message);
    });
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

function clearInput(){
    document.getElementById('d-fname').value = "";
    document.getElementById('d-lname').value = "";
    document.getElementById('d-mi').value = "";
    document.getElementById('cause-of-death').value = "";
    document.getElementById('memorial').value = "";
    document.getElementById('dod').value = "";
    document.getElementById('d-burial').value = "";
    document.getElementById('dob').value = "";
    document.getElementById('burial-type').value = "";
}


