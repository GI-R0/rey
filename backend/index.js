import 'dotenv/config'; // Usamos import 'dotenv/config' para proyectos ES6

import app from './index.js'; // Importamos la aplicación configurada
import connectDB from './config/connectDb.js'; // Asegúrate de cambiar el require a import si usas ES6

const PORT = process.env.PORT || 3000;

// Validar variable de entorno DB_URL (el nombre que usamos en connectDb.js)
if (!process.env.DB_URL) {
    console.error('🛑 Falta la variable de entorno DB_URL en el archivo .env');
    process.exit(1);
}

// 1. Conecta a la base de datos
connectDB()
    .then(() => {
        // 2. Si la conexión es exitosa, inicia el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        // El error ya lo maneja connectDB, pero lo mantenemos por si acaso
        console.error('❌ Error al iniciar la aplicación:', error.message);
        process.exit(1);
    });
