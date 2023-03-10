const btn_menu = document.querySelector('.menu-btn');
const map_origin_picker = document.getElementById('new-window-map');
const btn_save_location = document.getElementById('btn-save-coord'); // we left here
const grave_form = document.getElementById('grave-form');
const cem_id = getSessionAdmin().cemetery_id;

var map = L.map('cem-map');
var flag1 = false;
var lat;
var lng;
var marker;
var coord;

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

document.getElementById('cem-map').addEventListener('contextmenu', function(event){
    event.preventDefault();
    let lat_txt = document.getElementById('lat-txt');
    let lng_txt = document.getElementById('lng-txt');

    if(marker != null){
        map.removeLayer(marker);
    }
    marker = new L.marker([lat, lng]).addTo(map);
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


