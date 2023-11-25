const form = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = form.querySelector('button');
let isEditMode = false;


function onAddItemSubmit(e) {
    
    e.preventDefault();
    const newItem = itemInput.value;

    //validate input
    if (newItem === '') {
        alert("Please add item");
        return;
    }

    //this will retrieve an array of the items in storage, and check if the item already exists.
    //It will also be used farther down to pass the array of items in storage into the addItemToStorage method,
    //so This way only one array is being created and saves on memory. This is a solution to checking if the item exists, 
    //before adding it to the dom and to storage, so the ui will be in sync with storage.
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    if (itemsFromStorage.indexOf(newItem) !=-1) {
        alert("Item already exists");
        return;
    }

    //check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeFromStorage(itemToEdit.textContent);

        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }   

    addItemToDom(newItem);
    addItemtoStorage(newItem, itemsFromStorage);
    checkUI();
    itemInput.value = '';
}

function addItemToDom(item) {

      //create list item
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(item));
  
      const button = createButton('remove-item btn-link text-red');
      li.appendChild(button);
  
      itemList.appendChild(li);
}

function addItemtoStorage(item, itemsFromStorage) {
        //puts new item into array
        itemsFromStorage.push(item);
        console.log("Here");
        //convert to json string and set local storage
        localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
    const button = document.createElement('button');
    const icon = createIcon('fa-solid fa-xmark');
    button.className = classes;
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className=classes;
    return icon;
}

function removeItem(e) {
    //prevents anything from happening if the user manages to click on the list without clicking on an item
    if (e.target.id != 'item-list' ) {
        console.log('works');
        
        if (e.target.parentElement.classList.contains('remove-item')) {
            if (confirm('Are you sure?')) {
                e.target.parentElement.parentElement.remove();
                removeFromStorage(e.target.parentElement.parentElement.textContent);
                checkUI();
            }
        } else {
            setItemToEdit(e.target);
        }
    }
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.style = "background-color: green";
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    itemInput.value = item.textContent;
}


function removeFromStorage(item) {
    //retrieve array of items
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    //remove the item from the array
    itemsFromStorage.splice(itemsFromStorage.indexOf(item), 1);
    //push the new array into storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


function clearItem() {
    itemList.innerHTML='';
    clearStorage();
    checkUI();
}

function clearStorage() {
    //set saved items to empty []
    localStorage.setItem('items', '[]');
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach( item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    })
}

function loadPage() {
    const savedItems = JSON.parse(localStorage.getItem('items'));
    for (let i =0; i<savedItems.length; i++) {
        addItemToDom(savedItems[i]);
    }

}

function checkUI() {
    const items = itemList.querySelectorAll('li');
    if(items.length == 0) {
        clearBtn.style.display = "none";
        filter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        filter.style.display = "block";
    }

    formBtn.style = "background-color: black;"
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    isEditMode = false;
}

//event listeners
form.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearItem);
filter.addEventListener('input', filterItems);

loadPage();
checkUI();
