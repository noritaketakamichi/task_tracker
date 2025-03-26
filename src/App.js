import React, { useState, useEffect } from 'react';
import DailyTimer from './components/DailyTimer';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  // State for daily work time
  const [dailyTime, setDailyTime] = useState(localStorage.getItem('dailyTime') ? parseInt(localStorage.getItem('dailyTime'), 10) : 480); // Default to 8 hours (480 minutes)
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

  // Handle daily time input
  const handleDailyTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDailyTime(value);
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
        <h1>Task Time Tracker</h1>
      </header>
      
      <main className="App-main">
        <div className="daily-time-input">
          <label htmlFor="daily-time">Daily Work Time (minutes):</label>
          <input
            type="number"
            id="daily-time"
            value={dailyTime}
            onChange={handleDailyTimeChange}
            min="1"
          />
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
