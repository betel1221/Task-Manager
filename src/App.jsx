import React, { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, title: "Submit project proposal", done: false, priority: "high" },
      { id: 2, title: "Attend team meeting", done: true, priority: "medium" },
      { id: 3, title: "Update website content", done: false, priority: "medium" },
      { id: 4, title: "Organize desk", done: true, priority: "low" },
      { id: 5, title: "Review client feedback", done: false, priority: "high" },
      { id: 6, title: "Complete training module", done: true, priority: "medium" },
      { id: 7, title: "Schedule doctor appointment", done: false, priority: "high" },
      { id: 8, title: "Read industry report", done: false, priority: "low" },
      { id: 9, title: "Prepare presentation slides", done: true, priority: "high" },
      { id: 10, title: "Back up computer files", done: false, priority: "medium" }
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState('low');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState({ active: false, message: '' });
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      setIsDarkTheme(true);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'done') return task.done;
    return !task.done;
  });

  const completedTasksCount = tasks.filter(task => task.done).length;
  const progress = tasks.length ? (completedTasksCount / tasks.length) * 100 : 0;

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 2000);
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      done: false,
      priority: priority,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskTitle('');
    showNotification('Task added successfully!', 'success');
  };

  const handleToggleComplete = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
    const taskStatus = tasks.find(task => task.id === id)?.done ? 'pending' : 'completed';
    showNotification(`Task marked as ${taskStatus}!`, 'success');
  };

  const handleDeleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    showNotification('Task deleted successfully!', 'success');
  };

  const handleEditTask = (id, newTitle) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    showNotification('Task updated successfully!', 'success');
  };

  const handleThemeToggle = () => {
    document.body.classList.toggle('dark');
    setIsDarkTheme(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const showNotification = (message, type) => {
    setShowSuccessMessage({ active: true, message: message });
    setTimeout(() => {
      setShowSuccessMessage({ active: false, message: '' });
    }, 2000);
  };

  return (
    <div className="container">
      <div className="heading">
        <h1><i className="fas fa-tasks"></i> Task Manager</h1>
        <div className="header-actions">
          <span className="task-count">{filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}</span>
          <button id="theme-toggle" className="theme-toggle" title="Toggle theme" onClick={handleThemeToggle}>
            <i className={`fas fa-${isDarkTheme ? 'sun' : 'moon'}`}></i>
          </button>
        </div>
      </div>
      <div className="progress-bar">
        <div id="progress" className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="input-area">
        <input
          type="text"
          id="new-task"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          className={showErrorMessage ? 'error' : ''}
        />
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button id="add-btn" onClick={handleAddTask}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="message-area">
        <span className={`error-message ${showErrorMessage ? 'active' : ''}`} id="error-message">Task cannot be empty!</span>
        <span className={`success-message ${showSuccessMessage.active ? 'active' : ''}`} id="success-message">{showSuccessMessage.message}</span>
      </div>
      <div className="filter-area">
        <button data-filter="all" className={`filter ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All</button>
        <button data-filter="pending" className={`filter ${currentFilter === 'pending' ? 'active' : ''}`} onClick={() => setCurrentFilter('pending')}>Pending</button>
        <button data-filter="done" className={`filter ${currentFilter === 'done' ? 'active' : ''}`} onClick={() => setCurrentFilter('done')}>Completed</button>
      </div>
      <ul id="tasks">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        ))}
      </ul>
      {filteredTasks.length === 0 && (
        <div className="no-task-msg" id="no-tasks" style={{ display: 'block' }}>No tasks yet. Start by adding one! 🚀</div>
      )}
    </div>
  );
};

export default App;