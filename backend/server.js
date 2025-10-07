require('dotenv').config();

const app = require('./index');
const connectDB = require('./config/connectDb'); // Función que usa process.env.DB_URL

const PORT = process.env.PORT || 3000;

// 🛑 Corrección para usar DB_URL y asegurar coherencia con connectDb.js
if (!process.env.DB_URL) {
    console.error('Falta la variable de entorno DB_URL');
    process.exit(1);
}

connectDB()
    .then(() => {
        // El mensaje de conexión DB se imprime dentro de connectDB,
        // pero puedes dejarlo aquí si quieres.
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT} 🚀`);
        });
    })
    .catch((error) => {
        // Este catch ya no debería ser necesario si connectDB ya usa process.exit(1),
        // pero es una buena capa de seguridad.
        console.error('Error al iniciar la aplicación:', error.message);
        process.exit(1);
    });
