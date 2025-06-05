import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEditChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onEdit(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li className={`${task.done ? 'done' : ''} priority-${task.priority}`}>
      {isEditing ? (
        <input
          type="text"
          className="edit-input active"
          value={editedTitle}
          onChange={handleEditChange}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="task-text" onClick={() => setIsEditing(true)}>
          {task.title}
        </span>
      )}
      <div>
        <button className="complete-btn" onClick={() => onToggleComplete(task.id)}>
          <i className={`fas fa-${task.done ? 'undo' : 'check'}`}></i>
        </button>
        <button className="edit-btn" onClick={() => setIsEditing(true)}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default TaskItem;