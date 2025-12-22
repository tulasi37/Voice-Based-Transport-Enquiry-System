const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/query', (req, res) => {
    const voiceText = req.body.text.toLowerCase();

    const sql = `SELECT * FROM Transport WHERE LOWER(route) LIKE ? LIMIT 1`;
    db.query(sql, [`%${voiceText}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ message: "No transport found" });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
