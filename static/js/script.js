let filterButton = document.querySelector('#filterButton');
let filterMenu = document.querySelector('#filterMenu');
let filterDoneButton = document.querySelector('#filterDoneButton');


function toggleFilterMenu() {
    filterMenu.classList.toggle("showFilterMenu");
    // filterMenu.scrollIntoView({ behavior: 'smooth' }); //
}


filterButton.addEventListener('click', toggleFilterMenu);
filterDoneButton.addEventListener('click', toggleFilterMenu);