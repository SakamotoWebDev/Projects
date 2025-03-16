import random

def word_guessing_game():
    # List of 5-letter words
    word_list = ["apple", "table", "brick", "peach", "chess", "grape", "shard", "clean", "flame", "print"]
    
    # Randomly choose a word
    chosen_word = random.choice(word_list)
    max_attempts = 10

    print("Welcome to the Word Guessing Game!")
    print("I have chosen a 5-letter word. You have 6 attempts to guess it!")
    print("Feedback will be provided after each guess:")
    print(" - Correct letters in the right position will be shown in uppercase.")
    print(" - Correct letters in the wrong position will be shown in lowercase.")
    print("Let's begin!")

    for attempt in range(1, max_attempts + 1):
        # Get player's guess
        guess = input(f"Attempt {attempt}/{max_attempts}: ").lower()

        # Validate guess length
        if len(guess) != 5:
            print("Please enter a 5-letter word.")
            continue

        # Generate feedback
        feedback = ""
        for i in range(len(guess)):
            if guess[i] == chosen_word[i]:  # Correct position
                feedback += guess[i].upper()
            elif guess[i] in chosen_word:  # Correct letter, wrong position
                feedback += guess[i].lower()
            else:  # Incorrect letter
                feedback += "_"

        # Show feedback
        print("Feedback: ", feedback)

        # Check if the word is correct
        if guess == chosen_word:
            print(f"Congratulations! You guessed the word '{chosen_word}' in {attempt} attempts!")
            break
    else:
        # If the loop ends without a break, the player has used all attempts
        print(f"Sorry, you've run out of attempts. The word was '{chosen_word}'.")

# Run the game
if __name__ == "__main__":
    word_guessing_game()