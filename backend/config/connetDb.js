const mongoose = require('mongoose');

// Función asíncrona para manejar la conexión con la base de datos
const connectDB = async () => {
    try {
        // Conexión a MongoDB. La URL se obtiene de process.env.DB_URL (archivo .env).
        // Las opciones de configuración obsoletas de Mongoose (como useNewUrlParser) han sido eliminadas.
        await mongoose.connect(process.env.DB_URL);
        
        console.log('Database connected 👍'); // Mensaje de éxito
    } catch (error) {
        // En caso de fallo de conexión (ej. MongoDB no está corriendo), 
        // mostramos el error y detenemos el proceso de Node.js.
        console.error('Error al conectar a la base de datos:', error.message);
        
        // 🚨 CRÍTICO: Detiene el servidor con un código de error (1), 
        // ya que la API no puede funcionar sin la DB.
        process.exit(1); 
    }
};

module.exports = connectDB;
