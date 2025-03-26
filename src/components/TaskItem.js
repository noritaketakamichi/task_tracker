import React, { useState, useEffect } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onDelete, onToggleTask }) => {
  const [remainingTime, setRemainingTime] = useState(task.duration * 60); // Convert minutes to seconds
  const percentage = (remainingTime / (task.duration * 60)) * 100;
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (task.isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prevTime => Math.max(0, prevTime - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.isRunning, remainingTime]);

  useEffect(() => {
    setRemainingTime(task.duration * 60);
  }, [task.duration]);

  return (
    <div className="task-item">
      <div className="task-header">
        <h3>Task</h3>
        <button className="delete-button" onClick={() => onDelete()}>×</button>
      </div>
      <div className="time-display">{formatTime(remainingTime)}</div>
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
