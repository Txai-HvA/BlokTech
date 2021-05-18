let filterButton = document.querySelector("#filterButton");
let filterMenu = document.querySelector("#filterMenu");
let filterDoneButton = document.querySelector("#filterDoneButton");

// let filterGenreInput = document.querySelector("#genreSearch");
// let filterGenreList = document.querySelector("#filterMenu ul:nth-of-type(1)");
// let addGenreButton = document.querySelector("#addGenreButton");

function toggleFilterMenu() {
    filterMenu.classList.toggle("showFilterMenu");
    filterMenu.scrollIntoView({ behavior: "smooth" }); //
}

// function addGenreToFilters(event) {
//     event.preventDefault();
//     let newGenre = filterGenreInput.value;
//     console.log("0-- " + newGenre);

//     let li = document.createElement("li");
//     li.appendChild(document.createTextNode(newGenre));
//     filterGenreList.appendChild(li);
// }

// addGenreButton.addEventListener("click", addGenreToFilters);

filterButton.addEventListener("click", toggleFilterMenu);
filterDoneButton.addEventListener("click", toggleFilterMenu);