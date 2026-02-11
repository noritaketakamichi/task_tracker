import React, { useState, useEffect, useRef } from 'react';
import './DailyTimer.css';

const DailyTimer = ({ dailyTime, isRunning, onTimerToggle }) => {
  const remainingTimeRef = useRef(dailyTime * 60);
  const isOverdueRef = useRef(false);
  const [displayTime, setDisplayTime] = useState(dailyTime * 60);
  const [displayOvertime, setDisplayOvertime] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  // Calculate percentage for the progress bar
  const percentage = isOverdue ? 0 : (displayTime / (dailyTime * 60)) * 100;

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
        if (remainingTimeRef.current > 0) {
          remainingTimeRef.current -= 1;
          setDisplayTime(remainingTimeRef.current);
          if (remainingTimeRef.current === 0) {
            isOverdueRef.current = true;
            setIsOverdue(true);
          }
        } else if (isOverdueRef.current) {
          setDisplayOvertime(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    remainingTimeRef.current = dailyTime * 60;
    isOverdueRef.current = false;
    setDisplayTime(dailyTime * 60);
    setIsOverdue(false);
    setDisplayOvertime(0);
  }, [dailyTime]);

  return (
    <div className={`daily-timer ${isOverdue ? 'overdue' : ''}`}>
      <h2>My Focus Time Today {isOverdue && <span className="overdue-label">OVERDUE</span>}</h2>
      <div className="time-display">
        {isOverdue ? `+${formatTime(displayOvertime)}` : formatTime(displayTime)}
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
