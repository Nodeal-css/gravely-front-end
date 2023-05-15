const mapOrig = L.map('orig-map');
const btnSave = document.getElementById('btn-save-coord');
const params = new URLSearchParams(window.location.search);
var flag1 = false;
var lat;
var lng;
var marker;
var coords;

check_session();
pointCoordinates()


function check_session(){
     if(!isLoggedIn()){
        console.log('Session: not active');
        alert('Invalid access, please sign in');
        window.location.href = '../index.html';
        return;
     }      
     console.log('Session: active');
}


function pointCoordinates(){
    var lat = params.get('lat');
    var lng = params.get('lng');

    console.log('Collection: ' + params.get('collection'));
    mapOrig.setView([lat, lng], 17);
    const iconPin = L.icon({
        iconUrl: '../assets/find.png',
        iconSize: [28, 40],
        iconAnchor: [13, 39],
        popupAnchor: [0, -20]
    });
    L.marker([lat, lng], {
        icon: iconPin,
        title: 'Current location'
    }).addTo(mapOrig);
}

L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=8QM9cnYU5pgNqcMDeMwN', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 23,
}).addTo(mapOrig);

mapOrig.addEventListener('mousemove', function(e){
     let coordinates = document.getElementById('coordinates-display');
     lat = e.latlng.lat;
     lng = e.latlng.lng;
     coordinates.innerHTML = "<small>Lat: "+ lat.toFixed(2) +"<br>Lng: "+ lng.toFixed(2) +"</small>";

});

document.getElementById('orig-map').addEventListener('contextmenu', function(event){
        event.preventDefault();
        if(marker != null){
                mapOrig.removeLayer(marker);
        }
        marker = new L.marker([lat, lng]).addTo(mapOrig);
        coords = {
                "latitude": lat,
                "longitude": lng
        };
        getAddress(lat, lng);
        console.log('lat: ' + lat + "\nlng: " + lng);
});


btnSave.addEventListener('click', function(){
        const collection = params.get('collection');
        const rec_id = params.get('id');
        if(confirm("Are you sure this is the right location?")){
                if(coords == null){
                    alert('You have not picked a new location.');
                    return;
                }
                if(collection == 'grave'){
                        const input_grave = {
                                id: rec_id,
                                latitude: coords.latitude,
                                longitude: coords.longitude
                        }
                        update(collection, input_grave).then( function(){
                                alert("New grave location has been set, \nclose this window and return to admin page.");
                                window.close();
                                console.log(coords);
                                coords = {};
                        }).catch( function(err){
                                console.log(err.message);
                        });
                }
                if(collection == 'map'){
                        const input = {
                                id: rec_id,
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                address: document.getElementById('address-input').value
                        }
                        update(collection, input).then( function(){
                                alert('New cemetery location has been set, \nclose this window and refresh the admin page.');
                                window.close();
                                coords = {};
                        }).catch( function(e){
                                console.log(e.message);
                        })
                }
        }else{
                mapOrig.removeLayer(marker);
        }
});

function getAddress(latitude, longitude){
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ latitude }&lon=${ longitude }&format=json`, {
                headers: {
                        'User-Agent': 'ID of your APP/service/website/etc. v0.1'
                }
        }).then(res => res.json())
        .then(res => {
                document.getElementById('address-input').value = res.display_name;
        });
}