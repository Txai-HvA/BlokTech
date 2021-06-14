let filterButton = document.querySelector("#filterButton");
let filterMenu = document.querySelector("#filterMenu");
let filterDoneButton = document.querySelector("#filterDoneButton");
let descriptionInput = document.querySelector("#description");
let descriptionCounter = document.querySelector("#counter");

// Shows/Hides Filter menu
function toggleFilterMenu() {
    //Toggles .showFilterMenu, which shows the filtermenu coming from the right
    filterMenu.classList.toggle("showFilterMenu");
    filterMenu.scrollIntoView({ behavior: "smooth" });
}

const MAX_CHARS = 400;
// Counts the amount of characters in descriptionInput
function countChars(input) {
	descriptionCounter.innerHTML = input.length + '/' + MAX_CHARS;
}
/* Bron: Attention Required! | Cloudflare. (z.d.). Codepen. Geraadpleegd op 10 juni 2021, van https://codepen.io/borisplotkin/pen/RPwXeK */

filterButton.addEventListener("click", toggleFilterMenu);
filterDoneButton.addEventListener("click", toggleFilterMenu);
descriptionInput.addEventListener("input", countChars);