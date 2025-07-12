// admin.js

const API_GATEWAY_ENDPOINT = 'YOUR_API_GATEWAY_ENDPOINT_HERE'; // IMPORTANT: Replace with your actual API Gateway endpoint

const navButtons = document.querySelectorAll('nav button');
const currentTypeSpan = document.getElementById('current-type');
const addItemBtn = document.getElementById('add-item-btn');
const itemForm = document.getElementById('item-form');
const saveItemBtn = document.getElementById('save-item-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const itemNameInput = document.getElementById('item-name');
const itemDescriptionTextarea = document.getElementById('item-description');
const itemImageURLInput = document.getElementById('item-image-url');
const itemListDiv = document.getElementById('item-list');
const dynamicFieldsDiv = document.getElementById('dynamic-fields');

let currentItemType = 'equipment'; // Default type
let editingItemId = null;

// Function to fetch and display items
async function fetchAndDisplayItems(itemType) {
    try {
        const response = await fetch(`${API_GATEWAY_ENDPOINT}/items/${itemType.toUpperCase()}`);
        const items = await response.json();

        itemListDiv.innerHTML = ''; // Clear previous items
        if (items.length === 0) {
            itemListDiv.innerHTML = '<p>No items found for this category.</p>';
            return;
        }

        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.innerHTML = `
                <div>
                    <h4>${item.name || 'No Name'}</h4>
                    <p>${item.description || 'No Description'}</p>
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="max-width: 100px; max-height: 100px;">` : ''}
                </div>
                <div>
                    <button data-id="${item.SK}" class="edit">Edit</button>
                    <button data-id="${item.SK}" class="delete">Delete</button>
                </div>
            `;
            itemListDiv.appendChild(itemCard);
        });

        // Add event listeners for edit and delete buttons
        itemListDiv.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (e) => editItem(e.target.dataset.id));
        });
        itemListDiv.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (e) => deleteItem(e.target.dataset.id));
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        itemListDiv.innerHTML = '<p>Error loading items.</p>';
    }
}

// Function to show the form for adding/editing
function showItemForm(item = null) {
    itemForm.classList.remove('hidden');
    if (item) {
        editingItemId = item.SK;
        itemNameInput.value = item.name || '';
        itemDescriptionTextarea.value = item.description || '';
        itemImageURLInput.value = item.image_url || '';
        // Populate dynamic fields if any
    } else {
        editingItemId = null;
        itemNameInput.value = '';
        itemDescriptionTextarea.value = '';
        itemImageURLInput.value = '';
        // Clear dynamic fields
    }
}

// Function to hide the form
function hideItemForm() {
    itemForm.classList.add('hidden');
}

// Handle navigation clicks
navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        currentItemType = e.target.dataset.type;
        currentTypeSpan.textContent = currentItemType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        fetchAndDisplayItems(currentItemType);
        hideItemForm();
    });
});

// Handle Add New Item button click
addItemBtn.addEventListener('click', () => showItemForm());

// Handle Cancel button click
cancelEditBtn.addEventListener('click', hideItemForm);

// Handle Save Item form submission
saveItemBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const itemData = {
        name: itemNameInput.value,
        description: itemDescriptionTextarea.value,
        image_url: itemImageURLInput.value,
        // Add dynamic fields here
    };

    try {
        let response;
        if (editingItemId) {
            // Update existing item
            response = await fetch(`${API_GATEWAY_ENDPOINT}/items/${currentItemType.toUpperCase()}/${editingItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });
        } else {
            // Create new item
            response = await fetch(`${API_GATEWAY_ENDPOINT}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item_type: currentItemType, ...itemData })
            });
        }

        if (response.ok) {
            alert('Item saved successfully!');
            hideItemForm();
            fetchAndDisplayItems(currentItemType);
        } else {
            const errorData = await response.json();
            alert(`Error saving item: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error saving item:', error);
        alert('An error occurred while saving the item.');
    }
});

// Function to edit an item
async function editItem(id) {
    try {
        const response = await fetch(`${API_GATEWAY_ENDPOINT}/items/${currentItemType.toUpperCase()}/${id}`);
        const item = await response.json();
        if (response.ok) {
            showItemForm(item);
        } else {
            alert(`Error fetching item for edit: ${item.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching item for edit:', error);
        alert('An error occurred while fetching the item for edit.');
    }
}

// Function to delete an item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    try {
        const response = await fetch(`${API_GATEWAY_ENDPOINT}/items/${currentItemType.toUpperCase()}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Item deleted successfully!');
            fetchAndDisplayItems(currentItemType);
        } else {
            const errorData = await response.json();
            alert(`Error deleting item: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('An error occurred while deleting the item.');
    }
}

// Initial load: display equipment
document.addEventListener('DOMContentLoaded', () => {
    currentTypeSpan.textContent = currentItemType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    fetchAndDisplayItems(currentItemType);
});
