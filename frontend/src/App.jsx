import './App.css';
import { useState, useEffect } from 'react';
import Task from './components/Task/Task';
import TaskForm from './components/TaskForm/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/tasks');
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <main id="root">
      <h1>Mis Tareas</h1>

      {loading ? <p className="loading">Cargando...</p>
        : tasks.length === 0 ? <h3 className="no-tasks">Crea una tarea para empezar</h3>
        : <div className="task-container">
            {tasks.map(t => <Task key={t._id} task={t} setTasks={setTasks} />)}
          </div>}

      {showForm && <TaskForm setTasks={setTasks} setShowForm={setShowForm} />}
      <button onClick={() => setShowForm(true)} className="create-button">+</button>
    </main>
  );
}

export default App;
