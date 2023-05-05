const btn_menu = document.querySelector('.menu-btn');
const params = new URLSearchParams(window.location.search);
const cemetery_option = document.getElementById('cemetery');
const btnGraveStatus = document.getElementById('grave-status-btn');
const map = L.map('cem-map');
var graveMarker = L.layerGroup().addTo(map);

mapInit();
getGraveId();
loadCemeteries();


function getGraveId(){
        if(params.get('id') == null || params.get('lat') == null || params.get('lng') == null || params.get('deceased') == null){
                alert('Required parameters are missing.');
                location.href = "../pages/guestSearchDeceased.html";
                return;
        }
        locateByGraveId(params.get('id'), params.get('lat'), params.get('lng'));
}

function mapInit(){
        L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=8QM9cnYU5pgNqcMDeMwN', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 23,
        }).addTo(map);
}


map.on('popupclose', function() {
        let container = document.getElementById('grave-information');
        container.style.display = 'none';
        //loadMarkers();
});

cemetery_option.addEventListener('change', function(){
        document.getElementById('status-div').style.display = 'inline';

        setOrigin(cemetery_option.value);
        loadMarkers(cemetery_option.value);
});

btnGraveStatus.addEventListener('click', function(){
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
        
            search(GRAVE, 1, 1500, { cemetery_id: cemetery_option.value }, '+created,cemetery_id', '')
            .then( function(data){
                graveMarker.clearLayers();
                for(let i = 0; i < data.items.length; i++){
                    L.marker([data.items[i].latitude, data.items[i].longitude], {
                        icon: L.icon(markerStatus[data.items[i].status]),
                        title: 'Status: ' + data.items[i].status
                    }).addTo(graveMarker)
                    .bindPopup(loadGravePopup(data.items[i].location_description, data.items[i].status, data.items[i].price, data.items[i].row, data.items[i].column, data.items[i].grave_type))
                    .on('click', function(){
                        let container = document.getElementById('grave-information');
                        container.style.display = 'block';
                        loadDeceased(data.items[i].deceased_id);
                    });
                }
            }).catch( function(e){
                console.log(e.message);
            });
});

function loadMarkers(cem_id){
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
                .bindPopup(loadGravePopup(data.items[i].location_description, data.items[i].status, data.items[i].price, data.items[i].row ,data.items[i].column, data.items[i].grave_type))
                .on('click', function(){
                    let container = document.getElementById('grave-information');
                    container.style.display = 'block';
                    loadDeceased(data.items[i].deceased_id);
                    //loadContract(data.items[i].contract_id);
                });
            }
        }).catch( function(e){
            console.log(e.message);
        });
    }

function locateByGraveId(graveID, lat, lng){
        const iconPin = L.icon({
            iconUrl: '../assets/find.png',
            iconSize: [28, 40],
            iconAnchor: [13, 39],
            popupAnchor: [0, -20]
        });
    
        search(GRAVE, 1, 1, { id: graveID }, '+created,id', '')
        .then(function(data){
            map.setView([lat, lng], 17);
            L.control.locate().addTo(map);
            graveMarker.clearLayers();
            L.marker([lat, lng], {
                icon: iconPin,
                title: 'Description: ' + data.items[0].location_description
            }).addTo(graveMarker)
            .bindPopup(loadGravePopup(data.items[0].location_description, data.items[0].status, data.items[0].price, data.items[0].row, data.items[0].column, data.items[0].grave_type))
            .on('click', function(){
                let container = document.getElementById('grave-information');
                container.style.display = 'block';
                loadDeceased(data.items[0].deceased_id);
                //loadContract(data.items[0].contract_id);
    
            });
        }).catch(function(e){
            console.log(e.message);
        });
}

function loadGravePopup(description, status, price, row ,column , type){
        // query to db based from id
        const namesOfGraves = {
            'c84dwa0kv72rigw': 'Mausoleum',
            '64b7cxf3lzc6z1w': 'Crypt',
            '4skeawdpwootcda': 'Burial vault',
            'rnnmdhady7w8mko': 'Niche',
            'ja9wep0mm6w308a': 'Tombstone',
            '3qo1syc9icikrtb': 'Family plot'
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
                '<p class="card-text"><strong>Row: </strong></p>' +
                '<p class="card-text"><strong>Column: </strong></p>' +
            '</div>' +
            '<div class="col text-left">' +
                '<p class="card-text">'+ description +'</p>' +
                '<p class="card-text">'+ status + '</p>' +
                '<p class="card-text">'+ namesOfGraves[type] +'</p>' +
                '<p class="card-text">'+ row +'</p>' +
                '<p class="card-text">'+ column + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="card-footer text-right">' +
        '</div>' +
    '</div>';
    }

function loadDeceased(deceased_id){
        //if deceased is found : turn of filter
        if(deceased_id === ""){
            document.getElementById('deceased-info').classList.add('blur-element');
            return;
        }else{
            document.getElementById('deceased-info').classList.remove('blur-element');
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
        location.href = "../pages/guestDeceasedInfo.html";
}

function loadCemeteries(){
        search(CEMETERY, 1, 50, { id: ' ' }, '+created,id', '')
        .then( function(data){
            cemetery_option.innerHTML = '<option value="" selected disabled>Choose Cemetery</option>';
            for(let i = 0; i < data.items.length; i++){
                cemetery_option.innerHTML += '<option value="'+ data.items[i].id +'">'+ data.items[i].name +'</option>';
            }
        }).catch( function(e){
            console.log(e.message);
        });
}

function setOrigin(id){
        //console.log(cemetery_id);
        search(MAP, 1, 1, { cemetery_id: id}, '+created,cemetery_id', '')
        .then( function(data){
                if(data.items.length > 0){
                        map.setView([data.items[0].latitude, data.items[0].longitude], 17);
                }else{
                        alert('Ooops! the location of this cemetery is not found.');
                }
        }).catch( function(e){
                console.log(e.message);
        });
}
