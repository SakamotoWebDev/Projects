// components/Board.js
import React, { useRef, useEffect } from "react";
import './Board.css'; // Assuming you have a CSS file for styles

const Board = ({ guesses, currentGuess, onLetterChange, activeRow, activeCol, animateRow }) => {
  // Create 6 rows for the game board
  const rows = [];
  for (let i = 0; i < 6; i++) {
    if (i < guesses.length) {
      rows.push(
        <Row 
          key={i} 
          letters={guesses[i]} 
          rowIndex={i} 
          onLetterChange={onLetterChange} 
          isActive={false} 
          activeCol={-1} 
          animate={animateRow === i}
        />
      );
    } else if (i === guesses.length) {
      // Current guess row (in-progress)
      const letters = Array(5).fill().map((_, idx) => ({
        letter: idx < currentGuess.length ? currentGuess[idx] : "",
        status: null
      }));
      
      rows.push(
        <Row 
          key={i} 
          letters={letters} 
          rowIndex={i} 
          onLetterChange={onLetterChange} 
          isActive={true} 
          activeCol={activeCol} 
          animate={false}
        />
      );
    } else {
      // Empty rows
      const emptyLetters = Array(5).fill({ letter: "", status: null });
      rows.push(
        <Row 
          key={i} 
          letters={emptyLetters} 
          rowIndex={i} 
          onLetterChange={onLetterChange} 
          isActive={false} 
          activeCol={-1} 
          animate={false}
        />
      );
    }
  }

  return (
    <div className="board" style={{
      margin: "0 auto",
      maxWidth: "max-content",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      {rows}
    </div>
  );
};

const Row = ({ letters, rowIndex, onLetterChange, isActive, activeCol, animate }) => {
  return (
    <div
      className="board-row"
      style={{ 
        display: "flex", 
        gap: "5px", 
        marginBottom: "10px",
        position: "relative" 
      }}
    >
      {letters.map((item, index) => (
        <Cell 
          key={index} 
          letter={item.letter} 
          status={item.status} 
          rowIndex={rowIndex}
          colIndex={index}
          onLetterChange={onLetterChange}
          isActive={isActive}
          isFocused={isActive && index === activeCol}
          animate={animate}
          animationDelay={index * 100} // Stagger animation
        />
      ))}
    </div>
  );
};

const Cell = ({ 
  letter, 
  status, 
  rowIndex, 
  colIndex, 
  onLetterChange, 
  isActive, 
  isFocused, 
  animate,
  animationDelay
}) => {
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  let backgroundColor = "#ddd"; // default background

  if (status === "correct") {
    backgroundColor = "green";
  } else if (status === "present") {
    backgroundColor = "#e9b342"; // yellow
  } else if (status === "absent") {
    backgroundColor = "#787c7f"; // grey
  }

  const baseStyle = {
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor,
    textTransform: "uppercase",
    fontSize: "1.5rem",
    fontWeight: "bold",
    border: "2px solid #999",
    borderRadius: "10px",
    position: "relative",
    transition: "all 0.3s ease",
    color: status ? "white" : "black"
  };
  
  // Animation styles for correct guesses
  const animationStyle = animate ? {
    animation: `float-up 2s forwards ${animationDelay}ms`,
    transformOrigin: "center",
  } : {};

  const style = {
    ...baseStyle,
    ...animationStyle
  };

  const handleKeyDown = (e) => {
    // Handle navigation with arrow keys
    if (e.key === "ArrowRight") {
      onLetterChange(null, rowIndex, colIndex + 1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      onLetterChange(null, rowIndex, colIndex - 1);
      e.preventDefault();
    } else if (e.key === "Backspace") {
      if (letter) {
        // Clear current cell if it has a letter
        onLetterChange("", rowIndex, colIndex );
        onLetterChange(null, rowIndex, colIndex - 1);
      } else if (colIndex > 0) {
        // Move to previous cell if current cell is empty
        onLetterChange(null, rowIndex, colIndex - 1);
      }
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    if (/^[a-z]$/.test(value)) {
      onLetterChange(value, rowIndex, colIndex);
    }
  };

  return (
    <div style={style}>
      {isActive ? (
        <input
          ref={inputRef}
          type="text"
          maxLength="1"
          value={letter}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            width: "90%",
            height: "90%",
            padding: 0,
            border: "none",
            background: "transparent",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            outline: isFocused ? "2px solid blue" : "none",
            borderRadius: "8px"
          }}
          disabled={!isActive}
        />
      ) : (
        letter
      )}
    </div>
  );
};

export default Board;