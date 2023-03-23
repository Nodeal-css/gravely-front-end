
const btn_update = document.getElementById('updateDisplay');
const upload_pdf = document.getElementById('upload-pdf');

loadInfo(getDeceasedId());

btn_update.addEventListener('click', function(){
    const person = {
        id: getDeceasedId(),
        firstname: document.getElementById('fNameInput').value,
        lastname: document.getElementById('lNameInput').value,
        mi: document.getElementById('miInput').value,
        date_birth: document.getElementById('birthInput').value,
        date_death: document.getElementById('deathInput').value,
        date_burial: document.getElementById('burialInput').value,
        cause_of_death: document.getElementById('cDeathInput').value,
        memorial: document.getElementById('memorialInput').value,
        burial_type_id: document.getElementById('burial-type-input').value 
    }

    update('deceased', person).then( function(){
        console.log("id: " + person.id + " updated");
        alert("Deceased information has been updated!");
        loadInfo(person.id);
        closeEdit();
    }).catch( function(err){
        console.log(err.message);
    });
});

document.getElementById('edit').onclick = function() {
    document.getElementById('updateDisplay').style.display="inline";
    document.getElementById('fNameInput').removeAttribute('readonly');
    document.getElementById('miInput').removeAttribute('readonly');
    document.getElementById('lNameInput').removeAttribute('readonly');
    document.getElementById('birthInput').removeAttribute('readonly');
    // gender field
    document.getElementById('deathInput').removeAttribute('readonly');
    document.getElementById('burialInput').removeAttribute('readonly');
    document.getElementById('cDeathInput').removeAttribute('readonly');
    document.getElementById('memorialInput').removeAttribute('readonly');
    document.getElementById('burial-type-input').removeAttribute('readonly');
    document.getElementById('edit').style.display="none";
    document.getElementById('close').style.display="inline";
    
    document.getElementById('birthInput').setAttribute('type', 'date');
    // gender field
    document.getElementById('deathInput').setAttribute('type', 'date');
    document.getElementById('burialInput').setAttribute('type', 'date');

};
document.getElementById('close').onclick = function(){
    closeEdit();
};

upload_pdf.addEventListener('click', function(){
    const data = document.getElementById('pdf-file').files[0];
    let formdata = new FormData();
    formdata.append('file', data);
    formdata.append('deceased_id', getDeceasedId());
    //console.log(formdata);
    create(LEGAL_DOCUMENT, formdata).then( function(){
        alert('PDF legal document has been uploaded.');
    }).catch( function(e){
        console.log(e.message);
    })
});

function getDeceasedId(){
    const id = window.localStorage.getItem('deceased-id');
    return id;
}

function loadInfo(deceased_id){
    search('deceased', 1, 100, { id: deceased_id }, '+created,id', 'burial_type_id')
    .then( function(data){
        //console.log(data);
        document.getElementById('fNameInput').value = data.items[0].firstname;
        document.getElementById('miInput').value = data.items[0].mi;
        document.getElementById('lNameInput').value = data.items[0].lastname;
        document.getElementById('birthInput').placeholder = data.items[0].date_birth;
        // gender field
        document.getElementById('deathInput').placeholder = data.items[0].date_death;
        document.getElementById('burialInput').placeholder = data.items[0].date_burial;
        document.getElementById('cDeathInput').value = data.items[0].cause_of_death;
        document.getElementById('memorialInput').value = data.items[0].memorial;
        document.getElementById('burial-type-input').value = data.items[0].burial_type_id;
    }).catch( function(e){
        console.log(e.message);
    });
}

function closeEdit(){
    document.getElementById('edit').style.display="inline";
    document.getElementById('updateDisplay').style.display="none";
    document.getElementById('close').style.display="none";
  
    document.getElementById('fNameInput').setAttribute('readonly', true);
    document.getElementById('miInput').setAttribute('readonly', true);
    document.getElementById('lNameInput').setAttribute('readonly', true);
    document.getElementById('birthInput').setAttribute('readonly', true);
    //document.getElementById('sexInput').setAttribute('readonly', true);
    document.getElementById('deathInput').setAttribute('readonly', true);
    document.getElementById('burialInput').setAttribute('readonly', true);
    document.getElementById('cDeathInput').setAttribute('readonly', true);
    document.getElementById('memorialInput').setAttribute('readonly', true);
    document.getElementById('burial-type-input').setAttribute('readonly', true);
  
    document.getElementById('birthInput').setAttribute('type', 'text');
      // gender field
    document.getElementById('deathInput').setAttribute('type', 'text');
    document.getElementById('burialInput').setAttribute('type', 'text');
}
