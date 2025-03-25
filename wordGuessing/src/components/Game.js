// components/Game.js
import React, { useState, useEffect } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import { getRandomWord, resetWordCache } from "../wordBank";

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

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setSecretWord(getRandomWord(difficulty));
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setActiveCol(0);
    setAnimateRow(null);
    // Reset letter statuses when starting a new game
    setLetterStatuses({});
  };

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

  const handleKeyDown = (e) => {
    // Convert key to lowercase
    const key = e.key.toLowerCase();
    
    // Handle special keys and letters
    if (key === "enter" || key === "backspace" || /^[a-z]$/.test(key)) {
      handleKeyPress(key);
      e.preventDefault();
    }
  };

  // Add global event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameStatus, activeCol]);

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

    // Add after other state handler functions
  const handleRevealWord = () => {
    setIsWordRevealed(!isWordRevealed); //Toggle the reveal state
    /* setGameStatus("lost"); // Optional: end the game when word is revealed */
    //only penalize score on initial reveal, not on hiding
    if (!isWordRevealed) {
      setScore(Math.max(0,score - 1)); // Optional: decrease score for revealing
    }
  };

  return (
    <div 
      className="game-container" 
      style={{
        display: "flex",
        flexDirection: "row", // Changed from column to row
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundColor: backgroundColor,
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Game status message - Now positioned to the left */}
      {gameStatus !== "playing" && (
        <div
          className="game-message"
          style={{
            position: "fixed", // Changed from relative to fixed
            left: "20px", // Position from left edge
            top: "50%", // Center vertically
            transform: "translateY(-50%)", // Perfect vertical centering
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: gameStatus === "won" ? "#c8e6c9" : "#ffcdd2",
            color: gameStatus === "won" ? "#2e7d32" : "#c62828",
            fontWeight: "bold",
            width: "250px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: "1000" // Ensure it stays above other elements
          }}
        >
          {gameStatus === "won" ? (
            <h2 style={{ fontSize: "1.2em", margin: "0 0 10px 0" }}>
              Congratulations! You've guessed {secretWord}.
            </h2>
          ) : (
            <h2 style={{ fontSize: "1.2em", margin: "0 0 10px 0" }}>
              Game Over! The word was {secretWord}.
            </h2>
          )}
          <button
            onClick={startNewGame}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#2196f3",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Main game content wrapper */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px"
      }}>
        <div 
          className="game-header" 
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "500px",
            height: "1hv",
            marginBottom: "18px",
            borderRadius: "18px",
            padding: "10px",
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}
        >
          <h1 
          style={{
            Display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "flex-start", 
            margin: 0,
            padding: "10px",
            fontSize: "2.4em",
            fontFamily: "Agyx Monospace Rounded, sans-serif",
            fontWeight: "regular",
            color: "#000000",


          }}>BabbleBox</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      {/* Left side group - Score and Reveal controls */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "flex-end",
        gap: "5px",
        marginRight: "15px"
      }}>
        <span>Score: {score}</span>
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
          }}>
        
          {gameStatus === "playing" && (
            <button
              onClick={handleRevealWord}
              style={{
                padding: "7px 9px 9px 7px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: isWordRevealed ? "#4caf50" : "#ff5722",
                color: "white",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              {isWordRevealed ? "Hide Word" : "Show Word"}
            </button>
          )}

          {isWordRevealed && (
            <span style={{
            fontSizeAdjust: "60px",
            color: "white",
            fontWeight: "bold",
            position: "absolute",
            top: "180px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "50px",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "#ff5722",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 100,
            opacity: isWordRevealed ? 1 : 0,
            visibility: isWordRevealed ? "visible" : "hidden",
            transition: "opacity 1000ms ease, visibility 1000ms ease",
            pointerEvents: isWordRevealed ? "auto" : "none"
            }}>
              {secretWord}
            </span>
          )}
        </div>
      </div>
    
      {/* Right side group - Settings and Reset */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "flex-end",
        gap: "5px",
        marginRight: "15px"
      }}>
        <button 
          onClick={toggleSettings}
          style={{
            padding: "5px 10px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#efefef",
            cursor: "pointer"
          }}
        >
          ⚙️
        </button>
        
        <button 
          onClick={startNewGame}
          style={{
            padding: "5px 10px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#2196f3",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Reset
        </button>
      </div>
    </div>
          </div>
        </div>
        
        {/* Settings panel with fade effect */}
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "10px",
            padding: "15px",
            backgroundColor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            zIndex: 100,
            opacity: showSettings ? 1 : 0,
            visibility: showSettings ? "visible" : "hidden",
            transition: "opacity 750ms ease, visibility 750ms ease",
            pointerEvents: showSettings ? "auto" : "none"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Game Settings</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Background Color:
            </label>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
              {/* Predefined color options */}
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
              
              {/* Custom color picker */}
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
          
          {/* Difficulty range input */}
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
          
          <button
            onClick={toggleSettings}
            style={{
              padding: "5px 15px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#e0e0e0",
              cursor: "pointer"
            }}
          >
            Close Settings
          </button>
        </div>
        
        {/* Semi-transparent overlay that appears behind the settings */}
        {showSettings && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 50,
              opacity: showSettings ? 1 : 0,
              transition: "opacity 750ms ease",
              cursor: "pointer"
            }}
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