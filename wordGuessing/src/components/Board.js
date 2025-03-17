// components/Board.js
import React, { useRef, useEffect } from "react";

const Board = ({ guesses, currentGuess, onLetterChange, activeRow, activeCol }) => {
  // Create 6 rows for the game board
  const rows = [];
  for (let i = 0; i < 6; i++) {
    if (i < guesses.length) {
      rows.push(<Row key={i} letters={guesses[i]} rowIndex={i} onLetterChange={onLetterChange} isActive={false} activeCol={-1} />);
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
        />
      );
    }
  }

  return (
    <div className="board" style={{
      margin: "0 auto",
      maxWidth: "max-content",
      padding: "20px"
    }}>
      {rows}
    </div>
  );
};

const Row = ({ letters, rowIndex, onLetterChange, isActive, activeCol }) => {
  return (
    <div
      className="board-row"
      style={{ display: "flex", gap: "5px", marginBottom: "10px" }}
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
        />
      ))}
    </div>
  );
};

const Cell = ({ letter, status, rowIndex, colIndex, onLetterChange, isActive, isFocused }) => {
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
    backgroundColor = "yellow";
  } else if (status === "absent") {
    backgroundColor = "grey";
  }

  const style = {
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
    position: "relative"
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
      if (colIndex > 0) {
        // Clear current cell and move to previous cell
        onLetterChange(null, rowIndex, colIndex - 1);
        onLetterChange("", rowIndex, colIndex );
      } else {
        // Just clear current cell if we're at the first position
        onLetterChange("", rowIndex, colIndex);
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
            outline: isFocused ? "2px solid blue" : "none"
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