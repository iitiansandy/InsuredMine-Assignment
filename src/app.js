
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index.js");
const connectDB = require("./dbConfig/db.config.js");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { startCPUMonitor } = require("./utils/cpuMonitor");
const { startMessageCron } = require("./cron/message.cron");
const dotenv = require('dotenv');
dotenv.config();

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

const app = express();
app.use(express.json());

app.use("/api", routes);

// Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    })
);

// HTTP Strict Transport Security (HSTS)
app.use(
    helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    })
);

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});

app.use(limiter);

app.get("/", (req, res) => {
    res.send("<h1>Policy Management Backend is Up and Running</h1>");
});

const port = process.env.PORT || 3000;

// Last middleware if any error comes
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log('App is running on port', port);
    // logger.info('Server started on port ' + port, { meta: { timestamp: new Date().toISOString() } });
    connectDB();
    // Start cron AFTER DB is connected
    startMessageCron();
    // Start CPU monitoring
    startCPUMonitor(70);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    // Close the server and exit the process
    server.close(() => {
        process.exit(1);
    });
});

// Handling process termination signals for graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Handling process interruption signals for graceful shutdown
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
