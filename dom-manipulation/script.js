// Array to hold quote objects
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" },
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    // Get a random index from the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
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
  
  // Function to add a new quote to the array and DOM
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Check if both fields are filled
    if (newQuoteText && newQuoteCategory) {
      // Add the new quote to the quotes array
      const newQuote = {
        text: newQuoteText,
        category: newQuoteCategory,
      };
      quotes.push(newQuote);
  
      // Clear the input fields after submission
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Optionally, show the new quote immediately (you can remove this part if you want to show it only via random selection)
      showRandomQuote();
    } else {
      alert('Please fill in both the quote and category fields!');
    }
  }
  
  // Function to create the "Add Quote" form dynamically
  function createAddQuoteForm() {
    // Create the form elements
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    
    // Append the form to the body or a specific container
    document.body.appendChild(formContainer);
  }
  
  // Initialize the display by showing a random quote
  document.addEventListener('DOMContentLoaded', () => {
    // Show a random quote initially
    showRandomQuote();
  
    // Call the function to create the "Add Quote" form
    createAddQuoteForm();
  });
  