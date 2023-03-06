const mapOrig = L.map('orig-map').setView([51.505, -0.09], 2);
const btnSave = document.getElementById('btn-save-coord');
var flag1 = false;
var lat;
var lng;
var marker;
var coords;

check_session();
getSessionAdmin();

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
     coordinates.innerHTML = "<small>Lat: "+ lat.toFixed(3) +" Lng: "+ lng.toFixed(3) +"</small>";

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
});

btnSave.addEventListener('click', function(){
        /*save lat, lng to db
        check if coords is not empty first
        create('map', coords).then( function(){

        }).catch(function(err){
                console.log(err.message);
        });*/
        if(confirm("Are you sure this is the right location?")){
                //statement
        }else{
                mapOrig.removeLayer(marker);
        }
        console.log(coords);
        coords = {};
});
