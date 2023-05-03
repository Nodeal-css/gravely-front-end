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
    filterInput = 'M';
    getFindInputs(page);
    removeActive('filter-male');
});
document.getElementById('filter-female').addEventListener('click', function(){
    page = 1;
    filterField = "gender";
    filterInput = 'F';
    getFindInputs(page);
    removeActive('filter-female');
});
document.getElementById('filter-burial-date').addEventListener('click', function(){
    page = 1;
    filterField = "date_burial";
    filterInput = '';
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
document.getElementById('filter-cremation').addEventListener('click', function(){
    page = 1;
    filterField = "burial_type_id";
    filterInput = 'yfr3d0hrq4cr7np';
    getFindInputs(page);
    removeActive('filter-cremation');
});
document.getElementById('filter-muslim-burial').addEventListener('click', function(){
    page = 1;
    filterField = "burial_type_id";
    filterInput = 'jrwvfbropifz3n2';
    getFindInputs(page);
    removeActive('filter-muslim-burial');
});
document.getElementById('filter-natural-burial').addEventListener('click', function(){
    page = 1;
    filterField = "burial_type_id";
    filterInput = '2bm4m8nfsdjn8dl';
    getFindInputs(page);
    removeActive('filter-natural-burial');
});
document.getElementById('exhumate').addEventListener('click', function(){
    page = 1;
    const thisMonth = new Date();
    filterField = 'date_burial';
    filterInput = parseInt(thisMonth.getFullYear() - 5) + '-' + parseInt(thisMonth.getMonth() + 1).toString().padStart(2, '0');
    getFindInputs(page);
    removeActive('exhumate');
});
document.getElementById('filter-5-years').addEventListener('click', function(){
    let elements = document.querySelectorAll('[data-group="exceedYears"]');
    elements.forEach(element => {
        element.classList.add('table-info');
    });
    removeActive('filter-5-years');
});

function removeActive(except){
    const id = ['filter-all', 'filter-male', 'exhumate', 'filter-female', 'filter-burial-date', 'filter-above-ground', 'filter-in-ground', 'filter-cremation', 'filter-muslim-burial', 'filter-natural-burial', 'filter-5-years'];
    for(let i = 0; i < id.length; i++){
        if(except !== id[i]){
            document.getElementById(id[i]).classList.remove('active');
        }
    }
}