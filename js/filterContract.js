document.getElementById('filter-all').addEventListener('click', function(){
    page = 1;
    getFindInputs(page);
    removeActive('filter-all');
});
document.getElementById('filter-5years').addEventListener('click', function(){
    let elements = document.querySelectorAll('[data-group="exceedYears"]');
    elements.forEach(element => {
        element.classList.add('table-info');
    });
    removeActive('filter-5years');
});

function removeActive(except){
    const id = ['filter-all', 'filter-5years'];
    for(let i = 0; i < id.length; i++){
        if(except !== id[i]){
            document.getElementById(id[i]).classList.remove('active');
        }
    }
}