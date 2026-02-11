import React, { useState, useEffect, useRef } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onDelete, onToggleTask }) => {
  const remainingTimeRef = useRef(task.duration * 60);
  const isOverdueRef = useRef(false);
  const [displayTime, setDisplayTime] = useState(task.duration * 60);
  const [displayOvertime, setDisplayOvertime] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  // Calculate percentage for the progress bar
  const percentage = isOverdue ? 0 : (displayTime / (task.duration * 60)) * 100;

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
  }, [task.isRunning]);

  useEffect(() => {
    remainingTimeRef.current = task.duration * 60;
    isOverdueRef.current = false;
    setDisplayTime(task.duration * 60);
    setIsOverdue(false);
    setDisplayOvertime(0);
  }, [task.duration]);

  return (
    <div className={`task-item ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <div>{isOverdue && <span className="overdue-label">OVERDUE</span>}</div>
        <button className="delete-button" onClick={() => onDelete()}>×</button>
      </div>
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
        className={`task-timer-button ${task.isRunning ? 'running' : ''}`}
        onClick={() => onToggleTask(task.id)}
      >
        {task.isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default TaskItem;
