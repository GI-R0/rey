import React, { useState } from 'react';
import { Trash2, Edit, X } from 'lucide-react'; // Íconos de lucide-react (asumidos disponibles)

// Componente para reemplazar el uso de window.confirm()
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
      <p className="text-gray-700 font-semibold mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Confirmar Eliminación
        </button>
      </div>
    </div>
  </div>
);

// --- Componente de Formulario (MOCK para que el código compile) ---
// En una aplicación real, TaskForm sería un componente complejo para editar.
const TaskForm = ({ task, setTasks, setShowForm, editing }) => (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h5 className="font-bold text-lg text-yellow-700">
            {editing ? 'Editando Tarea: ' : 'Creando Tarea: '}
            {task ? task.name : ''}
        </h5>
        <p className="text-sm text-yellow-600 mb-4">
            (Mock de TaskForm - El formulario real debería ir aquí)
        </p>
        <button
            onClick={() => setShowForm(false)}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
            Cerrar Edición
        </button>
    </div>
);
// --- FIN MOCK ---


// Componente principal de Tarea (Se elimina el export default para evitar el conflicto)
function Task({ task, setTasks }) {
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDelete = () => {
    // 🛑 Corrección 1: Usar modal de confirmación en lugar de window.confirm()
    setShowConfirm(true);
  };

  const deleteTask = async () => {
    setShowConfirm(false); // Ocultar el modal de confirmación
    setErrorMsg(''); // Limpiar errores anteriores

    try {
      // 🛑 Corrección 2: Usar URL relativa '/tasks/' si el frontend y backend 
      // están en el mismo host/puerto. Esto hace que el código sea más portable.
      const response = await fetch(`/tasks/${task._id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Error en la API al eliminar');
      }

      // Actualizar el estado para eliminar la tarea de la lista
      setTasks(prev => prev.filter(t => t._id !== task._id));

    } catch (err) {
      console.error(err);
      // 🛑 Corrección 1: Usar mensaje de estado en lugar de window.alert()
      setErrorMsg('❌ Error al eliminar la tarea. Revisa la consola.');
    }
  };

  // Mapeo de estilos Tailwind para el estado
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Done: 'bg-green-100 text-green-800 border-green-300',
    Progress: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500 mb-4">
      
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 flex justify-between items-center">
            {errorMsg}
            <button onClick={() => setErrorMsg('')} className="text-red-700 hover:text-red-900">
                <X size={16} />
            </button>
        </div>
      )}

      {editing ? (
        // Asumiendo que TaskForm maneja su propia lógica de guardar y cerrar
        <TaskForm task={task} setTasks={setTasks} setShowForm={setEditing} editing />
      ) : (
        <>
          <h4 className="text-2xl font-bold text-gray-800 mb-1">{task.name}</h4>
          <p className="text-gray-600 mb-3">{task.text}</p>
          
          <p className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${statusStyles[task.status] || 'bg-gray-100 text-gray-800'}`}>
            {task.status}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-3">
            <button 
              onClick={() => setEditing(true)}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Edit size={16} />
              <span>Editar</span>
            </button>
            <button 
              onClick={handleDelete} 
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} />
              <span>Eliminar</span>
            </button>
          </div>
        </>
      )}

      {showConfirm && (
        <ConfirmModal 
          message={`¿Estás seguro de que quieres eliminar la tarea "${task.name}"?`}
          onConfirm={deleteTask}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// Exportamos App como el componente principal, requerido por Canvas para renderizar
export const App = () => {
    // Mock de datos y estado para la previsualización
    const [tasks, setTasks] = useState([
        { _id: '1', name: 'Revisar Código Backend', text: 'Verificar la coherencia de MONGO_URI y DB_URL.', status: 'Done' },
        { _id: '2', name: 'Diseñar TaskForm', text: 'Crear el formulario de edición y creación de tareas.', status: 'Progress' },
        { _id: '3', name: 'Comprar Viveres', text: 'Leche, pan, huevos y queso.', status: 'Pending' }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-12 font-sans antialiased">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Lista de Tareas (Frontend)</h1>
                <div className="grid gap-6">
                    {tasks.map(task => (
                        <Task key={task._id} task={task} setTasks={setTasks} />
                    ))}
                </div>
                
                <div className="mt-10 p-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg">
                    <p className="font-semibold">Nota Importante:</p>
                    <p className="text-sm">
                        Para que la eliminación funcione realmente, el backend debe estar corriendo en el mismo host.
                        Se ha corregido el uso de `window.confirm()` y se usa ahora un modal.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Requerido por el entorno de Canvas
export default App; 
