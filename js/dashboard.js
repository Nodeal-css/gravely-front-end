const col_chart = document.getElementById('col-chart');
const burial_btn = document.getElementById('burial-btn');
const gender_btn = document.getElementById('gender-btn');
const age_btn = document.getElementById('age-btn');
const vacant_btn = document.getElementById('vacant-btn');
const graph_title = document.getElementById('graph-title');



burial_btn.addEventListener('click', function(){
    countBurial();
});

gender_btn.addEventListener('click', function(){
    populateGender();
});

age_btn.addEventListener('click', function(){
    

    populateAge();
});

vacant_btn.addEventListener('click', function(){
    populateGraveStatus();
});

// Count of burials function
function countBurial(){
  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(draw_deceased_count);
  function draw_deceased_count() {
    let data = google.visualization.arrayToDataTable([
      ["Year", "count", { role: "style" } ],
      ["2015", 160, "rgb(220, 108, 75)"],
      ["2016", 85, "rgb(220, 108, 75)"],
      ["2017", 115, "rgb(220, 108, 75)"],
      ["2018", 105, "rgb(220, 108, 75)"],
      ["2019", 98, "rgb(220, 108, 75)"],
      ["2020", 200, "rgb(220, 108, 75)"],
      ["2021", 205, "rgb(220, 108, 75)"],
      ["2022", 196, "rgb(220, 108, 75)"]
    ]);
  drawChart(data);
}
graph_title.innerHTML = '<b>Number of deceased in the cemetery</b>';
}

// Donut chart
function drawDonatChart(data){
    let options = {
        title: '',
        pieHole: 0.4,
      };

      let chart = new google.visualization.PieChart(col_chart);
      chart.draw(data, options);
}


// Line chart
function drawChart(data){
    let view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
          { calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation" }, 2]);

    let options = {
      title: "",
      width: 600,
      height: 300,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    let chart = new google.visualization.ColumnChart(col_chart);
    chart.draw(view, options);
}

countBurial();

function currentCemetery(){
  findMyCemetery().then( function(data){
      window.localStorage.setItem('cemetery-name', data.expand.cemetery_id.name);
      //console.log(data.expand.cemetery_id.name);
  }).catch( function(e){
      console.log(e.message);
  });
}

currentCemetery();

/*
  Methods for populating data to graphs
*/
function populateGender(){
  search(GRAVE, 1, 1500, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,cemetery_id', 'deceased_id,gender')
  .then( function(data){
      //const graves = new Set(convertArray(result[0], false));
      var male = 0;
      var female = 0;
      for(let i = 0; i < data.items.length; i++){
        if(data.items[i].deceased_id != ""){
          male += (data.items[i].expand.deceased_id.gender == 'M') ? 1 : 0 ;
          female += (data.items[i].expand.deceased_id.gender == 'F') ? 1 : 0 ;
        }
      }
      loadGenderToGraph(male, female);
  }).catch(function(e){
    console.log(e.message);
  });
}

function loadGenderToGraph(male, female){
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawDonut);
    function drawDonut() {
      let data = google.visualization.arrayToDataTable([
        ['Gender', 'count'],
        ['Men',     male],
        ['Women',   female]
      ]);
      drawDonatChart(data);
    }
    graph_title.innerHTML = '<b>Ratio of deceased men : women</b>';
}

/* Populate graph for vacant graves */
function populateGraveStatus(){
  search(GRAVE, 1, 1500, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,id', '')
  .then( function(data){
    var vacant = 0;
    var occupied = 0;
    var unavailable = 0;
    var repair = 0;
    for(let i = 0; i < data.items.length; i++){
      vacant += (data.items[i].status === "Vacant") ? 1 : 0 ;
      occupied += (data.items[i].status === "Occupied") ? 1 : 0 ;
      unavailable += (data.items[i].status === "Not available") ? 1 : 0 ;
      repair += (data.items[i].status === "Under repair") ? 1 : 0 ;
    }
    loadGraveStatusToGraph(vacant, occupied, unavailable, repair);
  }).catch( function(e){
    console.log(e.message);
  });
}

function loadGraveStatusToGraph(vacant, occupied, unavailable, repair){
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawDonut);
    function drawDonut() {
      let data = google.visualization.arrayToDataTable([
        ['Status', 'Graves'],
        ['Vacant',    vacant],
        ['Occupied',  occupied],
        ['Unavailable', unavailable],
        ['Under repair', repair]
      ]);
      drawDonatChart(data);
    }
    graph_title.innerHTML = '<b>Ratio of vacant to occupied graves</b>';
}

/** 
 * 
 * Populate age to graph
 * Under 16
  16 to 34
  35 to 54
  55 to 74
  75 years over
*/
function populateAge(){
  search(GRAVE, 1, 1500, { cemetery_id: getSessionAdmin().cemetery_id }, '+created,cemetery_id', 'deceased_id')
  .then( function(data){
    var below16 = 0;
    var above17_34 = 0;
    var above35_54 = 0;
    var above55_74 = 0;
    var over75 = 0;

    for(let i = 0; i < data.items.length; i++){
      if(data.items[i].deceased_id !== ""){
        below16 += (getAge(data.items[i].expand.deceased_id.date_birth) <= 16) ? 1 : 0 ;
        above17_34 += (getAge(data.items[i].expand.deceased_id.date_birth) >= 17 && getAge(data.items[i].expand.deceased_id.date_birth) <= 34) ? 1 : 0 ;
        above35_54 += (getAge(data.items[i].expand.deceased_id.date_birth) >= 35 && getAge(data.items[i].expand.deceased_id.date_birth) <= 54) ? 1 : 0 ;
        above55_74 += (getAge(data.items[i].expand.deceased_id.date_birth) >= 55 && getAge(data.items[i].expand.deceased_id.date_birth) <= 74) ? 1 : 0 ;
        over75 += (getAge(data.items[i].expand.deceased_id.date_birth) >= 75) ? 1 : 0 ;
      }
    }
    loadAgeGraph(below16, above17_34, above35_54, above55_74, over75);
  }).catch( function(e){
    console.log(e.message);
  });
}

function getAge(age){
  const today = new Date();
  const bday = new Date(age);
  return today.getFullYear() - bday.getFullYear();
}


function loadAgeGraph(below16, above17_34, above35_54, above55_74, over75){
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(drawDonut);
    function drawDonut() {
      let data = google.visualization.arrayToDataTable([
        ['Age', 'count'],
        ['Under 16',    below16],
        ['16 to 34',   above17_34],
        ['35 to 54', above35_54],
        ['55 to 74', above55_74],
        ['75 years over', over75]
      ]);
      drawDonatChart(data);
    }
    graph_title.innerHTML = '<b>Deceased age demographic</b>';
}