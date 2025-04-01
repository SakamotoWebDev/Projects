// components/Game.js
import React, { useState, useEffect, useCallback } from "react";
import "./Game.css";
import './Board.css';
import './Keyboard.css';
import Board from "./Board.js";
import Keyboard from "./Keyboard.js";
import { getRandomWord } from "../wordBank";

const Game = () => {
  const [secretWord, setSecretWord] = useState(""); //State for secret word
  const [guesses, setGuesses] = useState([]); // Array of evaluated guesses
  const [currentGuess, setCurrentGuess] = useState(""); //State for current guess
  const [gameStatus, setGameStatus] = useState("playing"); // "playing", "won", "lost"
  const [activeCol, setActiveCol] = useState(0); // New state for active column
  const [letterStatuses, setLetterStatuses] = useState({}); // Object to track letter statuses
  const [score, setScore] = useState(0); // New state for score
  const [animateRow, setAnimateRow] = useState(null); //State for animation
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5"); // New state for background color
  const [showSettings, setShowSettings] = useState(false); // New state for settings
  const [difficulty, setDifficulty] = useState("easy"); // New state for difficulty
  const [isWordRevealed, setIsWordRevealed] = useState(false); // New state for word reveal
 
 
  const startNewGame = useCallback(() => {
    setSecretWord(getRandomWord(difficulty));
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setActiveCol(0);
    setAnimateRow(null);
    setLetterStatuses({});
    setIsWordRevealed(false); // Reset word reveal state
  }, [difficulty]);
  
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

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

    // Update letter statuses for keyboard
    const newLetterStatuses = { ...letterStatuses };
    guessArr.forEach((letter, index) => {
      // Only upgrade status, never downgrade
      // Priority: correct > present > absent
      const currentStatus = newLetterStatuses[letter];
      if (
        currentStatus === undefined ||
        (currentStatus === "absent" && status[index] !== "absent") ||
        (currentStatus === "present" && status[index] === "correct")
      ) {
        newLetterStatuses[letter] = status[index];
      }
    });
    setLetterStatuses(newLetterStatuses);

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
    // Start a new game with the enter key if game ends
  const handleKeyPress = (key) => {
    if (gameStatus !== "playing") {
      if (key === "enter" && gameStatus !== "playing") {
        startNewGame();
        return;
      }
      return;
    }

    if (key === "enter") {
      if (currentGuess.length === 5) {
        handleSubmit();
      }
    } else if (key === "backspace") {
      // Handle backspace
      if (currentGuess.length > 0) {
        const newGuess = currentGuess.split('');
        newGuess[activeCol > 0 ? activeCol - 1 : 0] = '';
        setCurrentGuess(newGuess.join(''));
        if (activeCol > 0) setActiveCol(activeCol - 1);
      }
    } else if (/^[a-z]$/.test(key)) {
      // Handle letter input
      if (currentGuess.length < 5) {
        handleLetterChange(key, guesses.length, activeCol);
      }
    }
  }; 

  const handleSubmit =  () => {
    if (gameStatus !== "playing" || currentGuess.length !== 5) return;

    const evaluation = evaluateGuess(currentGuess.toLowerCase(), secretWord.toLowerCase());
    const newGuesses = [...guesses, evaluation];
    setGuesses(newGuesses);
    
    // Check if the guess is correct
    if (currentGuess.toLowerCase() === secretWord.toLowerCase()) {
      setGameStatus("won");
      setScore(score + 1);
      setAnimateRow(guesses.length);
      setCurrentGuess(""); // Clear current guess
      
      // After animation completes
      setTimeout(() => {
        setAnimateRow(null);
      }, 2000);
    } else if (newGuesses.length === 6) {
      setGameStatus("lost");
      setCurrentGuess(""); // Clear current guess

    } else {
      // Continue game with a new guess
      setCurrentGuess("");
      setActiveCol(0);
    }
  };

  const handleKeyDown = useCallback((e) => {
    // Convert key to lowercase
    const key = e.key.toLowerCase();
    
    // Handle special keys and letters
    if (key === "enter" || key === "backspace" || /^[a-z]$/.test(key)) {
      handleKeyPress(key);
      e.preventDefault();
    }
  }, [handleKeyPress, /*gameStatus, currentGuess, activeCol */]);

  // Add global event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Add this function to toggle settings
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Add this function to handle background color change
  const handleBackgroundChange = (color) => {
    setBackgroundColor(color);
    // Optionally save to localStorage for persistence across sessions
    localStorage.setItem('wrdlyBackgroundColor', color);
  };

  // Load saved background color on initial render
  useEffect(() => {
    const savedColor = localStorage.getItem('wrdlyBackgroundColor');
    if (savedColor) {
      setBackgroundColor(savedColor);
    }
  }, []);

    // word reveal function
  const handleRevealWord = () => {
    setIsWordRevealed(!isWordRevealed); //Toggle the reveal state
    setGameStatus("lost"); // Optional: end the game when word is revealed
    //only penalize score on initial reveal, not on hiding
    if (!isWordRevealed) {
      setScore(Math.max(0,score - 1)); // Optional: decrease score for revealing
    }
  };

    //Funtion to get a contrasting color
    const getContrastingColor = (savedColor) => {
    const r = parseInt(savedColor.slice(1, 3), 16);
    const g = parseInt(savedColor.slice(3, 5), 16);
    const b = parseInt(savedColor.slice(5, 7), 16);
    // Invert each RGB channel
    const invertedR = 255 - r;
    const invertedG = 255 - g;
    const invertedB = 255 - b;
    // Convert back to hex and pad with zeros if necessary
    const pad = (n) => n.toString(16).padStart(2, "0");
    return `#${pad(invertedR)}${pad(invertedG)}${pad(invertedB)}`;
  };
  
    return (
      <div className="game-container" style={{ backgroundColor }}>
        {gameStatus !== "playing" && (
          <div className={`game-message ${gameStatus === "won" ? "game-message--won" : "game-message--lost"}`}>
            <h2 className="game-message__title">
              {gameStatus === "won" 
                ? `Congratulations! You've guessed ${secretWord}.`
                : `Game Over! The word was ${secretWord}.`}
            </h2>
            <button className="game-message__button" onClick={startNewGame}>
              Play Again
            </button>
          </div>
        )}
  
        <div className="game-content">
          <div className="game-header" style={{ backgroundColor: getContrastingColor(backgroundColor) }}>
            <h1 className="game-title" style={{ color: backgroundColor }}>BabbleBoxes</h1> 
            <div className="controls-group">
              <div className="controls-group">
                {/* Left side group - Score and Reveal controls */}
                <div className="score-controls">
                  <span>Score: {score}</span>
                  
                  <div className="controls-group">
                    {gameStatus === "playing" && (
                      <button
                        onClick={handleRevealWord}
                        className={`reveal-button ${isWordRevealed ? 'reveal-button--active' : 'reveal-button--inactive'}`}
                      >
                        {isWordRevealed ? "Hide Word" : "Show Word"}
                      </button>
                    )}
  
                    {isWordRevealed && (
                      <span className={`revealed-word ${isWordRevealed ? 'revealed-word--visible' : 'revealed-word--hidden'}`}>
                        {secretWord}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Right side group - Settings and Reset */}
                <div className="score-controls">
                  <button onClick={toggleSettings} className="button">
                    <span role="img" aria-label="Settings">⚙️</span>
                  </button>
                  <button onClick={startNewGame} className="button">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Settings panel */}
          <div className={`settings-panel ${showSettings ? 'settings-panel--visible' : 'settings-panel--hidden'}`}>
            <h3>Game Settings</h3>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Background Color:
              </label>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
                {["#f5f5f5", "#e8f5e9", "#e3f2fd", "#fff8e1", "#fce4ec", "#f3e5f5", "#ede7f6"].map(color => (
                  <div
                    key={color}
                    onClick={() => handleBackgroundChange(color)}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: color,
                      borderRadius: "5px",
                      cursor: "pointer",
                      border: backgroundColor === color ? "2px solid #2196f3" : "1px solid #ddd"
                    }}
                  />
                ))}
                
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => handleBackgroundChange(e.target.value)}
                  style={{
                    width: "30px",
                    height: "30px",
                    padding: 0,
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Difficulty:
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={["easy", "medium", "hard"].indexOf(difficulty)}
                onChange={(e) => setDifficulty(["easy", "medium", "hard"][parseInt(e.target.value)])}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9em" }}>
                <span>Easy</span>
                <span>Medium</span>
                <span>Hard</span>
              </div>
            </div>
            
            <button className="button" onClick={toggleSettings}>
              Close Settings
            </button>
          </div>
          
          {/* Settings overlay */}
          {showSettings && (
            <div 
              className={`settings-overlay ${showSettings ? 'settings-overlay--visible' : 'settings-overlay--hidden'}`}
              onClick={toggleSettings}
            />
          )}
          
          <Board 
            guesses={guesses} 
            currentGuess={currentGuess} 
            onLetterChange={handleLetterChange}
            activeRow={guesses.length}
            activeCol={activeCol}
            animateRow={animateRow}
          />
          
          <Keyboard 
            letterStatuses={letterStatuses} 
            onKeyPress={handleKeyPress} 
          />
        </div>
      </div>
    );
  };
  
  export default Game;
