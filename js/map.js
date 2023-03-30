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
loadGraveTypes();
loadMarkers();
loadBurialTypes();

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
    window.open("../pages/adminChooseMapOrigin.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=120,left=140,width=970,height=450");
});


map.addEventListener('mousemove', function(e){
    let coordinates = document.getElementById('coord-display'); // properties display
    lat = e.latlng.lat;
    lng = e.latlng.lng;
    coordinates.innerHTML = "<small>Latitude: "+ lat +" Longitude: "+ lng +"</small>";
});

btn_save_location.addEventListener('click', function(){
    console.log("lat: " + coord.latitude + " lng: " + coord.longitude);
    let formdata = new FormData();
    formdata.append('cemetery_id', cem_id);
    formdata.append('grave_type', document.getElementById('grave-type').value);
    formdata.append('location_description', document.getElementById('location-inp').value);
    formdata.append('status', document.getElementById('status-inp').value);
    formdata.append('price', document.getElementById('price-inp').value);
    formdata.append('column', document.getElementById('row-inp').value);
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


map.on('popupclose', function() {
    let container = document.getElementById('grave-information');
    container.style.display = 'none';
});

function mapInit(){
    L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=8QM9cnYU5pgNqcMDeMwN', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
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
    document.getElementById('status-inp').value = "";
    document.getElementById('price-inp').value = "";
    document.getElementById('row-inp').value = "";
    coord = {};
}

function displayMap(){
    var temp = 0;
    search('map', 1, 100, { cemetery_id: cem_id }, '+created,cemetery_id', '')
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
        console.log('\npointing to\nlat: ' + data.items[0].latitude + '\nlng: ' + data.items[0].longitude + "\n");
        map.setView([data.items[0].latitude, data.items[0].longitude], 19);
    }).catch( function(err){
        console.log(err.message);
    });
}


//.bindPopup() <-- in bind pop up, create a function that receives the grave_id, that returns a string of html content containing grave and deceased info. If we want to load all the markers to the map.
function loadGravePopup(grave_id, description, status, price, row, type){
    // query to db based from id
    const namesOfGraves = {
        'rpwv0bsvnqp4li0': 'Flat grave marker',
        'b6hedzq2godl4q8': 'Upright grave marker',
        'r7u39oriry1pij5': 'Headstone',
        '06qu5rii5ye55wm': 'Footstone',
        'av67hd01wy9ud91': 'Mausoleum',
        '8pc93vz0xt1j4jj': 'Tomb',
        'b087tzicqoehxlw': 'Crypt',
        'rm4446wpn3l6bzu': 'Burial Vault',
        'i4fx09hpcwkumg7': 'Natural Burial'
    };

    return '<div id="popup-grave" class="card" style="width: 19rem;">' +
    '<div class="card-header text-center">' +
        '<p class="card-title"><strong>Grave: </strong>#'+ grave_id +'</p>' +
    '</div>' +
    '<div class="card-body text-center row">' +
        '<div class="col text-right">' +
            '<p class="card-text"><strong>Description: </strong></p>' +
            '<p class="card-text"><strong>Status: </strong></p>' +
            '<p class="card-text"><strong>Type: </strong></p>' +
            '<p class="card-text"><strong>Price: </strong></p>' +
            '<p class="card-text"><strong>Row: </strong></p>' +
        '</div>' +
        '<div class="col text-left">' +
            '<p class="card-text">'+ description +'</p>' +
            '<p class="card-text">'+ status +'</p>' +
            '<p class="card-text">'+ namesOfGraves[type] +'</p>' +
            '<p class="card-text">₱ '+ price +'</p>' +
            '<p class="card-text">'+ row +'</p>' +
        '</div>' +
    '</div>' +
    '<div class="card-footer text-right">' +
        '<button class="btn btn-outline-danger btn-sm" title="Delete grave location." onclick="deleteGrave(\''+ grave_id +'\');"><i class="uil uil-trash"></i> Remove</button>' +
        '<br><small>Click, if you wish to delete this pinned location.</small>' + 
    '</div>' +
'</div>';
}

function loadMarkers(){
    const customMarker = L.icon({ 
        iconUrl: '../assets/pin.png',
        iconSize: [28, 40],
        iconAnchor: [13, 39],
        popupAnchor: [0, -20]
    });

    search('grave', 1, 500, { cemetery_id: cem_id }, '+created,cemetery_id', '')
    .then( function(data){
        graveMarker.clearLayers();
        for(let i = 0; i < data.items.length; i++){
            L.marker([data.items[i].latitude, data.items[i].longitude], {
                icon: customMarker,
                title: 'location: ' + data.items[i].location_description,
                name: data.items[i].id
            }).addTo(graveMarker)
            .bindPopup(loadGravePopup(data.items[i].id, data.items[i].location_description, data.items[i].status, data.items[i].price, data.items[i].column, data.items[i].grave_type))
            .on('click', function(){
                console.log('id: ' + data.items[i].id);
                let container = document.getElementById('grave-information');
                container.style.display = 'block';
                clearGraveForm(false);

                document.getElementById('open-deceased-modal').addEventListener('click', async () => {
                    document.getElementById('d-fname').value = data.items[i].id;
                });
            });
        }
    }).catch( function(e){
        console.log(e.message);
    });
}


function loadGraveTypes(){
    search('grave_type', 1, 100, { id: '' }, '+created,id', '')
    .then( function(data){
        grave_type.innerHTML = "<option value='' disabled selected>Choose type</option>";
        for(let i = 0; i < data.items.length; i++){
            grave_type.innerHTML += "<option value="+ data.items[i].id +">"+ data.items[i].type +"</option>";
        }
        console.log(data.items);
    }).catch( function(err){
        console.log(err.message);
    });
}

function deleteGrave(grave_id){
    if(confirm("Are you sure you want to delete this pinned location?")){
        remove(GRAVE, grave_id).then( function(){
            alert('Grave has been removed.');
            map.closePopup();
            loadMarkers();
        }).catch( function(e){
            console.log(e.message);
        });
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

    create('deceased', form).then( function(data){
        alert('Inserted deceased record');
        console.log(data.id);
        $('#add-deceased').modal('hide');
        clearInput(['d-fname', 'd-lname', 'd-mi', 'cause-of-death', 'memorial', 'dod', 'd-burial', 'dob', 'burial-type', 'gender', 'image-file']);

        //reload the dispay for deceased
    }).catch( function(err){
        console.log(err);
    });

});

function clearInput(id = []){
    for(let i = 0; i < id.length; i++){
        document.getElementById(id[i]).value = "";
    }
}

//We left from this part     |
//                           V
function updateGrave(input = {}, collectionName){
    update(collectionName, input).then( function(){

    }).catch( function(e){
        console.log(e.message);
    });
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

    create('contract', contact).then( function(){
        console.log('Inserted a contact record');
        alert('Inserted a contact record');
        $("#add-contact").modal('hide');
        clearInput(['c-fname', 'c-lname', 'c-mi', 'c-address', 'c-tel']);

        //reload the display for contract
    }).catch( function(err){
        console.log(err.message);
    });
});
