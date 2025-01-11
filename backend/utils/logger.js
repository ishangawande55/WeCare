// utils/logger.js
const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Minimum log level to log
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Logs to console
    new winston.transports.File({ filename: 'logs/combined.log' }), // Logs to a file
  ],
});

// Export the logger instance for usage in other files
module.exports = logger;