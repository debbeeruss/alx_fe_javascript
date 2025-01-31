let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();  // Update categories after saving quotes
}

// Function to add a new quote
function addQuote(quoteText, category) {
  const newQuote = { text: quoteText, category: category, dateAdded: new Date().toISOString() };
  quotes.push(newQuote);
  saveQuotes();  // Save quotes array to localStorage
  displayQuotes();  // Update the UI
}

// Function to display quotes on the page
function displayQuotes(categoryFilter = 'all') {
  const quotesContainer = document.getElementById('quotesContainer');
  quotesContainer.innerHTML = ''; // Clear existing quotes

  const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter);

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `"${quote.text}" - ${quote.category} - Added on ${quote.dateAdded}`;
    quotesContainer.appendChild(quoteElement);
  });
}

// Function to populate categories dynamically
function populateCategories() {
  const categories = new Set();
  quotes.forEach(quote => categories.add(quote.category));

  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Reset categories

  categories.forEach(category => {
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
  displayQuotes(selectedCategory);  // Display quotes based on selected category
}

// Function to export quotes to JSON
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
        displayQuotes();  // Update UI
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
