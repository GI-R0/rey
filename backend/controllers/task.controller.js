import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

export const createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear tarea' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};
