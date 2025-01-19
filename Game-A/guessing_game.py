import random

def guessing_game():
    #generate a random number between 1 and 10
    number_to_guess = random.randint(1,100)
    attempts = 0

    print ("Welcome to the Number Guessing Game")
    print ("I'm thinking of a number between 1 and 100.")
    print ("Can you guess what it is?")

    while True:
        # get user's guess
        try:
            guess = int(input("Enter your guess: "))
        except ValueError:
            print("Please enter a valid number.")
            continue
                
        attempts += 1

            # Check the guess
        if guess < number_to_guess:
                print("Too Low! Try again.")
        elif guess > number_to_guess:
                print("Too High! Try again.")
        else:
                print(f"Congratulations! You guessed it in {attempts} attempts.")
                break
# Run the game
if __name__ == "__main__":
    guessing_game()