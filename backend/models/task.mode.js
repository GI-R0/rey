const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // Nombre/Título de la tarea
    name: {
        type: String,
        required: true, 
        trim: true,
        maxlength: 100 // 💡 MEJORA: Límite de caracteres
    },
    // Descripción detallada de la tarea (Ahora opcional)
    text: {
        type: String,
        required: false, // 💡 MEJORA: Ya no es obligatorio
        trim: true
    },
    // Estado de la tarea
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Done', 'Progress'], 
        default: 'Pending'
    }
}, {
    timestamps: true 
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
