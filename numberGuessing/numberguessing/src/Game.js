const readline = require('readline');

function guessingGame() {
    const numberToGuess = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    console.log("Welcome to the Number Guessing Game");
    console.log("I'm thinking of a number between 1 and 100.");
    console.log("Can you guess what it is?");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askGuess() {
        rl.question("Enter your guess: ", (input) => {
            const guess = parseInt(input, 10);
            if (isNaN(guess)) {
                console.log("Please enter a valid number.");
                askGuess();
                return;
            }
            
            attempts++;

            if (guess < numberToGuess) {
                console.log("Too Low! Try again.");
                askGuess();
            } else if (guess > numberToGuess) {
                console.log("Too High! Try again.");
                askGuess();
            } else {
                console.log(`Congratulations! You guessed it in ${attempts} attempts.`);
                rl.close();
            }
        });
    }

    askGuess();
}

guessingGame();