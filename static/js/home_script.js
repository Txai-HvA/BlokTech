let filterButton = document.querySelector('#filterButton')
let filterMenu = document.querySelector('#filterMenu')

// // Shows/Hides Filter menu
filterButton.addEventListener('click', () => {
    if (filterMenu.classList.contains('showFilterMenu')) {
        filterMenu.classList.remove('showFilterMenu')
    } else {
        filterMenu.classList.add('showFilterMenu')
    }
    filterMenu.scrollIntoView({ behavior: 'smooth' })
})
