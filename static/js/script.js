let filterButton = document.querySelector('#filterButton');
let filterMenu = document.querySelector('#filterMenu');
let filterDoneButton = document.querySelector('#filterDoneButton');


function toggleFilterMenu() {
    console.log("click click");
    filterMenu.classList.toggle('show');
}


filterButton.addEventListener('click', toggleFilterMenu);
filterDoneButton.addEventListener('click', toggleFilterMenu);