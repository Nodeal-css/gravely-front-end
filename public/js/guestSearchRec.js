const deceased_list = document.getElementById('load-deceased');
const btn_search_deceased = document.getElementById('btn-search');
const cemetery_option = document.getElementById('cemetery');
const btn_search_deceased_field = document.getElementById('search-deceased');

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

function getFindInputs(){
    let field = document.getElementById('search-type').value;
    let input = document.getElementById('search-input').value;
    searchDeceasedRecordsByField(field, input);
}

btn_search_deceased_field.addEventListener('click', function(){
    getFindInputs();
});


document.getElementById('search-type-btn').addEventListener('click', function(){
    document.getElementById('search-many-fields').style.display = 'block';
    document.getElementById('search-choose-field').style.display = 'none';
    
});


document.getElementById('search-type-btn-return').addEventListener('click', function(){
    document.getElementById('search-many-fields').style.display = 'none';
    document.getElementById('search-choose-field').style.display = 'block';
});

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
    document.getElementById("table-search").style.display = 'inline';
    deceased_list.innerHTML = (Object.keys(data).length < 1) ? "<tr><th colspan='12' class='text-center'><b>No record/s found.</b></th></tr>" : "";
    for(let i = 0; i < Object.keys(data).length; i++){
        let current = new Date();
        let bday = new Date(data[i]['date_birth'].substring(0, 10));
        deceased_list.innerHTML += '<tr onClick="deceasedInfo(\''+ data[i]['id'] +'\');" style="cursor: pointer;">' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i]['firstname'] +'</td>' +
        '<td>'+ data[i]['lastname'] +'</td>' +
        '<td>'+ data[i]['mi'] +'</td>' +
        '<td>'+ ((data[i]['gender'] === 'M') ? "Male" : "Female") +'</td>' +
        '<td>'+ (current.getFullYear() - bday.getFullYear()) +'</td>' +
        '<td>'+ data[i]['date_birth'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['date_death'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['date_burial'].substring(0, 10) +'</td>' +
        '<td>'+ data[i]['memorial'] +'</td>' +
        '<td>'+ getBurialType(data[i]['burial_type_id']) +'</td>' +
    '</tr>';
    }
}

// undefined [' date_birth'] <-----------------------------------------------
function searchDeceasedRecords(input){
    Promise.all([
        search(GRAVE, 1, 1500, { cemetery_id: cemetery_option.value }, '-created,cemetery_id', 'cemetery_id'),
        search(DECEASED, 1, 1500, input, '-created,firstname,lastname,mi,date_death,date_birth,date_burial', 'burial_type_id')
    ])
    .then( function(result){
        const graveData = new Set(convertArray(result[0], false));
        const deceasedData = new Set(convertArray(result[1], true));
        const deceased = result[1];
        const common = {};
        var x = 0;
        for(const item of deceasedData){
            if(graveData.has(item)){
                common[Object.keys(common).length] = deceased.items[x];
            }
        x++;
        }
        
        loadList(common);
    }).catch( function(e){
        console.log(e.message);
    });
}

function searchDeceasedRecordsByField(search_field, search_input){
    //console.log(searchFieldHelper(search_field, search_input));
    const input1 = searchFieldHelper(search_field, search_input);
    Promise.all([
        search('grave', 1, 1500, { id: ' ' }, '+created,id'),
        search('deceased', 1, 100, {...input1}, '+created,'+ search_field, 'burial_type_id')
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
    }).catch( function(err){
        console.log(err.message);
    });
}


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
        case '2bm4m8nfsdjn8dl':
            type = "Natural Burial";
            break;
        case 'jrwvfbropifz3n2':
            type = "Muslim Burial";
            break;
    }
    return type;
}

function deceasedInfo(id){
    console.log('clicked: ' + id);
    window.localStorage.setItem('deceased-id', id);
    window.location.href = "../pages/guestDeceasedInfo.html";
}