import React, { useState, useEffect } from 'react';
import './DailyTimer.css';

const DailyTimer = ({ dailyTime, isRunning, onTimerToggle }) => {
  const [remainingTime, setRemainingTime] = useState(dailyTime * 60); // Convert minutes to seconds
  const [isOverdue, setIsOverdue] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  
  // Calculate percentage for the progress bar
  const percentage = isOverdue ? 0 : (remainingTime / (dailyTime * 60)) * 100;

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        if (remainingTime > 0) {
          setRemainingTime(prevTime => {
            const newTime = Math.max(0, prevTime - 1);
            if (newTime === 0) {
              setIsOverdue(true);
            }
            return newTime;
          });
        } else if (isOverdue) {
          setOvertimeSeconds(prevOvertime => prevOvertime + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingTime, isOverdue]);

  useEffect(() => {
    setRemainingTime(dailyTime * 60);
    setIsOverdue(false); // Reset overdue state when duration changes
    setOvertimeSeconds(0); // Reset overtime when duration changes
  }, [dailyTime]);

  return (
    <div className={`daily-timer ${isOverdue ? 'overdue' : ''}`}>
      <h2>My Focus Time Today {isOverdue && <span className="overdue-label">OVERDUE</span>}</h2>
      <div className="time-display">
        {isOverdue ? `+${formatTime(overtimeSeconds)}` : formatTime(remainingTime)}
      </div>
      <div className="gauge-container">
        <div className="gauge-background">
          <div 
            className="gauge-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <button 
        className="timer-button" 
        onClick={onTimerToggle}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default DailyTimer;
