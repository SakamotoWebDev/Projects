// components/Game.js
import React, { useState, useEffect } from "react";
import Board from "./Board";
import { getRandomWord } from "../wordBank";

const Game = () => {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState([]); // Array of evaluated guesses
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"
  const [activeCol, setActiveCol] = useState(0);

  useEffect(() => {
    setSecretWord(getRandomWord());
  }, []);

  // Evaluate the guess against the secret word
  const evaluateGuess = (guess, answer) => {
    const result = [];
    const answerArr = answer.split("");
    const guessArr = guess.split("");
    const status = Array(5).fill("absent");
    const usedIndices = Array(5).fill(false);

    // First pass: mark letters in the correct position
    guessArr.forEach((letter, index) => {
      if (letter === answerArr[index]) {
        status[index] = "correct";
        usedIndices[index] = true;
      }
    });

    // Second pass: mark letters that are present but in the wrong position
    guessArr.forEach((letter, index) => {
      if (status[index] !== "correct") {
        const foundIndex = answerArr.findIndex(
          (l, i) => l === letter && !usedIndices[i]
        );
        if (foundIndex !== -1) {
          status[index] = "present";
          usedIndices[foundIndex] = true;
        }
      }
    });

    guessArr.forEach((letter, index) => {
      result.push({ letter, status: status[index] });
    });
    return result;
  };

  const handleLetterChange = (letter, rowIndex, colIndex) => {
    if (gameStatus !== "playing") return;
    
    // Handle navigation when letter is null (arrow keys)
    if (letter === null) {
      // Check bounds
      if (colIndex >= 0 && colIndex < 5) {
        setActiveCol(colIndex);
      }
      return;
    }
    
    // Update current guess with new letter
    const newGuess = currentGuess.split('');
    newGuess[colIndex] = letter;
    setCurrentGuess(newGuess.join(''));
    
    // Automatically move to next square if current square is filled
    if (letter && colIndex < 4) {
      setActiveCol(colIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (gameStatus !== "playing" || currentGuess.length !== 5) return;

    const evaluation = evaluateGuess(currentGuess.toLowerCase(), secretWord.toLowerCase());
    const newGuesses = [...guesses, evaluation];
    setGuesses(newGuesses);
    setCurrentGuess("");
    setActiveCol(0);

    if (currentGuess.toLowerCase() === secretWord.toLowerCase()) {
      setGameStatus("won");
    } else if (newGuesses.length === 6) {
      setGameStatus("lost");
    }
  };

  const handleKeyDown = (e) => {
    if (gameStatus !== "playing") return;
    
    if (e.key === "Enter" && currentGuess.length === 5) {
      handleSubmit();
    }
  };

  // Add global event listener for Enter key
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameStatus]);

  return (
    <div className="game-container" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      textAlign: "center"
    }}>
      <h1>Word Guessing Game</h1>
      <Board 
        guesses={guesses} 
        currentGuess={currentGuess} 
        onLetterChange={handleLetterChange}
        activeRow={guesses.length}
        activeCol={activeCol}
      />
      {gameStatus === "playing" ? (
        <div>
          <button 
            onClick={handleSubmit} 
            disabled={currentGuess.length !== 5} 
            style={{ 
              marginTop: "10px", 
              padding: "8px 16px",
              opacity: currentGuess.length === 5 ? 1 : 0.5
            }}
          >
            Submit Guess
          </button>
        </div>
      ) : (
        <div>
          {gameStatus === "won" ? (
            <h2>Congratulations! You've guessed the word.</h2>
          ) : (
            <h2>Game Over! The word was {secretWord}.</h2>
          )}
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game;