import React, { useState, useEffect } from 'react';
import DailyTimer from './components/DailyTimer';
import TaskList from './components/TaskList';
import NumberPad from './components/NumberPad';
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
  
  // Number pad state
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [numberPadValue, setNumberPadValue] = useState('');
  const [numberPadType, setNumberPadType] = useState('');
  
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
    
    // Daily timer runs independently - don't sync with task timer
  };

  // Add a new task (replacing any existing task)
  const addTask = (task) => {
    setTasks([task]); // Only keep the new task
  };

  // Delete a task
  const deleteTask = () => {
    setTasks([]); // Clear all tasks
  };

  // Number pad handlers
  const openNumberPad = (type, currentValue) => {
    setNumberPadType(type);
    setNumberPadValue(currentValue.toString());
    setShowNumberPad(true);
  };

  const closeNumberPad = () => {
    const value = parseInt(numberPadValue) || 0;
    
    if (numberPadType === 'hours') {
      setDailyHours(value);
    } else if (numberPadType === 'minutes') {
      setDailyMinutes(Math.min(59, value));
    }
    
    setShowNumberPad(false);
    setNumberPadValue('');
    setNumberPadType('');
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

    // Daily timer runs independently - don't sync with task timer
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      
      <main className="App-main">
        {!isDailyTimerRunning && (
          <div className="daily-time-input">
            <label>My Focus Time Today:</label>
            <div className="time-inputs">
              <div className="time-input-group">
                <button 
                  type="button"
                  className="number-input-button"
                  onClick={() => openNumberPad('hours', dailyHours === '' ? 0 : dailyHours)}
                >
                  {dailyHours === '' ? 0 : dailyHours} hours
                </button>
              </div>
              <div className="time-input-group">
                <button 
                  type="button"
                  className="number-input-button"
                  onClick={() => openNumberPad('minutes', dailyMinutes === '' ? 0 : dailyMinutes)}
                >
                  {dailyMinutes === '' ? 0 : dailyMinutes} minutes
                </button>
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
        )}
        
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
        
        {showNumberPad && (
          <NumberPad
            value={numberPadValue}
            onChange={setNumberPadValue}
            onClose={closeNumberPad}
            title={`Enter ${numberPadType}`}
            maxValue={numberPadType === 'minutes' ? 59 : null}
          />
        )}
      </main>
    </div>
  );
}

export default App;
