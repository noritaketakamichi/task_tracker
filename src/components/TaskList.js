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

  return (
    <div className="task-list">
      <h2>Task</h2>
      
      {tasks.length === 0 ? (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={newTaskDuration}
            onChange={(e) => setNewTaskDuration(e.target.value)}
            min="1"
            className="duration-input"
          />
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
