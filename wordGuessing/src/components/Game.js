// components/Game.js
import React, { useState, useEffect } from "react";
import Board from "./Board";
import { getRandomWord } from "../wordBank";

const Game = () => {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState([]); // Array of evaluated guesses
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameStatus !== "playing" || currentGuess.length !== 5) return;

    const evaluation = evaluateGuess(currentGuess.toLowerCase(), secretWord.toLowerCase());
    const newGuesses = [...guesses, evaluation];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess.toLowerCase() === secretWord.toLowerCase()) {
      setGameStatus("won");
    } else if (newGuesses.length === 6) {
      setGameStatus("lost");
    }
  };

  return (
    <div className="game-container">
      <h1>Word Guessing Game</h1>
      <Board guesses={guesses} currentGuess={currentGuess} />
      {gameStatus === "playing" ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="5"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            disabled={gameStatus !== "playing"}
            style={{ textTransform: "lowercase" }}
          />
          <button type="submit">Guess</button>
        </form>
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