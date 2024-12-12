const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');

// Connect to SQLite database
const db = new sqlite3.Database('./dormitoryDB.db', (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Helper Function to Send JSON Response
const sendJSON = (res, status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

// Create Server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    // Handle Routes
    if (req.method === 'GET') {
        // 1. Get Dormitories with Filters
        if (parsedUrl.pathname === '/dormitories') {
            let sql = "SELECT * FROM Dormitory WHERE 1=1";
            const params = [];

            if (query.priceMin) {
                sql += " AND price >= ?";
                params.push(query.priceMin);
            }
            if (query.priceMax) {
                sql += " AND price <= ?";
                params.push(query.priceMax);
            }
            if (query.location) {
                sql += " AND location LIKE ?";
                params.push(`%${query.location}%`);
            }

            db.all(sql, params, (err, rows) => {
                if (err) {
                    sendJSON(res, 500, { error: err.message });
                } else {
                    sendJSON(res, 200, rows); // Responding with the rows in JSON format
                }
            });
        }

        // Route Not Found
        else {
            sendJSON(res, 404, { error: "Route not found" });
        }
    } else {
        sendJSON(res, 405, { error: "Method not allowed" });
    }
});

// Start Server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
