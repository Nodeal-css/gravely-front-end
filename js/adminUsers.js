const adminList = document.getElementById('admin-list');

var arr = [
    ['Johanna@example.com', '#########', 'Johanna.', 'Salamanca', 'P'],
    ['Rowen@example.com', '#########', 'Terra.', 'Juana', 'L'],
    ['Steven@example.com', '#########', 'Fert.', 'Schwiker', 'A'],
    ['Hawking@example.com', '#########', 'Urgot.', 'Perez', 'S'],
    ['Alpha@example.com', '#########', 'Pedro.', 'Solomon', 'N'],
    ['Johanna@example.com', '#########', 'Johanna.', 'Salamanca', 'P'],
    ['Rowen@example.com', '#########', 'Terra.', 'Juana', 'L'],
    ['Steven@example.com', '#########', 'Fert.', 'Schwiker', 'A'],
    ['Hawking@example.com', '#########', 'Urgot.', 'Perez', 'S'],
    ['Alpha@example.com', '#########', 'Pedro.', 'Solomon', 'N']
];

function loadList(){
    for(let i = 0; i < arr.length; i++){
        adminList.innerHTML += '<tr>' +
        '<th scope="row">'+ (i + 1) +'.</th>' +
        '<td>'+ arr[i][0] +'</td>' +
        '<td>'+ arr[i][1] +'</td>' +
        '<td>'+ arr[i][2] +'</td>' +
        '<td>'+ arr[i][3] +'</td>' +
        '<td>'+ arr[i][4] +'</td>' +
    '</tr>';
    }
}
loadList();