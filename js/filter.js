//Filter functionality
document.getElementById('filter-all').addEventListener('click', function(){
    page = 1;
    filterField = "burial_type_id";
    filterInput = ' ';
    getFindInputs(page);
    removeActive('filter-all');

});
document.getElementById('filter-male').addEventListener('click', function(){
    page = 1;
    filterField = "gender";
    filterInput = 'Male';
    getFindInputs(page);
    removeActive('filter-male');
});
document.getElementById('filter-female').addEventListener('click', function(){
    page = 1;
    filterField = "gender";
    filterInput = 'Female';
    getFindInputs(page);
    removeActive('filter-female');
});
document.getElementById('filter-burial-date').addEventListener('click', function(){
    page = 1;
    filterField = "date_burial";
    filterInput = ' ';
    getFindInputs(page);
    removeActive('filter-burial-date');
});
document.getElementById('filter-above-ground').addEventListener('click', function(){
    page = 1;
    filterField = "burial_type_id";
    filterInput = 'pzcou9z7i198uhf';
    getFindInputs(page);
    removeActive('filter-above-ground');
});
document.getElementById('filter-in-ground').addEventListener('click', function(){
    page = 1;
    filterField = "burial_type_id";
    filterInput = '3gk7c2h67lhgbzr';
    getFindInputs(page);
    removeActive('filter-in-ground');
});

function removeActive(except){
    const id = ['filter-all', 'filter-male', 'filter-female', 'filter-burial-date', 'filter-above-ground', 'filter-in-ground'];
    for(let i = 0; i < id.length; i++){
        if(except !== id[i]){
            document.getElementById(id[i]).classList.remove('active');
        }
    }
}