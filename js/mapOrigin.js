const mapOrig = L.map('orig-map').setView([51.505, -0.09], 2);
const btnSave = document.getElementById('btn-save-coord');
var flag1 = false;
var lat;
var lng;
var marker;
var coords;

check_session();

function check_session(){
     if(!isLoggedIn()){
        console.log('Session: not active');
        alert('Invalid access, please sign in');
        window.location.href = '../index.html';
        return;
     }      
     console.log('Session: active');
}

L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=8QM9cnYU5pgNqcMDeMwN', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
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
        if(confirm("Are you sure this is the right location?")){
                if(coords == null){
                        alert('You have not yet picked a location.');
                        return;
                }else{
                        const input_map = {
                                address: document.getElementById('address-input').value,
                                cemetery_id: getSessionAdmin().cemetery_id,
                                latitude: coords.latitude,
                                longitude: coords.longitude
                        };
                        create('map', input_map).then( function(){
                                alert("Map origin has been set, \nclose this window and return to admin page.");
                                window.close();
                                console.log(coords);
                                coords = {};
                        }).catch( function(err){
                                console.log(err.message);
                        });
                }
                
        }else{
                mapOrig.removeLayer(marker);
        }
});

function getAddress(latitude, longitude){
        var addr;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ latitude }&lon=${ longitude }&format=json`, {
                headers: {
                        'User-Agent': 'ID of your APP/service/website/etc. v0.1'
                }
        }).then(res => res.json())
        .then(res => {
                document.getElementById('address-input').value = res.display_name;
        });
}