const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
// Middleware to parse JSON body
app.use(express.json());
// Middleware to parse URL-encoded body (form data)
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.send('OK');
});

// In-memory storage (object where keys will store data along with timestamps)
let memoryDatabase = {};

// POST endpoint to receive and store JSON data with a key
app.post("/api/data/:key", (req, res) => {
    const {key} = req.params; // Get key from the URL parameters
    const data = JSON.stringify(req.body);
    console.log(data);

    // Store data along with the current timestamp
    memoryDatabase[key] = {
        data: data,
        timestamp: Date.now() // Store the current time in milliseconds
    };

    res.status(200).send(`Data saved in memory for key: ${key}`);
});

// GET endpoint to retrieve data by key from memory
app.get("/api/data/:key", (req, res) => {
    const {key} = req.params; // Get key from the URL parameters

    if (memoryDatabase[key]) {
        const entry = memoryDatabase[key];
        res.status(200).json(JSON.parse(entry.data)); // Return the stored data
    } else {
        res.status(404).send(`No data found for key: ${key}`);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Periodic cleanup function to remove data older than 1 hour
function cleanupOldData() {
    const oneHour = 60 * 60 * 1000; // One hour in milliseconds
    const now = Date.now();

    Object.keys(memoryDatabase).forEach(key => {
        const entry = memoryDatabase[key];
        // Check if the data is older than 1 hour
        if (now - entry.timestamp > oneHour) {
            delete memoryDatabase[key];
            console.log(`Data for key: ${key} has been cleared after 1 hour`);
        }
    });
}

// Schedule the cleanup function to run every minute
setInterval(cleanupOldData, 60 * 1000); // Run every 60 seconds

// Server initialization
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
