import React, { useState, useEffect } from "react";
import './Keyboard.css';

const Keyboard = ({ letterStatuses, onKeyPress }) => {
  // Add state to track the currently pressed key
  const [activeKey, setActiveKey] = useState(null);
  
  // Keyboard layout rows
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"]
  ];

  // Listen for physical keyboard presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      // Check if the key is one we care about
      if (key === "enter" || key === "backspace" || /^[a-z]$/.test(key)) {
        setActiveKey(key);
        // Reset the active key after a short delay
        setTimeout(() => setActiveKey(null), 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle click on virtual keyboard
  const handleClick = (key) => {
    setActiveKey(key);
    onKeyPress(key);
    // Reset active state after a short delay
    setTimeout(() => setActiveKey(null), 100);
  };

  const getKeyStyle = (key) => {
    const baseStyle = {
      margin: "4px",
      borderRadius: "10px",
      padding: key.length > 1 ? "15px 10px" : "15px 12px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      textTransform: "uppercase",
      transition: "all 0.1s ease",
      border: "none",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      minWidth: key.length > 1 ? "65px" : "40px",
    };

    // Check if this key is currently active (pressed)
    const isActive = key === activeKey;
    
    // Active state styling (pressed down effect)
    if (isActive) {
      return {
        ...baseStyle,
        transform: "scale(0.85) translateY(4px)",
        backgroundColor: "#00b8d4", // Bright teal blue
        boxShadow: "0 0 15px #ffd700", // Yellow glow
        filter: "brightness(1.2)",
        transition: "all 0.05s ease"
      };
    }

    // Apply status-based styling
    const status = letterStatuses[key];
    if (status === "correct") {
      return {
        ...baseStyle,
        backgroundColor: "green",
        color: "white"
      };
    } else if (status === "present") {
      return {
        ...baseStyle,
        backgroundColor: "#e9b342", // yellow
        color: "white"
      };
    } else if (status === "absent") {
      return {
        ...baseStyle,
        backgroundColor: "#787c7f", // grey
        color: "white"
      };
    }

    return {
      ...baseStyle,
      backgroundColor: "#d3d6da", // default
      color: "black"
    };
  };

  return (
    <div className="keyboard" style={{ marginTop: "20px" }}>
      {keyboardRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "8px" 
          }}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              style={getKeyStyle(key)}
              aria-label={key}
            >
              {key === "backspace" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 