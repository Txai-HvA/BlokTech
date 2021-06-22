const firstNameInput = document.querySelector('#firstName')
const lastNameInput = document.querySelector('#lastName')
const emailInput = document.querySelector('#email')
const emailValidatorText = document.querySelector('#emailValidator')
const descriptionInput = document.querySelector('#description')
const descriptionCounter = document.querySelector('#counter')

const badWordInputs = [firstNameInput, lastNameInput, descriptionInput]

const badWords = ['fuck', 'shit', 'cunt']
const MAX_CHARS = 400

// Counts the amount of characters in descriptionInput
const charCounter = () => {
    descriptionCounter.textContent = `${descriptionInput.value.length}/${MAX_CHARS}`
    /* Bron: Creating a Characters Remaining Counter (for Text Areas) - JavaScript Tutorial. 
    (2018, 17 juni). YouTube. https://www.youtube.com/watch?v=X-LVkU95jLU */
}

const badWordFilter = () => {
    // Check for bad words
    badWords.forEach((badWord) => {
        badWordInputs.forEach((input) => {
            if (input.value.includes(badWord)) {
                alert(`You can't use the word ${badWord}`)
                // Removes the last word
                input.value = input.value.slice(0, -badWord.length)
            }
        })
    })
}

// Checks if the value in the input is an email address
const emailValidator = () => {
    const regex =
        /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const isEmailValid = regex.test(String(emailInput.value).toLowerCase())

    if (isEmailValid) {
        emailValidatorText.textContent = ''
    } else {
        emailValidatorText.textContent = 'Please use a valid email address.'
    }
    /* Bron: How to Validate Email Address in JavaScript. (2020, 13 februari). CodeSpot. https://www.codespot.org/javascript-email-validation/ */
}

descriptionInput.addEventListener('input', charCounter)
emailInput.addEventListener('input', emailValidator)
descriptionInput.addEventListener('input', badWordFilter)
firstNameInput.addEventListener('input', badWordFilter)
lastNameInput.addEventListener('input', badWordFilter)
