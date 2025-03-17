// wordBank.js
export const words = [
    "apple",
    "grape",
    "berry",
    "mango",
    "peach",
    "lemon",
    "melon",
    "guava",
    "olive",
    "apron"
  ];
  
  export function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
  }