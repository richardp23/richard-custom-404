import programmingJokes from './jokes';

interface Joke {
  setup: string;
  punchline: string;
}

/**
 * Displays a random joke from the programmingJokes array
 */
function displayRandomJoke(): void {
  const jokeIndex: number = Math.floor(Math.random() * programmingJokes.length);
  const joke: Joke = programmingJokes[jokeIndex];
  
  const setupElement: HTMLElement | null = document.getElementById('joke-setup');
  const punchlineElement: HTMLElement | null = document.getElementById('joke-punchline');
  
  if (setupElement && punchlineElement) {
    setupElement.textContent = joke.setup;
    punchlineElement.textContent = joke.punchline;
  } else {
    console.error('Joke elements not found in DOM');
  }
}

/**
 * Initialize the 404 page functionality
 */
function init(): void {
  // Display a random joke when the page loads
  displayRandomJoke();
  
  // Add event listener to the "Get another joke" button
  const jokeButton: HTMLElement | null = document.getElementById('new-joke-btn');
  if (jokeButton) {
    jokeButton.addEventListener('click', displayRandomJoke);
  } else {
    console.error('Joke button not found in DOM');
  }
  
  // Add typing effect to the terminal cursor
  animateCursor();
}

/**
 * Adds a blinking cursor animation to the terminal
 */
function animateCursor(): void {
  const cursor = document.querySelector('.cursor');
  if (!cursor) {
    console.error('Cursor element not found');
    return;
  }
  
  // Cursor is already animated with CSS, but could add more complex
  // animations here in the future
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 