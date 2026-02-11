import React, { useState, useCallback } from 'react';
import TaskItem from './TaskItem';
import NumberPad from './NumberPad';
import './TaskList.css';

const TaskList = ({ tasks, onAddTask, onDeleteTask, onToggleTask }) => {
  const [newTaskDuration, setNewTaskDuration] = useState('');
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [numberPadValue, setNumberPadValue] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (newTaskDuration) {
      onAddTask({
        id: Date.now(),
        duration: parseInt(newTaskDuration, 10),
        isRunning: true // Set to true so the task starts running immediately
      });
      setNewTaskDuration('');
    }
  }, [newTaskDuration, onAddTask]);

  const handleDurationChange = useCallback((e) => {
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
  }, []);

  // Number pad handlers
  const openNumberPad = useCallback(() => {
    setNumberPadValue(newTaskDuration);
    setShowNumberPad(true);
  }, [newTaskDuration]);

  const closeNumberPad = useCallback(() => {
    const value = parseInt(numberPadValue) || 1;
    setNewTaskDuration(Math.max(1, value).toString());
    setShowNumberPad(false);
    setNumberPadValue('');
  }, [numberPadValue]);

  // Check if any task is running
  const isAnyTaskRunning = tasks.length > 0 && tasks.some(task => task.isRunning);

  return (
    <div className="task-list">
      <h2>Focused Task</h2>
      
      {tasks.length === 0 ? (
        !isAnyTaskRunning && (
          <form className="add-task-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <button 
                type="button"
                className="number-input-button"
                onClick={openNumberPad}
              >
                {newTaskDuration || '1'} minutes
              </button>
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
        )
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
      
      {showNumberPad && (
        <NumberPad
          value={numberPadValue}
          onChange={setNumberPadValue}
          onClose={closeNumberPad}
          title="Enter minutes"
          maxValue={null}
        />
      )}
    </div>
  );
};

export default TaskList;
