import { useRef } from 'react';
import './TaskForm.css';

export default function TaskForm({ setTasks, setShowForm }) {
  const nameRef = useRef(null);
  const textRef = useRef(null);
  const statusRef = useRef(null);

  const createTask = async (e) => {
    e.preventDefault();

    const newTask = {
      name: nameRef.current.value.trim(),
      text: textRef.current.value.trim(),
      status: statusRef.current.value,
    };

    if (!newTask.name || !newTask.text) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Error al crear la tarea');

      const createdTask = await response.json();

      setTasks((prev) => [...prev, createdTask]);
      nameRef.current.value = '';
      textRef.current.value = '';
      statusRef.current.value = 'Pending';
      alert('Tarea creada con éxito 🎉');

      // ✅ Cierra el formulario después de crear
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      alert('Hubo un error al crear la tarea.');
    }
  };

  return (
    <form className="task-form" onSubmit={createTask}>
      <div className="task-input">
        <label htmlFor="name">Nombre de la tarea</label>
        <input ref={nameRef} type="text" id="name" placeholder="Nombre..." />
      </div>

      <div className="task-input">
        <label htmlFor="text">Tarea</label>
        <textarea ref={textRef} id="text" placeholder="Tarea..."></textarea>
      </div>

      <div className="task-input">
        <select defaultValue="Pending" ref={statusRef} className="status-task">
          <option value="Pending">Pendiente</option>
          <option value="Progress">En progreso</option>
          <option value="Done">Completada</option>
        </select>
      </div>

      <button type="submit" className="create-task">
        Crear
      </button>
    </form>
  );
}
