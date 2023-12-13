const mysql = require("mysql2");
const winston = require("winston");
const path = require("path");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});
const ENV = require("dotenv");
ENV.config({ path: path.resolve(__dirname, "../.env") });

/* global process */

/**
 * Initializes and configures the MySQL database connection pool.
 * @type {Pool}
 */
const pool = mysql.createPool({
  host: process.env.HOSTNAME,
  user: process.env.USERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASENAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const updateAltTextFlag = async (fileName, altTag) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE Images SET alt_text = ?, flag = 1 WHERE image_id = ?",
      [altTag, fileName],
      (error) => {
        if (error) {
          logger.error("Error updating ALT tag:", error);
          return reject(error);
        }
        resolve();
      }
    );
  });
};

const retrievePostId = async (fileName) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT post_id FROM Images WHERE image_id = ?",
      [fileName],
      (selectError, selectResults) => {
        if (selectError) {
          logger.error("Error retrieving post ID:", selectError);
          return reject(selectError);
        }
        const postId = selectResults[0] ? selectResults[0].post_id : null;
        resolve(postId);
      }
    );
  });
};

const closeConnection = () => {
  pool.end((err) => {
    if (err) {
      logger.error("Error closing MySQL connection pool:", err);
    } else {
      logger.info("MySQL connection pool closed.");
    }
  });
};

module.exports = { updateAltTextFlag, retrievePostId, closeConnection };
