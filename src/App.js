import React, { useState, useEffect } from 'react';
import DailyTimer from './components/DailyTimer';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  // State for daily work time
  const [dailyHours, setDailyHours] = useState(() => {
    const savedTime = localStorage.getItem('dailyTime') ? parseInt(localStorage.getItem('dailyTime'), 10) : 480;
    return Math.floor(savedTime / 60); // Convert minutes to hours
  });
  
  const [dailyMinutes, setDailyMinutes] = useState(() => {
    const savedTime = localStorage.getItem('dailyTime') ? parseInt(localStorage.getItem('dailyTime'), 10) : 480;
    return savedTime % 60; // Get remaining minutes
  });
  
  // Calculate total daily time in minutes, handling empty string values
  const dailyTime = (dailyHours === '' ? 0 : parseInt(dailyHours, 10)) * 60 + 
                    (dailyMinutes === '' ? 0 : parseInt(dailyMinutes, 10));
  
  const [isDailyTimerRunning, setIsDailyTimerRunning] = useState(false);
  
  // State for tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyTime', dailyTime.toString());
  }, [dailyTime]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle daily hours input
  const handleDailyHoursChange = (e) => {
    // If the input is empty, set to empty string
    if (e.target.value === '') {
      setDailyHours('');
      return;
    }
    
    // Only allow half-width numeric characters (0-9)
    if (!/^[0-9]+$/.test(e.target.value)) {
      return;
    }
    
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setDailyHours(value);
    }
  };

  // Handle daily minutes input
  const handleDailyMinutesChange = (e) => {
    // If the input is empty, set to empty string
    if (e.target.value === '') {
      setDailyMinutes('');
      return;
    }
    
    // Only allow half-width numeric characters (0-9)
    if (!/^[0-9]+$/.test(e.target.value)) {
      return;
    }
    
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value < 60) {
      setDailyMinutes(value);
    }
  };

  // Toggle daily timer
  const toggleDailyTimer = () => {
    const newTimerState = !isDailyTimerRunning;
    setIsDailyTimerRunning(newTimerState);
    
    // Update all tasks to match the daily timer state
    if (tasks.length > 0) {
      setTasks(tasks.map(task => ({
        ...task,
        isRunning: newTimerState
      })));
    }
  };

  // Add a new task (replacing any existing task)
  const addTask = (task) => {
    setTasks([task]); // Only keep the new task
  };

  // Delete a task
  const deleteTask = () => {
    setTasks([]); // Clear all tasks
  };

  // Toggle a specific task's timer
  const toggleTaskTimer = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    // Determine if we're starting or stopping the task
    const willBeRunning = !targetTask.isRunning;

    // Update the task's running state
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isRunning: willBeRunning };
      }
      return task;
    }));

    // Also update the daily timer to match
    setIsDailyTimerRunning(willBeRunning);
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      
      <main className="App-main">
        <div className="daily-time-input">
          <label>My Focus Time Today:</label>
          <div className="time-inputs">
            <div className="time-input-group">
              <input
                type="number"
                id="daily-hours"
                value={dailyHours}
                onChange={handleDailyHoursChange}
                min="0"
                className="hours-input"
              />
              <label htmlFor="daily-hours">hours</label>
            </div>
            <div className="time-input-group">
              <input
                type="number"
                id="daily-minutes"
                value={dailyMinutes}
                onChange={handleDailyMinutesChange}
                min="0"
                max="59"
                className="minutes-input"
              />
              <label htmlFor="daily-minutes">minutes</label>
            </div>
            <button 
              className="reset-button"
              onClick={() => {
                setDailyHours('');
                setDailyMinutes('');
              }}
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="app-content">
          <DailyTimer 
            dailyTime={dailyTime} 
            isRunning={isDailyTimerRunning}
            onTimerToggle={toggleDailyTimer}
          />
          
          <TaskList 
            tasks={tasks}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onToggleTask={toggleTaskTimer}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
