const btn_menu = document.querySelector('.menu-btn');
const map_origin_picker = document.getElementById('new-window-map');
const btn_save_location = document.getElementById('btn-save-coord');
const grave_form = document.getElementById('grave-form');
const grave_type = document.getElementById('grave-type');
const cem_id = getSessionAdmin().cemetery_id;
const burialType = document.getElementById('burial-type');
const insert_deceased = document.getElementById('create-deceased');
const insert_contact = document.getElementById('insert-contact');


var flag1 = false;
var lat;
var lng;
var coord;
var marker;
var map = L.map('cem-map', {
    minZoom: 0
});
var graveMarker = L.layerGroup().addTo(map);

mapInit();
displayMap();
checkSearchExist();
loadGraveTypes();
loadBurialTypes();
getSectionList();



//Check if the user is searching a specific location from deceased info
function checkSearchExist(){
    const grave_id = localStorage.getItem('grave-id-search');
    if(grave_id == null){
        loadMarkers();
    }else{
        locateByGraveId(grave_id);
    }
}

window.addEventListener('beforeunload', function(){
    this.window.localStorage.removeItem('grave-id-search');
});

btn_menu.addEventListener('click', function(){
    let cem_map = document.getElementById('cem-map');
    if(flag1){
        cem_map.classList.remove('max-map');
        cem_map.classList.add('mini-map');
        return;
    }
    cem_map.classList.remove('mini-map');
    cem_map.classList.add('max-map');
    flag1 = true;
});

map_origin_picker.addEventListener('click', function(){
    search(MAP, 1, 1, { cemetery_id: cem_id }, '+created,cemetery_id', '')
    .then( function(data){
        if(data.items.length > 0){
            alert('Cemetery map origin has been set, please reload the webpage.');
        }else{
            window.open("../pages/adminChooseMapOrigin.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=120,left=140,width=970,height=450");
        }
    }).catch( function(e){
        console.log(e.message);
    });
    
});


map.addEventListener('mousemove', function(e){
    let coordinates = document.getElementById('coord-display'); // properties display
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    coordinates.innerHTML = "<small>Latitude: "+ lat +"<br>Longitude: "+ lng +"</small>";
});





