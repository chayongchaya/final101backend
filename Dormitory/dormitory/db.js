const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./dormitoryDB.db', (err) => {
    if (err) {
        console.error("Error connecting to SQLite:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Example: Fetch all tables
db.serialize(() => {
    db.each("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log("Table:", row.name);
        }
    });
});

// Close the database connection when done
db.close((err) => {
    if (err) {
        console.error("Error closing SQLite:", err.message);
    } else {
        console.log("Database connection closed.");
    }
});
