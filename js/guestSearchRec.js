const deceased_list = document.getElementById('load-deceased');
const btn_search_deceased = document.getElementById('btn-search');

//loadDeceasedRecords();
//in searching, store the fields in an associative array

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
    for(let i = 0; i < data.length; i++){
        deceased_list.innerHTML += '<tr>' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ data[i].firstname +'</td>' +
        '<td>'+ data[i].lastname +'</td>' +
        '<td>'+ data[i].mi +'</td>' +
        '<td>'+ data[i].date_birth +'</td>' +
        '<td>'+ data[i].date_death +'</td>' +
        '<td>'+ data[i].date_burial +'</td>' +
        '<td>'+ data[i].cause_of_death +'</td>' +
        '<td>'+ data[i].memorial +'</td>' +
        '<td>'+ data[i].burial_type_id +'</td>' +
    '</tr>';
    }
}

function searchDeceasedRecords(input){
    search('deceased', 1, 100, input, '+created,firstname,lastname,mi,date_death,date_birth,date_burial', 'burial_type_id')
    .then( function(data){
        loadList(data.items);
    }).catch( function(e){
        console.log(e.message);
    });
}

function loadDeceasedRecords(){
    search('deceased', 1, 100, { id: '' }, '+created,id', 'burial_type_id')
    .then( function(data){
        loadList(data.items);
    }).catch( function(err){
        console.log(err.message);
    });
}