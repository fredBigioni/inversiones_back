const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000' // URL de tu frontend
}));

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Ruta de prueba para agregar un documento
app.post('/add', async (req, res) => {
    try {
        const data = req.body;
        const docRef = await db.collection('usuarios').add(data);
        res.status(200).send(`Documento añadido con ID: ${docRef.id}`);
    } catch (error) {
        console.error("Error al añadir documento: ", error);
        res.status(500).send("Error al añadir documento");
    }
});

// Ruta de prueba para obtener documentos
app.get('/usuarios', async (req, res) => {
    try {
        const snapshot = await db.collection('usuarios').get();
        const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener documentos: ", error);
        res.status(500).send("Error al obtener documentos");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