btn_save_location.addEventListener('click', function(){
    if(!input_validation(['location-inp', 'section_picker', 'block-number', 'price-inp', 'row-inp' ,'col-inp' , 'grave-type'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }
    console.log("lat: " + coord.latitude + " lng: " + coord.longitude);
    let formdata = new FormData();
    formdata.append('cemetery_id', cem_id);
    formdata.append('section_id', document.getElementById('section_picker').value);
    formdata.append('grave_type', document.getElementById('grave-type').value);
    formdata.append('location_description', document.getElementById('location-inp').value);
    formdata.append('status', 'Vacant'),
    formdata.append('price', document.getElementById('price-inp').value);
    formdata.append('row', document.getElementById('row-inp').value);
    formdata.append('column', document.getElementById('col-inp').value);
    formdata.append('block_number', document.getElementById('block-number').value);
    formdata.append('latitude', coord.latitude);
    formdata.append('longitude', coord.longitude);

    create('grave', formdata).then( function(){
        alert('A grave location has been added.');
        clearGraveForm(true);
        loadMarkers();
    }).catch( function(e){
        console.log(e.message);
    });

    
});

document.getElementById('cem-map').addEventListener('contextmenu', function(event){
    event.preventDefault();
    map.closePopup();
    loadSectionTypes();
    let lat_txt = document.getElementById('lat-txt');
    let lng_txt = document.getElementById('lng-txt');

    if(marker != null){
        map.removeLayer(marker);
    }
    marker = new L.marker([lat, lng], {
        title: "Marker for adding a grave location",
    }).addTo(map); 
    coord = {
        "latitude": lat,
        "longitude": lng
    };
    
    //show #grave-form
    grave_form.style.animation = "show_form 0.8s";
    grave_form.style.position = "absolute";
    grave_form.style.right = "0px";
    //display coordinates in grave-form
    lat_txt.value = coord.latitude;
    lng_txt.value = coord.longitude;
});

document.getElementById('view-markers-status').addEventListener('click', function(){
    const markerStatus = {
        'Vacant': {
            iconUrl: '../assets/vacant.png',
            iconAnchor: [13, 39],
            iconSize: [28, 40],
            popupAnchor: [0, -20]
        },
        'Occupied': {
            iconUrl: '../assets/occupied.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        'Not available': {
            iconUrl: '../assets/unavailable.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        'Under repair': {
            iconUrl: '../assets/repair.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        }
    };

    search(GRAVE, 1, 1500, { cemetery_id: cem_id }, '+created,cemetery_id', '')
    .then( function(data){
        graveMarker.clearLayers();
        for(let i = 0; i < data.items.length; i++){
            L.marker([data.items[i].latitude, data.items[i].longitude], {
                icon: L.icon(markerStatus[data.items[i].status]),
                title: 'Status: ' + data.items[i].status
            }).addTo(graveMarker)
            .bindPopup(loadGravePopup(data.items[i].id, data.items[i].location_description, data.items[i].status, data.items[i].price, data.items[i].row, data.items[i].column, data.items[i].grave_type, data.items[i].deceased_id, data.items[i].contract_id, data.items[i].latitude, data.items[i].longitude))
            .on('click', function(){
                let container = document.getElementById('grave-information');
                container.style.display = 'block';
                clearGraveForm(false);
                loadDeceased(data.items[i].deceased_id);
                loadContract(data.items[i].contract_id);

                $('#open-deceased-modal').on('click', function() {
                    window.localStorage.setItem('grave-id-insert', data.items[i].id);
                    document.getElementById('image-file').addEventListener('change', function(){
                        const file = document.getElementById('image-file').files[0];
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(){
                            document.getElementById('img-preview').src = reader.result;
                        }
                    });
                });
                $('#open-contract-modal').on('click', function() {
                    window.localStorage.setItem('grave-id-insert', data.items[i].id);
                });
            });
        }
    }).catch( function(e){
        console.log(e.message);
    });
});

map.on('popupclose', function() {
    let container = document.getElementById('grave-information');
    container.style.display = 'none';
    loadMarkers();
});


function mapInit(){
    L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=8QM9cnYU5pgNqcMDeMwN', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 23,
    }).addTo(map);
}

function clearGraveForm(bool){
    if(bool){
        grave_form.style.animation = "hide_form 0.8s";
    }
    if(marker != null){
        map.removeLayer(marker);
    }
    grave_form.style.position = "fixed";
    grave_form.style.right = "-300px";
    document.getElementById('lat-txt').value = "";
    document.getElementById('lng-txt').value = "";
    document.getElementById('grave-type').value = "";
    document.getElementById('location-inp').value = "";
    document.getElementById('price-inp').value = "";
    document.getElementById('row-inp').value = "";
    document.getElementById('col-inp').value = "";
    document.getElementById('section_picker').value = "";
    document.getElementById('block-number').value = "";
    coord = {};
}

function displayMap(){
    var temp = 0;
    search('map', 1, 1, { cemetery_id: cem_id }, '+created,cemetery_id', '')
    .then( function(data){
        temp = data.items.length;
        if(temp > 0){
            changeDisplay(true);
            return;
        }
        changeDisplay(false);
    }).catch( function(err){
        console.log(err.message);
    });
    temp = 0;
}

function changeDisplay(istrue){
    if(istrue){
        focusOrigin();
        document.getElementById('cem-map').style.display = 'block';
        document.getElementById('no-map').style.display = 'none';
        console.log('display map: true');
        return;
    }else{
        document.getElementById('no-map').style.display = 'block';
        document.getElementById('cem-map').style.display = 'none';
        console.log('display map: false');
    }
}

function focusOrigin(){
    search('map', 1, 100, { cemetery_id: cem_id }, '+created,cemetery_id', 'cemetery_id')
    .then( function(data){
        map.setView([data.items[0].latitude, data.items[0].longitude], 17);
        L.control.locate().addTo(map);
    }).catch( function(err){
        console.log(err.message);
    });
}


//.bindPopup() <-- in bind pop up, create a function that receives the grave_id, that returns a string of html content containing grave and deceased info. If we want to load all the markers to the map.
function loadGravePopup(grave_id, description, status, price, row, column, type, deceased, contract, lat, lng){
    // query to db based from id
    const namesOfGraves = {
        'av67hd01wy9ud91': 'Mausoleum',
        'b087tzicqoehxlw': 'Crypt',
        'rm4446wpn3l6bzu': 'Apartment',
        'xuig8ihm4c24g2p': 'Niche',
        'fjrbidw8qsjjwr6': 'Tombstone',
        '3dey7aenzrkckgi': 'Family plot'
    };

    return '<div id="popup-grave" class="card" style="width: 19rem;display:block;">' +
    '<div class="card-header text-center">' +
        '<p class="card-title"><strong>Grave properties:</strong></p>' +
    '</div>' +
    '<div class="card-body text-center row">' +
        '<div class="col text-right">' +
            '<p class="card-text"><strong>Description: </strong></p>' +
            '<p class="card-text"><strong>Status: </strong></p>' +
            '<p class="card-text"><strong>Type: </strong></p>' +
            '<p class="card-text"><strong>Price: </strong></p>' +
            '<p class="card-text"><strong>Row: </strong></p>' +
            '<p class="card-text"><strong>Column: </strong></p>' +
        '</div>' +
        '<div class="col text-left">' +
            '<p class="card-text">'+ description +'</p>' +
            '<p class="card-text">'+ status +' <button data-toggle="modal" data-target="#modal-change-status" style="background-color: gray;border: 0 solid;color:white;" onclick="setGraveStatus(\''+ grave_id +'\', \''+ status +'\');">Edit</button></p>' +
            '<p class="card-text">'+ namesOfGraves[type] +'</p>' +
            '<p class="card-text">₱ '+ price.toLocaleString() +'</p>' +
            '<p class="card-text">'+ row +'</p>' +
            '<p class="card-text">'+ column +'</p>' +
        '</div>' +
    '</div>' +
    '<div class="card-footer text-center">' +
        '<button class="btn btn-outline-warning btn-sm mr-3" title="Change the location of grave." onclick="updateGraveCoordinates(\''+ 'grave' +'\', \''+ grave_id +'\', \''+ lat +'\', \''+ lng +'\');">Transfer</button>' + 
        '<button class="btn btn-outline-danger btn-sm" title="Click, if you wish to delete this pinned location." onclick="deleteGrave(\''+ grave_id +'\', \''+ deceased + '\', \''+ contract + '\');"><i class="uil uil-trash"></i> Remove</button>' +
        '<button class="btn btn-outline-primary btn-sm ml-3" title="Click, to see a visual representation of the grave floor and column.">Visual</button>' +
    '</div>' +
'</div>';
}


function setGraveStatus(id, status){
    window.localStorage.setItem('grave-id-status', id);
    document.getElementById('change-status').value = status;
}

document.getElementById('close-modal-status').addEventListener('click', function(){
    window.localStorage.removeItem('grave-id-status');
});

document.getElementById('save-status').addEventListener('click', function(){
    update(GRAVE, { id: localStorage.getItem('grave-id-status'), status: document.getElementById('change-status').value })
    .then( function(){
        $('#modal-change-status').modal('hide');
        map.closePopup();
        alert('Status has been changed.');
        window.localStorage.removeItem('grave-id-status');
    }).catch( function(e){
        console.log(e.message);
    });
});

function loadMarkers(){
    const temp = {
        'av67hd01wy9ud91': {
            iconUrl: '../assets/mausoleum.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        'fjrbidw8qsjjwr6': {
            iconUrl: '../assets/pin.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        'b087tzicqoehxlw': {
            iconUrl: '../assets/crypt.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        'rm4446wpn3l6bzu': {
            iconUrl: '../assets/burial_vault.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        'xuig8ihm4c24g2p': {
            iconUrl: '../assets/niche.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        },
        '3dey7aenzrkckgi': {
            iconUrl: '../assets/family_plot.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        }

    };

    search('grave', 1, 1500, { cemetery_id: cem_id }, '+created,cemetery_id', '')
    .then( function(data){
        graveMarker.clearLayers();
        for(let i = 0; i < data.items.length; i++){
            L.marker([data.items[i].latitude, data.items[i].longitude], {
                icon: L.icon(temp[data.items[i].grave_type]),
                title: 'Description: ' + data.items[i].location_description
            }).addTo(graveMarker)
            .bindPopup(loadGravePopup(data.items[i].id, data.items[i].location_description, data.items[i].status, data.items[i].price, data.items[i].row, data.items[i].column, data.items[i].grave_type, data.items[i].deceased_id, data.items[i].contract_id, data.items[i].latitude, data.items[i].longitude))
            .on('click', function(){
                let container = document.getElementById('grave-information');
                container.style.display = 'block';
                clearGraveForm(false);
                loadDeceased(data.items[i].deceased_id);
                loadContract(data.items[i].contract_id);

                $('#open-deceased-modal').on('click', function() {
                    window.localStorage.setItem('grave-id-insert', data.items[i].id);
                    document.getElementById('image-file').addEventListener('change', function(){
                        const file = document.getElementById('image-file').files[0];
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function(){
                            document.getElementById('img-preview').src = reader.result;
                        }
                    });
                });
                $('#open-contract-modal').on('click', function() {
                    window.localStorage.setItem('grave-id-insert', data.items[i].id);
                });
            });
        }
    }).catch( function(e){
        console.log(e.message);
    });
}

function locateByGraveId(graveID){
    const iconPin = L.icon({
        iconUrl: '../assets/find.png',
        iconSize: [28, 40],
        iconAnchor: [13, 39],
        popupAnchor: [0, -20]
    });

    search(GRAVE, 1, 1, { id: graveID }, '+created,id', '')
    .then(function(data){
        graveMarker.clearLayers();
        L.marker([data.items[0].latitude, data.items[0].longitude], {
            icon: iconPin,
            title: 'Description: ' + data.items[0].location_description
        }).addTo(graveMarker)
        .bindPopup(loadGravePopup(data.items[0].id, data.items[0].location_description, data.items[0].status, data.items[0].price, data.items[0].row, data.items[0].column, data.items[0].grave_type, data.items[0].deceased_id, data.items[0].contract_id, data.items[0].latitude, data.items[0].longitude))
        .on('click', function(){
            let container = document.getElementById('grave-information');
            container.style.display = 'block';
            loadDeceased(data.items[0].deceased_id);
            loadContract(data.items[0].contract_id);

            $('#open-deceased-modal').on('click', function() {
                window.localStorage.setItem('grave-id-insert', data.items[0].id);
            });
            $('#open-contract-modal').on('click', function() {
                window.localStorage.setItem('grave-id-insert', data.items[0].id);
            });
        });
    }).catch(function(e){
        console.log(e.message);
    });
}

function updateGraveCoordinates(collection, graveID, lat, lng){
    window.open("../pages/adminUpdateCoordinates.html?collection="+ collection + "&id=" + graveID +"&lat="+ lat + "&lng=" + lng, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=120,left=140,width=970,height=450");
}

document.getElementById('change-cemetery-location').addEventListener('click', function(){
    search(MAP, 1, 1, { cemetery_id: cem_id }, '+created,cemetery_id', '')
    .then( function(data){
        const collection = "map";
        const id = cem_id;
        const lat = data.items[0].latitude;
        const lng = data.items[0].longitude;
        window.open("../pages/adminUpdateCoordinates.html?collection="+ collection + "&id=" + data.items[0].id +"&lat="+ lat + "&lng=" + lng, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=120,left=140,width=970,height=450");
    }).catch( function(e){
        console.log(e.message);
    });
});

document.getElementById("close-deceased").addEventListener('click', function(){
    window.localStorage.removeItem('grave-id-insert');
    document.getElementById('img-preview').src = "../assets/grave-logo.png";
    clearInput(['d-fname', 'd-lname', 'd-mi', 'cause-of-death', 'memorial', 'dod', 'd-burial', 'dob', 'burial-type', 'gender', 'image-file']);
});
document.getElementById("close-contract").addEventListener('click', function(){
    window.localStorage.removeItem('grave-id-insert');
    clearInput(['c-fname', 'c-lname', 'c-mi', 'c-address', 'c-tel']);

});


function loadGraveTypes(){
    search('grave_type', 1, 100, { id: '' }, '+created,id', '')
    .then( function(data){
        grave_type.innerHTML = "<option value='' disabled selected>Choose type</option>";
        for(let i = 0; i < data.items.length; i++){
            grave_type.innerHTML += "<option value="+ data.items[i].id +">"+ data.items[i].type +"</option>";
        }
        document.getElementById('grave-type-section').innerHTML = grave_type.innerHTML;
    }).catch( function(err){
        console.log(err.message);
    });
}

function loadSectionTypes(){
    var sectionTypes = document.getElementById('section_picker');
    search(SECTION, 1, 50, {id: ' '}, '+created,id', '')
    .then( function(data){
        sectionTypes.innerHTML = "";
        sectionTypes.innerHTML = "<option value='' disabled selected>Choose which section</option>";
        for(let i = 0; i < data.items.length; i++){
            sectionTypes.innerHTML += "<option value="+ data.items[i].id +">"+ data.items[i].section_name +"</option>";
        }
    }).catch( function(e){
        console.log(e.message);
    });
}

function deleteGrave(grave_id, deceased_id, contract_id){
    if(confirm("Are you sure you want to delete this pinned location?")){
        remove(GRAVE, grave_id, { '$autoCancel': false });
        if(deceased_id !== ""){
            remove(DECEASED, deceased_id, { '$autoCancel': false });
        }
        if(contract_id !== ""){
            remove(CONTRACT, contract_id, { '$autoCancel': false });
        }
        
        alert('Grave has been removed.');
        map.closePopup();
    }
}

// Insertion for deceased Record
function loadBurialTypes(){
    search('burial_type', 1, 100, { id: '' }, '+created,id', '')
    .then( function(data){
        burialType.innerHTML = "<option value='' disabled selected>Choose type</option>";
        for(let i = 0; i < data.items.length; i++){
            burialType.innerHTML += "<option value="+ data.items[i].id +">"+ data.items[i].type +"</option>";
        }
    }).catch( function(err){
        console.log(err.message);
    });
}

insert_deceased.addEventListener('click', function(){
    let form = new FormData();
    form.append('firstname', document.getElementById('d-fname').value);
    form.append('lastname', document.getElementById('d-lname').value);
    form.append('mi', document.getElementById('d-mi').value);
    form.append('cause_of_death', document.getElementById('cause-of-death').value);
    form.append('memorial', document.getElementById('memorial').value);
    form.append('date_death', document.getElementById('dod').value);
    form.append('date_burial', document.getElementById('d-burial').value);
    form.append('date_birth', document.getElementById('dob').value);
    form.append('burial_type_id', document.getElementById('burial-type').value);
    form.append('gender', document.getElementById('gender').value);
    form.append('image', document.getElementById('image-file').files[0]);

    if(!input_validation(['d-fname', 'd-lname', 'd-mi', 'cause-of-death', 'memorial', 'dod', 'd-burial', 'dob', 'burial-type', 'gender', 'image-file'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }

    if(!checkDateValidity(document.getElementById('dob').value, document.getElementById('dod').value, document.getElementById('d-burial').value)){
        alert('Invalid date inputs. To fix the issue please consider the following.\n\n- The deceased birthday must be before the date of death.\n- The date of death must be earlier than date of burial.\n- The date of burial must not exceed to 14 days after the death. \n- The date of death must not be in future dates including birthday.');
        return;
    }

    create('deceased', form).then( function(data){
        alert('Inserted deceased record');
        $('#add-deceased').modal('hide');
        clearInput(['d-fname', 'd-lname', 'd-mi', 'cause-of-death', 'memorial', 'dod', 'd-burial', 'dob', 'burial-type', 'gender', 'image-file']);
        document.getElementById('img-preview').src = "../assets/grave-logo.png";

        updateGraveDeceased(window.localStorage.getItem('grave-id-insert'), data.id);
        window.localStorage.removeItem('grave-id-insert');
        loadDeceased(data.id);
    }).catch( function(err){
        console.log(err);
    });

});


//function to trap if birth date is less than date of death & date of death is less than date of burial.
function checkDateValidity(birth, death, burial){
    const birth_date = new Date(birth);
    const death_date = new Date(death);
    const burial_date = new Date(burial);
    const within2weeks = (burial_date.getTime() - death_date.getTime()) / (1000 * 60 * 60 * 24);
    const current = new Date();
    return (birth_date.getTime() < death_date.getTime() && death_date.getTime() < burial_date.getTime() && within2weeks <= 14 && death_date.getTime() <= current.getTime());
}


function clearInput(id = []){
    for(let i = 0; i < id.length; i++){
        document.getElementById(id[i]).value = "";
    }
}

function updateGraveDeceased(grave_id, input){
    update(GRAVE, { id: grave_id, deceased_id: input, status: 'Occupied'}).then( function(){
        console.log('Grave has included deceased: ' + input);
    }).catch( function(e){
        console.log(e.message);
    });
}

function loadDeceased(deceased_id){
    //if deceased is found : turn of filter
    if(deceased_id === ""){
        document.getElementById('deceased-info').classList.add('blur-element');
        document.getElementById('open-deceased-modal').style.display = 'block';
        return;
    }else{
        document.getElementById('deceased-info').classList.remove('blur-element');
        document.getElementById('open-deceased-modal').style.display = 'none';
        search(DECEASED, 1, 1, { id: deceased_id }, '+created,id', 'burial_type_id')
        .then( function(data){
            let info = document.getElementById('deceased-info-details');
            info.innerHTML = '<small>'+ data.items[0].firstname + ' ' + data.items[0].mi + ' ' + data.items[0].lastname +'</small>' +
            '<br><br><small>'+ data.items[0].date_burial.substring(0, 10) +'</small>' +
            '<br><small>'+ data.items[0].date_birth.substring(0, 10) +'</small>' +
            '<br><small>'+ data.items[0].cause_of_death +'</small>' + 
            '<br><small><a href="#" onclick="openDeceasedInfo(\''+ deceased_id +'\');" title="Open to view more details">more...</a></small>';
            document.getElementById('memorial-message').innerHTML = 'Memorial: ' + data.items[0].memorial;
        }).catch( function(e){
            console.log(e.message);
        }); 
    }
}

function openDeceasedInfo(id){
    window.localStorage.setItem('deceased-id', id);
    location.href = "../pages/adminDeceasedInfo.html";
}

// END: Insertion for deceased Record


// Insertion for Contract record
insert_contact.addEventListener('click', function(){
    let contact = {
        "fname": document.getElementById('c-fname').value,
        "lname": document.getElementById('c-lname').value,
        "mi": document.getElementById('c-mi').value, 
        "address": document.getElementById('c-address').value,
        "tel": document.getElementById('c-tel').value
    };

    if(!input_validation(['c-fname', 'c-lname', 'c-mi', 'c-address', 'c-tel'])){
        alert('There are invalid input fields. Please fill all text boxes.');
        return;
    }

    create('contract', contact).then( function(data){
        console.log('Inserted a contact record');
        alert('Inserted a contact record');
        $("#add-contact").modal('hide');
        clearInput(['c-fname', 'c-lname', 'c-mi', 'c-address', 'c-tel']);

        updateGraveContract(window.localStorage.getItem('grave-id-insert'), data.id);
        window.localStorage.removeItem('grave-id-insert');
        loadContract(data.id);
    }).catch( function(err){
        console.log(err.message);
    });
});

function updateGraveContract(grave_id, input){
    update(GRAVE, { id: grave_id, contract_id: input}).then( function(){
        console.log('Grave has included contract: ' + input);
    }).catch( function(e){
        console.log(e.message);
    });
}

function loadContract(contract_id){
    if(contract_id === ""){
        document.getElementById('contract-info').classList.add('blur-element');
        document.getElementById('open-contract-modal').style.display = 'block';
        return;
    }else{
        document.getElementById('contract-info').classList.remove('blur-element');
        document.getElementById('open-contract-modal').style.display = 'none';
        search(CONTRACT, 1, 1, { id: contract_id }, '+created,id', '')
        .then( function(data){
            let html = document.getElementById('contract-info-details');
            html.innerHTML = '<small>'+ data.items[0].fname + ' ' + data.items[0].mi + ' ' + data.items[0].lname +'</small>' +
            '<br><small>'+ data.items[0].address +'</small><br>' +
            '<br><small>'+ data.items[0].tel +'</small>' + 
            '<br><small><a href="#" onclick="openContractInfo(\''+ contract_id +'\');" title="Open to view more details">more...</a></small>';
        }).catch( function(e){
            console.log(e.message);
        });
    }
}

function openContractInfo(id){
    window.localStorage.setItem('contract-id', id);
    location.href = "../pages/adminContactInfo.html";
}


/* 
*  This method will check if the format of input is not followed, or if it is empty. 
*  @return true if input is valid,
*  @return false otherwise
*/
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


/*
    javascript code for cemetery sections
*/
function loadSectionList(data){
    const namesOfGraves = {
        'av67hd01wy9ud91': 'Mausoleum',
        'b087tzicqoehxlw': 'Crypt',
        'rm4446wpn3l6bzu': 'Apartment',
        'xuig8ihm4c24g2p': 'Niche',
        'fjrbidw8qsjjwr6': 'Tombstone',
        '3dey7aenzrkckgi': 'Family plot'
    };
    var sectionList = document.getElementById('section-list');
    sectionList.innerHTML = "";


    for(let i = 0; i < data.length; i++){
        sectionList.innerHTML += '<tr onclick="viewFloorVisual(\''+ data[i].id +'\', \''+ data[i].section_name +'\', \''+ data[i].total_column +'\', \''+ data[i].total_row +'\', \''+ namesOfGraves[data[i].grave_type_id] +'\');">' +
        '<td>'+ (i + 1) +'</td>' +
        '<td>'+ data[i].section_name +'</td>' + 
        '<td>'+ namesOfGraves[data[i].grave_type_id] +'</td>' +
        '<td>'+ data[i].total_column +'</td>' +
        '<td>'+ data[i].total_row +'</td>' +
        '<td><button class="btn btn-outline-success btn-sm"><i class="uil uil-edit"></i></button></td>' +
        '</tr>';
    }
}

document.getElementById('save-section').addEventListener('click', function(){
    const graveTypeSection = document.getElementById('grave-type-section').value;
    const totalColumn = document.getElementById('inp-total-column').value;
    const totalRow = document.getElementById('inp-total-row').value;
    const secName = document.getElementById('section-name').value;

    const sectionObj = {
        cemetery_id: getSessionAdmin().cemetery_id,
        section_name: secName,
        grave_type_id: graveTypeSection,
        total_column: totalColumn,
        total_row: totalRow
    }

    create(SECTION, sectionObj).then( function(){
        clearInput(['grave-type-section', 'inp-total-column', 'inp-total-row']);
        $("#add-section").modal('hide');
        getSectionList();
    }).catch( function(e){
        console.log(e.message);
    });
});

function getSectionList(){
    search(SECTION, 1, 50, { cemetery_id: getSessionAdmin().cemetery_id }, '-created,cemetery_id')
    .then( function(data){
        
        loadSectionList(data.items);
    }).catch(function(e){
        console.log(e.message);
    });
}

function viewFloorVisual(section_id, name, column, row, type){
    var grave_grid = document.getElementById('grave-grid');
    $("#section-visuals").modal('show');
    grave_grid.style.gridTemplateColumns  = "repeat("+ column +", 1fr)";
    grave_grid.innerHTML = "";
    for(let i = 0; i < row * column; i++){
        grave_grid.innerHTML += '<div class="grid-item" style="cursor: pointer;" onclick="calculateRowAndColumn(\''+ column +'\', \''+ (i+1) + '\');">'+ (i + 1) +'</div>';
    }
}

function openBlockPickerModal(section_id, name, column, row, type){
    var graveGrid = document.getElementById('grave-grid-picker');
    $("#modal-block-picker").modal('show');
    document.getElementById('block-picker-header').innerHTML = name + "<br>Select the grave's level or row";
    graveGrid.style.gridTemplateColumns  = "repeat("+ column +", 1fr)";
    graveGrid.innerHTML = "";
    for(let i = 0; i < row * column; i++){
        graveGrid.innerHTML += '<div class="grid-item" style="cursor: pointer;" onclick="document.getElementById(\''+"block-number"+'\').value = \''+ (i+1) + '\'; hideBlockPicker();">'+ (i + 1) +'</div>';
    }
}

function calculateRowAndColumn(columns, cellNumber) {
    var row = Math.ceil(cellNumber / columns);
    var column = (cellNumber - 1) % columns + 1;
    console.log([row, column]);
}

function hideBlockPicker(){
    $("#modal-block-picker").modal('hide');
}

document.getElementById('section_picker').addEventListener('change', function(){
    const secID = document.getElementById('section_picker').value;
    console.log(secID);
    search(SECTION, 1, 1, { id: secID }, '+created,id')
    .then(function(data){
        document.getElementById('location-inp').value = data.items[0].section_name;
        openBlockPickerModal(data.items[0].id, data.items[0].section_name, data.items[0].total_column, data.items[0].total_row, data.items[0].grave_type_id);
    }).catch( function(e){
        console.log(e.message);
    });
});