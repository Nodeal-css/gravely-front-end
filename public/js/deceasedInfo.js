
const btn_update = document.getElementById('updateDisplay');
const upload_pdf = document.getElementById('upload-pdf');
const burial_type = document.getElementById('burial-type-input');
const delete_btn = document.getElementById('delete-deceased');
const locate = document.getElementById('locate');

loadInfo(getDeceasedId());
getDocuments(getDeceasedId());


window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem('deceased-id');
});

btn_update.addEventListener('click', function(){
    const person = {
        id: getDeceasedId(),
        firstname: document.getElementById('fNameInput').value,
        lastname: document.getElementById('lNameInput').value,
        mi: document.getElementById('miInput').value,
        gender: document.getElementById('gender').value,
        date_birth: document.getElementById('birthInput').value,
        date_death: document.getElementById('deathInput').value,
        date_burial: document.getElementById('burialInput').value,
        cause_of_death: document.getElementById('cDeathInput').value,
        memorial: document.getElementById('memorialInput').value,
        burial_type_id: document.getElementById('burial-type-input').value 
    }

    if(!input_validation(['fNameInput', 'lNameInput', 'miInput', 'gender', 'birthInput', 'deathInput', 'burialInput', 'cDeathInput', 'memorialInput', 'burial-type-input'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }

    if(!checkDateValidity(document.getElementById('birthInput').value, document.getElementById('deathInput').value, document.getElementById('burialInput').value)){
        alert('The date of birth should not be after than death & burial dates.\nAnd the burial date is later and should not exceed to 2 weeks after date of death. Please check once again.');
        return;
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
    if(document.getElementById('pdf-file').value === ""){
        alert("No file to be uploaded.");
        return;
    }
    //console.log(formdata);
    create(LEGAL_DOCUMENT, formdata).then( function(){
        alert('PDF legal document has been uploaded.');
        $("#pdf-modal").modal('hide');
        getDocuments(getDeceasedId());
        document.getElementById('pdf-file').value = "";
    }).catch( function(e){
        console.log(e.message);
    })
});

delete_btn.addEventListener('click', function(){
    if(confirm('Do you wish to remove this record?')){
        search(GRAVE, 1, 1, { deceased_id: getDeceasedId() }, '+created,deceased_id', '')
        .then( function(data){
            changeGraveStatusVacant(data.items[0].id);
            
            remove(DECEASED, getDeceasedId()).then( function(){
                alert('Record has been deleted.');
                window.location.href = "../pages/adminDeceasedRecords.html";
                window.localStorage.removeItem('deceased-id');
            }).catch( function(e){
                console.log(e.message);
            });
        }).catch( function(e){
            console.log(e.message);
        });
    }
});

locate.addEventListener('click', function(){
    search(GRAVE, 1, 1, { deceased_id: getDeceasedId() }, '+created,deceased_id', '')
    .then( function(data){
        window.localStorage.setItem('grave-id-search', data.items[0].id);
        location.href = '../pages/AdminCemeteryMap.html';
    }).catch( function(e){
        console.log(e.message);
    });
});

function getDeceasedId(){
    const id = window.localStorage.getItem('deceased-id');
    return id;
}


async function changeGraveStatusVacant(graveID){
    update(GRAVE, { id: graveID, status: "Vacant" })
    .then(function(){
        console.log("Grave status has been changed to vacant");
    }).catch(function(e){
        console.log(e.message);
    });
}


async function loadInfo(deceased_id){
    if(deceased_id === null){
        alert('Deceased Info not found, returning to list page.');
        window.location.href = "../pages/adminDeceasedRecords.html";
        return;
    }else{
        search('deceased', 1, 1, { id: deceased_id }, '+created,id', 'burial_type_id')
        .then( function(data){
            //console.log(data);
            document.getElementById('fNameInput').value = data.items[0].firstname;
            document.getElementById('miInput').value = data.items[0].mi;
            document.getElementById('lNameInput').value = data.items[0].lastname;
            document.getElementById('birthInput').placeholder = data.items[0].date_birth;
            document.getElementById('gender').value = data.items[0].gender;
            document.getElementById('deathInput').placeholder = data.items[0].date_death;
            document.getElementById('burialInput').placeholder = data.items[0].date_burial;
            document.getElementById('cDeathInput').value = data.items[0].cause_of_death;
            document.getElementById('memorialInput').value = data.items[0].memorial;
            document.getElementById('burial-type-input').value = data.items[0].burial_type_id;
            document.getElementById('deceased-img').setAttribute('src', 'http://127.0.0.1:8090/api/files/deceased/'+ data.items[0].id +'/' + data.items[0].image);
        }).catch( function(e){
            console.log(e.message);
        });
    }
}

//function to trap if birth date is less than date of death & date of death is less than date of burial.
function checkDateValidity(birth, death, burial){
    const birth_date = new Date(birth);
    const death_date = new Date(death);
    const burial_date = new Date(burial);
    const within2weeks = (burial_date.getTime() - death_date.getTime()) / (1000 * 60 * 60 * 24);
    const current = new Date();
    return (birth_date.getTime() < death_date.getTime() && death_date.getTime() < burial_date.getTime() && within2weeks <= 14 && death_date.getTime() <= current.getTime());
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

function getDocuments(input){
    search(LEGAL_DOCUMENT, 1, 100, { deceased_id: input }, '+created,deceased_id', 'deceased_id')
    .then( function(data){
        loadDocumentsList(data.items);
    }).catch( function(e){
        console.log(e.message);
    })
}

function loadDocumentsList(data = []){
    let pdf_list = document.getElementById('pdf-list');
    let html = '<div class="row">';
    for(let i = 0; i < data.length; i++){
        if(i % 4 === 0){
            html += '</div><div class="row">';
        }
        html += '<div class="col-3 text-center">'+ 
        '<img src="../assets/pdf-img.png" alt="pdf logo" width="230" height="280" style="cursor: pointer;" onclick="openPDF(\''+ data[i].id +'\',\''+ data[i].file +'\')">' +
        '<br>' +
        data[i].file.substring(0, data[i].file.length - 15) +
        '<br><button class="btn btn-danger btn-sm" onclick="deletePDF(\''+ data[i].id +'\');">Remove</button>' + 
        '</div>';
    }
    html += '</div>';
    pdf_list.innerHTML = html;
}

function openPDF(id, file_name){
    const url = "http://127.0.0.1:8090/api/files/legal_document/"+ id +"/" + file_name;
    window.open(url, "_blank");
}


function deletePDF(id){
    if(confirm('Are you sure you want to delete this file?')){
        remove(LEGAL_DOCUMENT, id).then(function(){
            alert('File has been deleted.');
            getDocuments(getDeceasedId());
        }).catch(function(e){
            console.log(e.message);
        });
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