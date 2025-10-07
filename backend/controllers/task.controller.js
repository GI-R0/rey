import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    try {
        // Devuelve el array directamente, práctica común.
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener tareas', error: err.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        // Mongoose usa un error específico para validación (ej. falta campo requerido)
        res.status(400).json({ message: 'Error al crear tarea. Datos inválidos.', error: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        
        // 🛑 CORRECCIÓN: Manejar caso 404 Not Found si el ID no existe
        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json(updatedTask);
    } catch (err) {
        // Un ID con formato incorrecto también puede generar un error 500
        res.status(500).json({ message: 'Error al actualizar tarea', error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Task.findByIdAndDelete(id);

        // 🛑 CORRECCIÓN: Manejar caso 404 Not Found si el ID no existe
        if (!result) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar tarea', error: err.message });
    }
};
