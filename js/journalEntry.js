const saveEntry = document.getElementById('save-journal');
const updateEntry = document.getElementById('update-entry');

loadJournal(getSessionAdmin().cemetery_id);

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
        loadJournal(getSessionAdmin().cemeter_id);
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
        loadJournal(getSessionAdmin().cemetery_id);
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


function loadJournal(id){
    search('journal', 1, 50, { cemeter_id: getSessionAdmin().cemetery_id }, '-created,cemeter_id', '')
    .then( function(data){
        loadList(data.items);
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
        '<td>₱ '+ data[i].credit +'</td>' +
        '<td>₱ '+ data[i].debit +'</td>' +
        '<td>'+ data[i].particular +'</td>' +
        '<td>'+ data[i].updated +'</td>' +
        '<td><button onclick="showEditModal(\''+ data[i].id +'\', \''+ data[i].credit +'\',\''+  data[i].debit +'\', \''+ data[i].particular +'\');">edit</button> <button onclick=" deleteEntry(\''+ data[i].id +'\');" title="Click if you want to delete this entry.">Delete</button></td>' +
        '</tr>';
    }
}

function deleteEntry(id){
    if(confirm('Are you sure you want to delete this entry?')){
        remove('journal', id).then(function(){
            alert('Entry has been deleted.');
            loadJournal(getSessionAdmin().cemetery_id);
        }).catch( function(e){
            console.log(e.message);
        });
    }
}

function showEditModal(id, credit, debit, particular){
    $('#modal-update').modal('show');
    document.getElementById('journal-id').value = id;
    document.getElementById('update-amount').value = debit + credit;
    document.getElementById('update-particular').value = particular;
    document.getElementById('update-debit-credit').value = (credit > debit) ? "credit" : "debit";
}