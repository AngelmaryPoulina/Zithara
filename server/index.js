const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Angel123',
    port: 5432,
});
pool.connect();
app.use(express.json());
app.get('/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
    pool.end;
});

 app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
 });

