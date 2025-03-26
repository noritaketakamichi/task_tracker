# Task Time Tracker

A React application for tracking daily work time and individual tasks.

## Features

- **Daily Work Time Management**
  - Input field for setting daily work time in minutes
  - Timer display showing hours:minutes:seconds
  - Gauge that decreases as time passes
  - Start/Stop button

- **Task Management**
  - Input field for setting task duration in minutes
  - Only one task can be active at a time
  - Timer display showing minutes:seconds
  - Gauge that decreases as time passes
  - Start/Stop button

- **Synchronized Timers**
  - Both the Daily Work Time and Task timers start simultaneously when either Start button is clicked
  - Both timers stop simultaneously when either Stop button is clicked

- **Offline Functionality**
  - The application works offline as it uses localStorage to save data

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/noritaketakamichi/task_tracker.git
   cd task_tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Set your daily work time in minutes
2. Add a task with a specific duration
3. Click the Start button to begin tracking time
4. Click the Stop button to pause the timers
5. Delete a task by clicking the X button

## Technologies Used

- React
- CSS
- localStorage for data persistence

## Designed For

This application is optimized for iPad in landscape orientation.
