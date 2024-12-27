const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const DATA_FILE = "data.json";

const cors = require("cors");
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Read data
app.get("/api/data", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data" });
        }
        res.json(JSON.parse(data || "[]"));
    });
});

// Add data
app.post("/api/data", (req, res) => {
    const newData = req.body;
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data" });
        }
        const currentData = JSON.parse(data || "[]");
        currentData.push(newData);
        fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: "Error writing data" });
            }
            res.status(201).json(newData);
        });
    });
});

// Update data
app.put("/api/data/:id", (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data" });
        }
        let currentData = JSON.parse(data || "[]");
        currentData = currentData.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item
        );
        fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: "Error writing data" });
            }
            res.json(updatedData);
        });
    });
});

// Delete data
app.delete("/api/data/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error reading data" });
        }
        const currentData = JSON.parse(data || "[]").filter((item) => item.id !== id);
        fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: "Error writing data" });
            }
            res.status(204).send();
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
