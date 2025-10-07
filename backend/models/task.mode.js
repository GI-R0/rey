const mongoose = require('mongoose');

// Definimos el Esquema (Schema) de cómo debe lucir una Tarea
const taskSchema = new mongoose.Schema({
    // Nombre/Título de la tarea
    name: {
        type: String,
        required: true, // Obligatorio
        trim: true
    },
    // Descripción detallada de la tarea
    text: {
        type: String,
        required: true, // Obligatorio
        trim: true
    },
    // Estado de la tarea
    status: {
        type: String,
        required: true, // Obligatorio
        // Solo permite estos tres valores:
        enum: ['Pending', 'Done', 'Progress'], 
        default: 'Pending' // Valor por defecto al crear
    }
}, {
    // Añade campos automáticos de 'createdAt' y 'updatedAt'
    timestamps: true 
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
