const filter_btn = document.getElementById('filter-btn');
const contact_list = document.getElementById('contact-list');
const insert_contact = document.getElementById('insert-contact');
//8
var arr = [
    ['Johanna', 'Garry', 'J.', '02/14/2015', 'Pob. III, Carcar City', '245-1711', '09121231511'],
    ['Rowen', 'Garison', 'T.', '03/13/2016', 'Luwan luwan, Carcar City', '123-1241', '09421313133'],
    ['Steven', 'Stephen', 'F.', '03/13/2017', 'Argao City, Cebu', '123-2241', '09321314123'],
    ['Hawking', 'Hank', 'U.', '03/13/2018', 'San Fernando City, Cebu', '123-51241', '09321541231'],
    ['Alpha', 'Shrader', 'P.', '03/13/2019', 'Naga City, Cebu', '123-4441', '0932145125']
];

function loadList(){
    for(let i = 0; i < arr.length; i++){
        contact_list.innerHTML += '<tr>' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ arr[i][0] +'</td>' +
        '<td>'+ arr[i][1] +'</td>' +
        '<td>'+ arr[i][2] +'</td>' +
        '<td>'+ arr[i][3] +'</td>' +
        '<td>'+ arr[i][4] +'</td>' +
        '<td>'+ arr[i][5] +'</td>' +
        '<td>'+ arr[i][6] +'</td>' +
    '</tr>';
    }
}
loadList();

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
    }).catch( function(err){
        console.log(err.message);
    });
});