// components/Board.js
import React from "react";

const Board = ({ guesses, currentGuess }) => {
  // Create 6 rows for the game board
  const rows = [];
  for (let i = 0; i < 6; i++) {
    if (i < guesses.length) {
      rows.push(<Row key={i} letters={guesses[i]} />);
    } else if (i === guesses.length) {
      // Current guess row (in-progress)
      const letters = currentGuess.split("").map((letter) => ({ letter, status: null }));
      while (letters.length < 5) {
        letters.push({ letter: "", status: null });
      }
      rows.push(<Row key={i} letters={letters} />);
    } else {
      // Empty rows
      const emptyLetters = Array(5).fill({ letter: "", status: null });
      rows.push(<Row key={i} letters={emptyLetters} />);
    }
  }

  return <div className="board">{rows}</div>;
};

const Row = ({ letters }) => {
  return (
    <div
      className="board-row"
      style={{ display: "flex", gap: "5px", marginBottom: "10px" }}
    >
      {letters.map((item, index) => (
        <Cell key={index} letter={item.letter} status={item.status} />
      ))}
    </div>
  );
};

const Cell = ({ letter, status }) => {
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
    border: "2px solid #999"
  };

  return <div style={style}>{letter}</div>;
};

export default Board;