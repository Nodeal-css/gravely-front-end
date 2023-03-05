const deceasedList = document.getElementById('deceased-list');
const filter_btn = document.getElementById('filter-btn');
const insert_deceased = document.getElementById('create-deceased');


var arr = [
    ['Mike', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Cancer', 'Rest in peace', 'Appartment type'],
    ['Alby', 'Lee', 'P.', 'Female', '01/22/1929', '01/20/2012', '03/29/2021', 'Accident', 'Rest in peace', 'Appartment type'],
    ['Shawn', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Bad health', 'Rest in peace', 'Appartment type'],
    ['Jericho', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Bad health', 'Rest in peace', 'Appartment type'],
    ['Alphonso', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Bad health', 'Rest in peace', 'Appartment type'],
    ['Alpha', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Due to age', 'Rest in peace', 'Appartment type'],
    ['Beta', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Due to age', 'Rest in peace', 'Appartment type'],
    ['Omega', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Due to age', 'Rest in peace', 'Appartment type'],
    ['Delta', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Due to age', 'Rest in peace', 'Appartment type'],
    ['Bravo', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Cancer', 'Rest in peace', 'Appartment type'],
    ['Yike', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Cancer', 'Rest in peace', 'Appartment type'],
    ['Caps', 'Lopez', 'P.', 'Male', '01/22/1999', '01/20/2022', '03/29/2022', 'Cancer', 'Rest in peace', 'Appartment type']
];

function loadList(){
    for(let i = 0; i < arr.length; i++){
        deceasedList.innerHTML += '<tr>' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ arr[i][0] +'</td>' +
        '<td>'+ arr[i][1] +'</td>' +
        '<td>'+ arr[i][2] +'</td>' +
        '<td>'+ arr[i][3] +'</td>' +
        '<td>'+ arr[i][4] +'</td>' +
        '<td>'+ arr[i][5] +'</td>' +
        '<td>'+ arr[i][6] +'</td>' +
        '<td>'+ arr[i][7] +'</td>' +
        '<td>'+ arr[i][8] +'</td>' +
        '<td>'+ arr[i][9] +'</td>' +
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

insert_deceased.addEventListener('click', function(){
    let deceased = {
        "firstname": document.getElementById('d-fname').value,
        "lastname":document.getElementById('d-lname').value,
        "mi": document.getElementById('d-mi').value,
        "cause_of_death": document.getElementById('cause-of-death').value,
        "memorial": document.getElementById('memorial').value,
        "date_death": document.getElementById('dod').value,
        "date_burial": document.getElementById('d-burial').value,
        "date_birth": document.getElementById('dob').value,
        "burial_type": document.getElementById('burial-type').value,
        "image": 'path'
    };

    create('deceased', deceased).then( function(){
        console.log('Record has been added');
    }).catch( function(err){
        console.log(err);
    });
});



