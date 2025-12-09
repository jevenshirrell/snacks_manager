const list = document.getElementById('list')
const listInput = document.getElementById('listInput')
const shoppingList = document.getElementById('shoppingList')
const categoryDropdown = document.getElementById('categories')
const snacksLabel = document.getElementById('allSnacks')
const indexSelector = document.getElementById('getIndex')
const indexLabel = document.getElementById('indexLabel')

const addName = document.getElementById('newName')
const addPrice = document.getElementById('newPrice')
const addCategory = document.getElementById('newCategory')
const addStock = document.getElementById('newStock')

// blank obj: {name: "", category: "", price: 0.00, inStock: true}
let snacks = [
    { name: "Classic Potato Chips", category: "Chips", price: 2.49, inStock: true },
    { name: "Cheddar Popcorn", category: "Popcorn", price: 3.29, inStock: true },
    { name: "Salted Pretzels", category: "Pretzels", price: 1.99, inStock: false },
    { name: "Chocolate Chip Cookies", category: "Cookies", price: 4.59, inStock: true },
    { name: "Granola Bar", category: "Bars", price: 1.29, inStock: true },
    { name: "Beef Jerky", category: "Jerky", price: 5.99, inStock: false },
    { name: "Gummy Bears", category: "Candy", price: 2.79, inStock: true },
    { name: "Dark Chocolate Bar", category: "Candy", price: 3.49, inStock: true }
]

let showOut = false


// BASE FUNCTIONS
// adds item to end of array
function addSnack(name, cat, price, stock) {
    snacks.push({name: name, category: cat, price: price, inStock: stock})
}

// deletes item idx
function deleteSnack(idx) {
    snacks.splice(idx, 1)
}

// changes inStock value of item idx
function updateStock(idx) {
    snacks[idx].inStock = !snacks[idx].inStock
}

// gets the first index of item with name
function getIdxOfSnack(name) {
    return snacks.findIndex((element) => element.name === name)
}

// sorts snacks alphabetically
function sortABC() {
    snacks.sort(function (a, b) {
        if (a.name > b.name) {
            return 1
        }
        if (a.name < b.name) {
            return -1
        }
        return 0
    })
    updateList()
}

// sorts snack by price low to high
function sortPrice() {
    snacks.sort((a, b) => a.price - b.price)
    updateList()
}

// return string of every snack's name
function getAllNames() {
    let arr = []
    for (let i of snacks) {
        arr.push(i.name)
    }
    return arr.join(', ')
}

// takes an input of comma seperated list and return an array with each item
function getInputList(input) {
    let arr = input.split(',')

    for (let i = 0; i < arr.length; i++) {
        let letters = arr[i].split('')
        
        // removes spaces from beginning/end
        if (letters[0] == ' ') {
            letters.shift()
        }
        if (letters[letters.length - 1] == ' ') {
            letters.pop()
        }
        
        arr[i] = letters.join('')
    }

    return arr
}


// TESTS
// adds protein bar
addSnack('Protein Bar', 'Bars', 1.99, true)
console.log('Add: ', snacks)
// deletes protein bar by getting its index from its name
deleteSnack(getIdxOfSnack('Protein Bar'))
console.log('Remove: ', snacks)
// puts cookies out of stock with same method
updateStock(getIdxOfSnack('Chocolate Chip Cookies'), false)
console.log('Update: ', snacks)
// sort alphabetically
sortABC()
console.log('ABC sort: ', snacks)
// sort by price
sortPrice()
console.log('Price sort: ', snacks)
// prints all snack names
console.log('Names: ', getAllNames())
// gets input list and return array
console.log('Input: ', getInputList('Cookie, Protein Bar, Chips'))


// WEBSITE FUNCTIONS
// uses a variable to show/hide out of stock items
function changeStockView() {
    showOut = !showOut
    updateList()
}

// update shopping list based on input
function updateShoppingList() {
    let arr = getInputList(listInput.value)
    for (let i of arr) {
        const newItem = document.createElement('li')
            newItem.textContent = i
            // crosses off shopping list item when clicked
            newItem.addEventListener('mousedown',(e) => {
                // console.log(newItem.style.textDecoration)
                if (newItem.style.textDecoration === 'line-through 3px') {
                    newItem.style.textDecoration = 'none'
                    newItem.style.color = 'var(--text)'
                } else {
                    newItem.style.textDecoration = 'line-through 3px'
                    newItem.style.color = 'var(--card)'
                }
            })
            shoppingList.appendChild(newItem)
    }

    // clear input
    listInput.value = ''
}

// resets list and adds new items
function updateList() {
    // console.log(list.children)
    while (list.firstChild) {
        list.firstChild.remove()
    }
    for (let i of snacks) {
        if (categoryDropdown.value !== 'Category:') {
            if (categoryDropdown.value == i.category && (i.inStock || showOut)) {
                const newItem = document.createElement('li')
                newItem.textContent = `${i.name} - $${i.price}`
                if (!i.inStock) {
                    newItem.style.color = "var(--panel)"
                    newItem.textContent += " (Out of stock)"
                }
                list.appendChild(newItem)
                }
        } else if ((i.inStock || showOut)) {
            const newItem = document.createElement('li')
            newItem.textContent = `${i.name} - $${i.price}`
            if (!i.inStock) {
                newItem.style.color = "var(--panel)"
                newItem.textContent += " (Out of stock)"
            }
            list.appendChild(newItem)
        }
    }

    updateIndexDropdown()
    snacksLabel.innerHTML = 'All Snacks: ' + getAllNames()
}

// updates the dropdown based on items in arr
function updateDropdown(element, arr, mainOpt) {
    while (element.firstChild) {
        element.firstChild.remove()
    }
    let cats = []
    for (let i of arr) {
        if (!cats.includes(i)) {
            cats.push(i)
        }
    }
    let mainOption = document.createElement('option')
    mainOption.value = mainOpt
    mainOption.innerHTML = mainOpt
    element.appendChild(mainOption)
    // console.log(cats)
    for (let i of cats) {
        let newCat = document.createElement('option')
        newCat.value = i
        newCat.innerHTML = i
        element.appendChild(newCat)
    }
}
categoryDropdown.addEventListener('change', (e) => {
    updateList()
})

// adds categories into dropdown
function updateCats() {
    let arr = []
    snacks.forEach(el => arr.push(el.category))
    updateDropdown(categoryDropdown, arr, 'Category:')
}


// functions for options panel
// add snack using input and above function
function addSnackFromInput() {
    if (addName.value && addPrice.value && addCategory.value) {
        addSnack(addName.value, addCategory.value, addPrice.value, addStock.checked)
    } else {
        alert('Please input all fields')
    }
    updateList()
    updateCats()
}

// updates dropdown
function updateIndexDropdown() {
    let arr = []
    snacks.forEach(el => arr.push(el.name))
    updateDropdown(indexSelector, arr, 'Choose a snack')
}
// removes chosen snack
function removeChosenSnack() {
    if (indexSelector.value != 'Choose a snack') {
        deleteSnack(getIdxOfSnack(indexSelector.value))
        updateList()
    }
}
// changes stock of chosen snack
function changeStock() {
    if (indexSelector.value != 'Choose a snack') {
        updateStock(getIdxOfSnack(indexSelector.value))
        updateList()
    }
}
// shows index of chosen snack
function updateIndex() {
    if (indexSelector.value != 'Choose a snack') {
        indexLabel.innerHTML = 'Index: ' + getIdxOfSnack(indexSelector.value)
    }
}


updateCats()
updateList()