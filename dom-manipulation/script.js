// Initialize quotes from localStorage, or use an empty array if nothing exists
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();  // Update categories after saving quotes
}

// Function to show a random quote
function showRandomQuote() {
  // Pick a random quote from the array
  const randomIndex = Math.floor(Math.random() * quotes.length); // Generate a random index
  const randomQuote = quotes[randomIndex]; // Get the random quote

  // Display the random quote in the #quoteDisplay div
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    // Create a new quote object and add it to the quotes array
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Clear the input fields
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';

    alert('New quote added!');
  } else {
    alert('Please enter both a quote and a category!');
  }
}

// Function to create the "Add Quote" form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteForm");

  // Create the input fields and button dynamically
  const quoteTextInput = document.createElement("input");
  quoteTextInput.id = "newQuoteText";
  quoteTextInput.type = "text";
  quoteTextInput.placeholder = "Enter a new quote";

  const quoteCategoryInput = document.createElement("input");
  quoteCategoryInput.id = "newQuoteCategory";
  quoteCategoryInput.type = "text";
  quoteCategoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;  // Attach the addQuote function to the button

  // Append the created elements to the form container
  formContainer.innerHTML = ""; // Clear any existing form elements
  formContainer.appendChild(quoteTextInput);
  formContainer.appendChild(quoteCategoryInput);
  formContainer.appendChild(addButton);
}


// Function to add a new quote with a category
function addQuote(quoteText, category) {
  const newQuote = {
    text: quoteText, 
    category: category || 'Uncategorized', // Default category if none provided
    dateAdded: new Date().toISOString()
  };
  quotes.push(newQuote);
  saveQuotes();  // Save quotes array to localStorage
  displayQuotes();  // Update the UI to reflect the new quote
}

// Function to display quotes based on selected category
function displayQuotes(categoryFilter = 'all') {
  const quotesContainer = document.getElementById('quotesContainer');
  quotesContainer.innerHTML = ''; // Clear existing quotes

  // Filter quotes based on the selected category
  const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter);

  // Use map() to display each filtered quote in the DOM
  filteredQuotes.map(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `"${quote.text}" - ${quote.category} - Added on ${quote.dateAdded}`;
    quotesContainer.appendChild(quoteElement);
  });
}

// Function to populate the category dropdown dynamically from the quotes
function populateCategories() {
  const categories = new Set(quotes.map(quote => quote.category));  // Use map() to extract unique categories

  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Reset categories

  // Use map() to create options for each category and append to the dropdown
  Array.from(categories).map(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected filter from localStorage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }

  // Trigger filterQuotes to apply the last selected filter
  filterQuotes();
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', selectedCategory);  // Save the selected category to localStorage
  displayQuotes(selectedCategory);  // Display quotes based on the selected category
}

// Function to display a random quote from the quotes array
function displayRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length); // Generate a random index
  const randomQuote = quotes[randomIndex]; // Get the random quote

  const quoteDisplay = document.getElementById('quoteDisplay'); // The element where random quote will be shown
  quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category} - Added on ${randomQuote.dateAdded}`;
}

// Function to export quotes to a JSON file
function exportToJson() {
  const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(jsonBlob);
  downloadLink.download = 'quotes.json';
  downloadLink.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();  // Save updated quotes array to localStorage
        displayQuotes();  // Update UI with imported quotes
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (e) {
      alert('Error importing quotes.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the app
populateCategories();  // Populate the category filter dropdown
displayQuotes();  // Display all quotes initially

// Adding event listener for displaying a random quote when button is clicked
const randomQuoteButton = document.getElementById('randomQuoteButton');
if (randomQuoteButton) {
  randomQuoteButton.addEventListener('click', displayRandomQuote);
}

// Simulating server URL (using JSONPlaceholder for demo)
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to simulate fetching quotes data from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes.map(quote => ({
      id: quote.id,
      text: quote.title,  // Using 'title' as the quote text for demo
      category: 'Uncategorized'  // Placeholder for category (JSONPlaceholder doesn't have category)
    }));
  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
}

// Function to sync local data with the server (check for changes)
async function syncData() {
  const serverQuotes = await fetchQuotesFromServer();  // Fetch quotes from server

  // Compare local quotes with server quotes and resolve conflicts
  serverQuotes.forEach(serverQuote => {
    const localQuoteIndex = quotes.findIndex(localQuote => localQuote.id === serverQuote.id);

    if (localQuoteIndex === -1) {
      // If the quote doesn't exist locally, add it
      quotes.push(serverQuote);
    } else if (quotes[localQuoteIndex].text !== serverQuote.text) {
      // If there is a conflict (different text), resolve it by using the server's data
      quotes[localQuoteIndex] = serverQuote;
      displayConflictResolvedMessage(serverQuote.id);  // Show message to the user
    }
  });

  // Optionally, you can post any changes to the server here (e.g., new quotes added)
  await postLocalChangesToServer();
}

// Function to post local changes to the server
async function postLocalChangesToServer() {
  quotes.forEach(async (quote) => {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    const postedQuote = await response.json();
    console.log('Posted quote to server:', postedQuote);
  });
}

// Function to display a conflict resolution message to the user
function displayConflictResolvedMessage(quoteId) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = `Conflict resolved: Quote with ID ${quoteId} updated from the server's version.`;
  messageElement.style.color = "red";
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { 
      id: quotes.length + 1,  // Generate new ID
      text: newQuoteText, 
      category: newQuoteCategory 
    };
    quotes.push(newQuote);
    showRandomQuote();  // Show new quote
    alert('New quote added!');
  } else {
    alert('Please enter both a quote and a category!');
  }
}

// Sync data periodically (every 10 seconds for this example)
setInterval(syncData, 10000);  // Sync data every 10 seconds

// Initialize the page
function init() {
  // Display a random quote on page load
  showRandomQuote();

  // Setup a periodic check for syncing data with the server
  syncData();  // Initial data sync on page load
}

// Run the initialization function on page load
window.onload = init;

// Function to synchronize local quotes with server quotes and handle conflicts
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();  // Fetch quotes from the server
// Compare local quotes with server quotes and resolve conflicts
serverQuotes.forEach(serverQuote => {
  const localQuoteIndex = quotes.findIndex(localQuote => localQuote.id === serverQuote.id);

  if (localQuoteIndex === -1) {
    // If the quote doesn't exist locally, add it
    quotes.push(serverQuote);
  } else if (quotes[localQuoteIndex].text !== serverQuote.text) {
    // If there is a conflict (different text), resolve it by using the server's data
    quotes[localQuoteIndex] = serverQuote;
    displayConflictResolvedMessage(serverQuote.id);  // Show message to the user
  }
});

// Optionally, you can post any changes to the server here (e.g., new quotes added)
await postLocalChangesToServer();
}

// Display sync success message
displaySyncMessage(); // Show "Quotes synced with server!" message


// Function to display a sync success message
function displaySyncMessage() {
  const messageElement = document.getElementById("message");
  messageElement.textContent = "Quotes synced with server!";
  messageElement.style.color = "green";  // Green text to indicate success
  setTimeout(() => {
    messageElement.textContent = ""; // Clear the message after 5 seconds
  }, 5000);
}