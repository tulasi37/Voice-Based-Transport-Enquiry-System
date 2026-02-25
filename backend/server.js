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

        // Clean input (supports Telugu Unicode range)
        const cleanText = voiceText
            .toLowerCase()
            .replace(/[^\w\u0C00-\u0C7F\s]/gi, "")
            .trim();

        let source = "";
        let destination = "";

        // 🔹 English pattern: Hyderabad to Guntur
        let englishMatch = cleanText.split(/\s+(?:to|two)\s+/);

        if (englishMatch.length === 2) {
            source = englishMatch[0].trim();
            destination = englishMatch[1].trim();
        } 
        // 🔹 Telugu pattern: హైదరాబాద్ నుండి గుంటూరు
        else if (cleanText.includes("నుండి")) {
            const parts = cleanText.split("నుండి");
            source = parts[0].trim();
            destination = parts[1].trim().replace("కి", "").trim();
        } 
        else {
            return res.status(400).json({
                message: "Could not detect source and destination"
            });
        }

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
                return res.json({ message: "No bus available" });
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