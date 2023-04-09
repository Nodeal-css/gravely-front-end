const saveEntry = document.getElementById('save-journal');
const updateEntry = document.getElementById('update-entry');
var graphForcast = 1;


loadJournal();

saveEntry.addEventListener('click', function(){
    if(!input_validation(['debit-credit', 'amount', 'particular'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }

    const option = document.getElementById('debit-credit')
    var form = new FormData();
    form.append('cemeter_id', getSessionAdmin().cemetery_id);
    form.append(option.value, document.getElementById('amount').value);
    form.append('particular', document.getElementById('particular').value);

    create('journal', form).then( function(){
        alert('Journal Entry has been added.');
        $('#modal-journalentry').modal('hide');
        clearInput(['debit-credit', 'amount', 'particular']);
        loadJournal();
    }).catch( function(e){
        console.log(e.message);
    });
});

updateEntry.addEventListener('click', function(){
    if(!input_validation(['journal-id', 'update-amount', 'update-particular', 'update-debit-credit'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }
    const amount = document.getElementById('update-amount').value;
    const input = {
        id: document.getElementById('journal-id').value,
        credit: (document.getElementById('update-debit-credit').value == "credit") ? amount : 0,
        debit: (document.getElementById('update-debit-credit').value == "debit") ? amount : 0,
        particular: document.getElementById('update-particular').value
    };

    update('journal', input).then( function(){
        alert('Entry has been updated.');
        $('#modal-update').modal('hide');
        loadJournal();
        clearInput(['journal-id', 'update-amount', 'update-particular', 'update-debit-credit']);
    }).catch(function(e){
        console.log(e.message);
    });
});

function clearInput(id = []){
    for(let i = 0; i < id.length; i++){
        document.getElementById(id[i]).value = "";
    }
}

function input_validation(id = []){
    let flag = true;
    for(let i = 0; i < id.length; i++){
        let input = document.getElementById(id[i]);
        if(!input.checkValidity()){
            flag = false;
            break;
        }
    }
    return flag;
}


function loadJournal(){
    search('journal', 1, 1500, { cemeter_id: getSessionAdmin().cemetery_id }, '-created,cemeter_id', '')
    .then( function(data){
        loadList(data.items);
        populateDataOnGraph(data.items);
    }).catch( function(e){
        console.log(e.message);
    });
}

function loadList(data){
    var list = document.getElementById('journal-list');
    list.innerHTML = "";
    for(var i = 0; i < data.length; i++){
        list.innerHTML += '<tr>' +
        '<td>'+ data[i].created +'</td>' +
        '<td>₱ '+ data[i].credit.toLocaleString() +'</td>' +
        '<td>₱ '+ data[i].debit.toLocaleString() +'</td>' +
        '<td>'+ data[i].particular +'</td>' +
        '<td>'+ data[i].updated +'</td>' +
        '<td><button class="btn btn-outline-success btn-sm" onclick="showEditModal(\''+ data[i].id +'\', \''+ data[i].credit +'\',\''+  data[i].debit +'\', \''+ data[i].particular +'\');">edit</button> <button class="btn btn-outline-danger btn-sm" onclick=" deleteEntry(\''+ data[i].id +'\');" title="Click if you want to delete this entry.">Delete</button></td>' +
        '</tr>';
    }
}

function deleteEntry(id){
    if(confirm('Are you sure you want to delete this entry?')){
        remove('journal', id).then(function(){
            alert('Entry has been deleted.');
            loadJournal();
        }).catch( function(e){
            console.log(e.message);
        });
    }
}

function showEditModal(id, credit, debit, particular){
    const amount = parseFloat(credit) + parseFloat(debit);
    $('#modal-update').modal('show');
    document.getElementById('journal-id').value = id;
    document.getElementById('update-amount').value = amount;
    document.getElementById('update-particular').value = particular;
    document.getElementById('update-debit-credit').value = (credit > debit) ? "credit" : "debit";
}

/* 
Graph functions

*/

const date = new Date();
var year = date.getFullYear();
function populateDataOnGraph(dataItems = []){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    //date.toLocaleString('default', { month: 'long' });
    
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Month', 'Income', 'Expense'],
            ['January', populate(dataItems, year + '-01')[0],      populate(dataItems, year + '-01')[1]],
            ['February', populate(dataItems, year + '-02')[0],      populate(dataItems, year + '-02')[1]],
            ['March',  populate(dataItems, year + '-03')[0],      populate(dataItems, year + '-03')[1]],
            ['April',  populate(dataItems, year + '-04')[0],      populate(dataItems, year + '-04')[1]],
            ['May',  populate(dataItems, year + '-05')[0],       populate(dataItems, year + '-05')[1]],
            ['June',  populate(dataItems, year + '-06')[0],       populate(dataItems, year + '-06')[1]],
            ['July',  populate(dataItems, year + '-07')[0],       populate(dataItems, year + '-07')[1]],
            ['August',  populate(dataItems, year + '-08')[0],       populate(dataItems, year + '-08')[1]],
            ['September',  populate(dataItems, year + '-09')[0],       populate(dataItems, year + '-09')[1]],
            ['October',  populate(dataItems, year + '-10')[0],       populate(dataItems, year + '-010')[1]],
            ['November',  populate(dataItems, year + '-11')[0],       populate(dataItems, year + '-11')[1]],
            ['December',  populate(dataItems, year + '-12')[0],       populate(dataItems, year + '-12')[1]],
        ]);
    
        var options = {
            title: year,
            curveType: 'function',
            legend: { position: 'bottom' }
        };
    
        var chart = new google.visualization.LineChart(document.getElementById('col-chart'));
    
        chart.draw(data, options);
    }
    //console.log();
}

document.getElementById('last-year').addEventListener('click', function(){
    year--;
    //console.log(year);
    loadJournal();
});

document.getElementById('next-year').addEventListener('click', function(){
    year = (year >= new Date().getFullYear()) ? year : (year + 1);
    //console.log(year);
    loadJournal();
});

function populate(data, year_month){
    var resultCredit = 0;
    var resultDebit = 0;
    for(let i = 0; i < data.length; i++){
        if(data[i].updated.includes(year_month)){
            resultCredit += data[i].credit;
            resultDebit += data[i].debit;
        }else{
            break;
        }
    }
    return [resultCredit, resultDebit];
}

function getPastDate(date1, subtract){
    return new String(new Date(date1.setMonth(date1.getMonth() - subtract)).getFullYear() + '-' + (new Date(date.setMonth((date1.getMonth() + 1) - subtract)).getMonth() + 1));
}