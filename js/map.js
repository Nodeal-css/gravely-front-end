const btn_menu = document.querySelector('.menu-btn');
const map_origin_picker = document.getElementById('new-window-map');
const btn_save_location = document.getElementById('btn-save-coord'); // we left here
const grave_form = document.getElementById('grave-form');
const cem_id = getSessionAdmin().cemetery_id;

var map = L.map('cem-map', {
    minZoom: 0
});
var flag1 = false;
var lat;
var lng;
var marker;
var coord;

var graves = []; //temporary store coords. will extract coords from database

const customMarker = L.icon({ 
    iconUrl: '../assets/pin.png',
    iconSize: [28, 40],
    iconAnchor: [13, 39],
    popupAnchor: [0, -20]
});

L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=8QM9cnYU5pgNqcMDeMwN', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

displayMap();

//transfer this script to js file
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
    graves.push({
        lat: coord.latitude,
        lng: coord.longitude
    });
    console.log(graves);
    loadMarkers();
    clearGraveForm();
});

document.getElementById('cem-map').addEventListener('contextmenu', function(event){
    event.preventDefault();
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
    lat_txt.value = lat;
    lng_txt.value = lng;
});

function clearGraveForm(){
    grave_form.style.animation = "hide_form 0.8s";
    grave_form.style.position = "fixed";
    grave_form.style.right = "-300px";
    map.removeLayer(marker);
    document.getElementById('lat-txt').value = "";
    document.getElementById('lng-txt').value = "";
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
    focusOrigin();
    if(istrue){
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
function loadGravePopup(grave_id){
    // query to db based from id
    return '<div id="popup-deceased" class="card" style="width: 19rem; display: none;">' +
    '<img class="card-img-top" src="../assets/grave-img.jpg" alt="Card image cap" style="height: 9rem;">' +
    '<div class="card-body">' +
        '<h5 class="card-title">Your name</h5>' +
        '<p class="card-text"><small>Memorial... rest in peace, in loving memory of</small></p>' +
    '</div>' +
    '<ul class="list-group list-group-flush">' +
        '<li class="list-group-item"><small>Field1</small></li>' +
        '<li class="list-group-item"><small>Field2</small></li>' +
        '<li class="list-group-item"><a href="#" title="Click to view more deceased information.">more..</a></li>' +
    '</ul>' +
    '<div class="card-body text-center">' +
        '<button class="btn btn-outline-primary btn-sm" title="Click to view more contract information." onclick="document.querySelector(\'#popup-contract\').style.display=\'block\';document.querySelector(\'#popup-deceased\').style.display=\'none\';">Contract</button>' +
        '<button class="btn btn-outline-success btn-sm" title="Click to view grave details." onclick="document.querySelector(\'#popup-grave\').style.display=\'block\';document.querySelector(\'#popup-deceased\').style.display=\'none\'">Grave</button>' +
        '<button class="btn btn-outline-danger btn-sm" title="This will remove the deceased record of this specified location.">Remove</button>' +
    '</div>' +
'</div>' +
'<div id="popup-grave" class="card" style="width: 19rem;">' +
    '<div class="card-header text-center">' +
        '<p class="card-title">Grave: #23</p>' +
    '</div>' +
    '<div class="card-body text-center row">' +
        '<div class="col text-right">' +
            '<p class="card-text">Field1: </p>' +
            '<p class="card-text">Field2: </p>' +
            '<p class="card-text">Field3: </p>' +
        '</div>' +
        '<div class="col text-left">' +
            '<p class="card-text">info1: </p>' +
            '<p class="card-text">info2: </p>' +
            '<p class="card-text">info3: </p>' +
        '</div>' +
    '</div>' +
    '<div class="card-footer text-center">' +
        '<button class="btn btn-outline-primary btn-sm" title="Insert a deceased record to this specific location." onclick="document.querySelector(\'#popup-deceased\').style.display=\'block\';document.querySelector(\'#popup-grave\').style.display=\'none\';"><i class="uil uil-plus-circle"></i> Deceased</button>' +
        '<button class="btn btn-outline-success btn-sm" title="Insert a contract record for this specific location." onclick="document.querySelector(\'#popup-contract\').style.display=\'block\';document.querySelector(\'#popup-grave\').style.display=\'none\';"><i class="uil uil-plus-circle"></i> Contract</button>' +
        '<button class="btn btn-outline-danger btn-sm" title="Delete grave location."><i class="uil uil-trash"></i> Remove</button>' +
    '</div>' +
'</div>' +
'<div id="popup-contract" class="card" style="width: 19rem; display: none;">' +
    '<div class="card-header">' +
        '<p>Contract</p>' +
    '</div>' +
    '<ul class="list-group list-group-flush">' +
        '<li class="list-group-item">Field1: </li>' +
        '<li class="list-group-item">Field2: </li>' +
        '<li class="list-group-item">Field3: </li>' +
        '<li class="list-group-item">Field4:</li>' +
    '</ul>' +
    '<div class="card-body text-center">' +
        '<button class="btn btn-outline-primary btn-sm" title="View deceased record of this location." onclick="document.querySelector(\'#popup-deceased\').style.display=\'block\';document.querySelector(\'#popup-contract\').style.display=\'none\';">Deceased</button>' +
        '<button class="btn btn-outline-success btn-sm" title="View grave info." onclick="document.querySelector(\'#popup-grave\').style.display=\'block\';document.querySelector(\'#popup-contract\').style.display=\'none\';">Grave</button>' +
        '<button class="btn btn-outline-danger btn-sm" title="Remove Contract record of this specific location.">Remove</button>' +
    '</div>' +
'</div>';
}

function loadMarkers(){
    if(customMarker != null){
        map.removeLayer(customMarker);
    }
    for(let i = 0; i < graves.length; i++){
        L.marker([graves[i].lat, graves[i].lng], {
            icon: customMarker,
            title: 'id: ' + i,
        }).addTo(map).bindPopup(loadGravePopup(i));
    }
}
