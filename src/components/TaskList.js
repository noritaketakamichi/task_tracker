import React, { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onAddTask, onDeleteTask, onToggleTask }) => {
  const [newTaskDuration, setNewTaskDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskDuration) {
      onAddTask({
        id: Date.now(),
        duration: parseInt(newTaskDuration, 10),
        isRunning: false
      });
      setNewTaskDuration('');
    }
  };
  
  const handleDurationChange = (e) => {
    // If the input is empty, set to empty string
    if (e.target.value === '') {
      setNewTaskDuration('');
      return;
    }
    
    // Only allow half-width numeric characters (0-9)
    if (!/^[0-9]+$/.test(e.target.value)) {
      return;
    }
    
    setNewTaskDuration(e.target.value);
  };

  return (
    <div className="task-list">
      <h2>Focused Task</h2>
      
      {tasks.length === 0 ? (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newTaskDuration}
              onChange={handleDurationChange}
              min="1"
              className="duration-input"
            />
            <button 
              type="button" 
              className="reset-button"
              onClick={() => setNewTaskDuration('')}
            >
              Reset
            </button>
          </div>
          <button type="submit" className="add-button">Add Task</button>
        </form>
      ) : (
        <div className="tasks-container">
          <TaskItem
            key={tasks[0].id}
            task={tasks[0]}
            onDelete={onDeleteTask}
            onToggleTask={onToggleTask}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;
