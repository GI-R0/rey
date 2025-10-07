import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

// Componente para manejar la creación y edición de tareas
function TaskForm({ task, setTasks, setShowForm, isEditing }) {
  // 1. Inicializar el estado del formulario usando la tarea existente si estamos editando
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    status: 'Pending',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // 2. Cargar datos de la tarea al montar si estamos editando
  useEffect(() => {
    if (isEditing && task) {
      setFormData({
        name: task.name,
        text: task.text,
        status: task.status,
      });
    }
  }, [isEditing, task]);

  // Manejador genérico para todos los campos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(null); // Limpiar error al empezar a escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.text) {
      setErrorMsg('Por favor, completa el nombre y la descripción de la tarea.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const method = isEditing ? 'PATCH' : 'POST';
    // 🛑 Corrección: Usar URL relativa y el ID para edición
    const url = isEditing ? `/tasks/${task._id}` : '/tasks'; 

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Fallo en la ${isEditing ? 'actualización' : 'creación'} de la tarea.`);
      }

      const responseTask = await response.json();
      
      // Actualizar el estado global de tareas (setTasks)
      if (isEditing) {
        // Reemplazar la tarea editada en el array de estado
        setTasks((prev) => 
          prev.map((t) => (t._id === responseTask._id ? responseTask : t))
        );
      } else {
        // Añadir la nueva tarea al inicio del array de estado
        setTasks((prev) => [responseTask, ...prev]);
        setFormData({ name: '', text: '', status: 'Pending' }); // Limpiar formulario de creación
      }
      
      // 💡 Corrección: Cierra el formulario o modal después del éxito
      setShowForm(false);
    } catch (error) {
      console.error('Error de API:', error);
      setErrorMsg(`❌ Hubo un error al ${isEditing ? 'editar' : 'crear'} la tarea.`);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pendiente' },
    { value: 'Progress', label: 'En progreso' },
    { value: 'Done', label: 'Completada' },
  ];

  const title = isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea';
  const buttonText = isEditing ? 'Guardar Cambios' : 'Crear Tarea';

  return (
    <div className={`p-6 rounded-xl shadow-2xl transition-all duration-300 ${isEditing ? 'bg-indigo-50 border-indigo-400' : 'bg-green-50 border-green-400'} border-2`}>
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex justify-between items-center">
        {title}
        <button 
          onClick={() => setShowForm(false)} 
          className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          <X size={20} />
        </button>
      </h3>
      
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Nombre de la Tarea */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Título de la tarea (máx. 100 caracteres)"
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
            disabled={loading}
          />
        </div>

        {/* Descripción / Cuerpo de la Tarea */}
        <div className="mb-4">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Detalles de la tarea..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            required
            disabled={loading}
          ></textarea>
        </div>

        {/* Estado */}
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
            disabled={loading}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        {/* Botón de Envío */}
        <button
          type="submit"
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 text-lg font-semibold rounded-lg transition-colors ${loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : (isEditing ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-green-600 hover:bg-green-700 text-white shadow-md')}`}
          disabled={loading}
        >
          {loading ? (
            'Procesando...'
          ) : (
            <>
              {isEditing ? <Save size={20} /> : <Plus size={20} />}
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Exportamos solo el componente App como default, incluyendo TaskForm para la demostración
// NOTE: El resto del código de Task.jsx (Task, ConfirmModal, etc.) iría aquí
// Para simplificar, solo exportaremos App y TaskForm
export const App = () => {
    const [tasks, setTasks] = useState([
        { _id: '1', name: 'Comprar leche', text: 'Leche entera y descremada.', status: 'Pending' },
    ]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-12 font-sans antialiased">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Formulario de Tareas</h1>
                
                {/* Botón para mostrar el formulario de creación */}
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Nueva Tarea</span>
                    </button>
                </div>

                {/* Mostrar el formulario de creación en un modal improvisado */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="w-full max-w-lg">
                            <TaskForm 
                                setTasks={setTasks} 
                                setShowForm={setShowCreateForm} 
                                isEditing={false} 
                            />
                        </div>
                    </div>
                )}
                
                {/* Renderizar la lista (Mock de Tasks) */}
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Tareas Existentes (Mock)</h2>
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-gray-300">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task._id} className="border-b last:border-b-0 py-2">
                                <p className="font-semibold">{task.name}</p>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800`}>
                                    {task.status}
                                </span>
                                {/* Aquí iría el componente Task para mostrar edición/eliminación real */}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay tareas. ¡Crea una!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Exportamos App como el componente principal, incluyendo TaskForm para la demostración
export default App;
