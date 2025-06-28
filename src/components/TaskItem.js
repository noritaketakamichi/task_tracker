import React, { useState, useEffect } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onDelete, onToggleTask }) => {
  const [remainingTime, setRemainingTime] = useState(task.duration * 60); // Convert minutes to seconds
  const [isOverdue, setIsOverdue] = useState(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  
  // Calculate percentage for the progress bar
  const percentage = isOverdue ? 0 : (remainingTime / (task.duration * 60)) * 100;
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (task.isRunning) {
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
  }, [task.isRunning, remainingTime, isOverdue]);

  useEffect(() => {
    setRemainingTime(task.duration * 60);
    setIsOverdue(false); // Reset overdue state when duration changes
    setOvertimeSeconds(0); // Reset overtime when duration changes
  }, [task.duration]);

  return (
    <div className={`task-item ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <div>{isOverdue && <span className="overdue-label">OVERDUE</span>}</div>
        <button className="delete-button" onClick={() => onDelete()}>×</button>
      </div>
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
        className={`task-timer-button ${task.isRunning ? 'running' : ''}`}
        onClick={() => onToggleTask(task.id)}
      >
        {task.isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default TaskItem;
