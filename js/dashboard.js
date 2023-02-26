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
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawDonut);
    function drawDonut() {
      let data = google.visualization.arrayToDataTable([
        ['Gender', 'count'],
        ['Men',     115],
        ['Women',   201]
      ]);
      drawDonatChart(data);
    }
    graph_title.innerHTML = '<b>Ratio of deceased men : women</b>';
});

age_btn.addEventListener('click', function(){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawDonut);
    function drawDonut() {
      let data = google.visualization.arrayToDataTable([
        ['Age', 'count'],
        ['Under 16',    70],
        ['16 to 34',   75],
        ['35 to 54', 116],
        ['55 to 74', 200],
        ['75 years over', 301]
      ]);
      drawDonatChart(data);
    }
    graph_title.innerHTML = '<b>Deceased age demographic</b>';
});

vacant_btn.addEventListener('click', function(){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawDonut);
    function drawDonut() {
      let data = google.visualization.arrayToDataTable([
        ['Status', 'Graves'],
        ['Vacant',    315],
        ['Occupied',  200]
      ]);
      drawDonatChart(data);
    }
    graph_title.innerHTML = '<b>Ratio of vacant to occupied graves</b>';
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
