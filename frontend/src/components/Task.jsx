import { useState } from 'react';
import './Task.css';
import TaskForm from '../TaskForm/TaskForm';

export default function Task({ task, setTasks }) {
  const [editing, setEditing] = useState(false);

  const deleteTask = async () => {
    if (!confirm(`¿Eliminar "${task.name}"?`)) return;
    try {
      await fetch(`http://localhost:3000/tasks/${task._id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t._id !== task._id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar tarea');
    }
  };

  return (
    <div className="task">
      {editing ? (
        <TaskForm task={task} setTasks={setTasks} setShowForm={setEditing} editing />
      ) : (
        <>
          <h4 className="task-name">{task.name}</h4>
          <p className="task-text">{task.text}</p>
          <p className={`task-status ${task.status}`}>{task.status}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={deleteTask} className="delete-task">Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
}
