require('dotenv').config();

const app = require('./index');
const connectDB = require('./config/connectDb');

const PORT = process.env.PORT || 3000;

// Validar variable de entorno MONGO_URI
if (!process.env.MONGO_URI) {
    console.error('Falta la variable de entorno MONGO_URI');
    process.exit(1);
}

connectDB()
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT} 🚀`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1);
    });