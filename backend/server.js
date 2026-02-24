import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/query", (req, res) => {
    try {
        const voiceText = req.body.text;

        if (!voiceText) {
            return res.status(400).json({ message: "Voice input required" });
        }

        const cleanText = voiceText
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .trim();

const parts = cleanText.split(/\s+to\s+/);

if (parts.length !== 2) {
    return res.status(400).json({
        message: "Say like: Guntur to Hyderabad"
    });
}

        const source = parts[0].trim();
        const destination = parts[1].trim();

        console.log("Searching:", source, "→", destination);

        const sql = `
            SELECT source, destination, departure_time, arrival_time
            FROM buses
            WHERE LOWER(source) = ?
            AND LOWER(destination) = ?
            LIMIT 1
        `;

        db.query(sql, [source, destination], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.json({ message: "No traveling available" });
            }

            res.json(results[0]);
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});