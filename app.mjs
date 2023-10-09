import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static('views'));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/inicio.html');
// });

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/views/game.html'); 
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});