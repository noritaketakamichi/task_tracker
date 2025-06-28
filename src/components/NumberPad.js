import React from 'react';
import './NumberPad.css';

const NumberPad = ({ value, onChange, onClose, title, maxValue = null }) => {
  const handleNumberClick = (digit) => {
    const newValue = value + digit;
    if (maxValue && parseInt(newValue) > maxValue) return;
    onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div className="number-pad-overlay">
      <div className="number-pad">
        <div className="number-pad-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="number-display">
          {value || '0'}
        </div>
        
        <div className="number-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className="number-button"
              onClick={() => handleNumberClick(num.toString())}
            >
              {num}
            </button>
          ))}
          
          <button className="number-button clear-button" onClick={handleClear}>
            Clear
          </button>
          
          <button className="number-button" onClick={() => handleNumberClick('0')}>
            0
          </button>
          
          <button className="number-button backspace-button" onClick={handleBackspace}>
            ←
          </button>
        </div>
        
        <button className="done-button" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
};

export default NumberPad;