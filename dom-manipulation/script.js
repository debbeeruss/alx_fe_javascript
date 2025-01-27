// Initialize quotes array with values from localStorage (if available)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" },
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    // Get a random index from the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    // Store the last viewed quote in sessionStorage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  
    // Create elements to display the quote
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${randomQuote.text}"`;
  
    const quoteCategory = document.createElement('small');
    quoteCategory.textContent = `— Category: ${randomQuote.category}`;
  
    // Clear previous content and display the new random quote
    const quoteContainer = document.getElementById('quote-container');
    quoteContainer.innerHTML = ''; // Clear existing content
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
  }
  
  // Function to add a new quote to the array and update localStorage
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Check if both fields are filled
    if (newQuoteText && newQuoteCategory) {
      const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory,
      };
  
      // Add the new quote to the quotes array and update localStorage
      quotes.push(newQuote);
      saveQuotes();
  
      // Clear the input fields after submission
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Optionally, show the new quote immediately
      showRandomQuote();
    } else {
      alert('Please fill in both the quote and category fields!');
    }
  }
  
  // Function to save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to create the "Add Quote" form dynamically
  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
  }
  
  // Function to export quotes to a JSON file
  function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quotes.json';
    link.click();
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
          showRandomQuote(); // Display the latest random quote
        } else {
          alert('Invalid JSON format. Please check the file.');
        }
      } catch (error) {
        alert('Error parsing JSON file. Please try again.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Initialize the display by showing a random quote
  document.addEventListener('DOMContentLoaded', () => {
    // Show a random quote initially
    showRandomQuote();
  
    // Create the "Add Quote" form dynamically
    createAddQuoteForm();
  
    // Create Export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Quotes to JSON';
    exportButton.onclick = exportToJson;
    document.body.appendChild(exportButton);
  
    // Create Import file input
    const importFileInput = document.createElement('input');
    importFileInput.type = 'file';
    importFileInput.id = 'importFile';
    importFileInput.accept = '.json';
    importFileInput.addEventListener('change', importFromJsonFile);
    document.body.appendChild(importFileInput);
  });
  
  