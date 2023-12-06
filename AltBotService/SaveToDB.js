const getImageList = require("./ReadDataTimeline");
const mysql = require("mysql2/promise");
const ENV = require("dotenv");
const winston = require("winston");
const { format } = winston;

ENV.config();

/* global process */

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

/**
 * @typedef {Object} PoolConfig
 * @property {string} host - The hostname or IP address of the MySQL server.
 * @property {string} user - The MySQL user to authenticate as.
 * @property {string} password - The password of that MySQL user.
 * @property {string} database - Name of the MySQL database to use for this connection.
 * @property {boolean} [waitForConnections=true] - Determines whether the pool should automatically establish connections.
 *    If true, the pool will queue the connection request and automatically establish a connection when one becomes available.
 * @property {number} [connectionLimit=10] - The maximum number of connections to create at once.
 * @property {number} [queueLimit=0] - The maximum number of connection requests the pool should queue
 *    when all connections are in use.
 */

/**
 * @typedef {Object} MySQLPool
 * @property {function} acquire - Acquires a connection from the pool.
 * @property {function} beginTransaction - Begins a transaction.
 * @property {function} commit - Commits a transaction.
 * @property {function} execute - Executes a query.
 * @property {function} query - Executes a query.
 * @property {function} release - Releases a connection back to the pool.
 */

/**
 * A pool of MySQL connections for handling multiple simultaneous database queries.
 * @type {MySQLPool}
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

/**
 * Retrieves existing image IDs from the MySQL database.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of existing image IDs.
 */
async function getExistingImageIds() {
  const [rows] = await pool.query("SELECT image_id FROM Images");
  return rows.map((row) => row.image_id);
}

/**
 * Inserts a new image record into the MySQL database.
 *
 * @param {string} imageId - The unique identifier of the image.
 * @param {string} imageUrl - The URL of the image.
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function insertNewImage(imageId, imageUrl) {
  const flag = 0;
  const sql = "INSERT INTO Images (image_id, image_url, flag) VALUES (?, ?, ?)";
  const values = [imageId, imageUrl, flag];
  await pool.query(sql, values);
  logger.info(`Inserted new record with image_id: ${imageId}`);
}

/**
 * Main function to fetch image data, compare with existing data, and insert new records.
 *
 * @returns {Promise<void>} A promise that resolves once the operation is complete.
 */
async function main() {
  try {
    const connection = await pool.getConnection();
    logger.info("Connected!");

    const existingImageIds /** @type {string[]} */ =
      await getExistingImageIds();

    const imageList /** @type {Image[]} */ = await getImageList();

    const newImages = imageList.filter(
      ({ imageId }) => !existingImageIds.includes(imageId)
    );

    for (const { imageUrl, imageId } of newImages) {
      await insertNewImage(imageId, imageUrl);
    }

    connection.release();
    logger.info("MySQL connection released.");
  } catch (error) {
    logger.error(`Error in database.js: ${error.message}`);
    console.error("Error in database.js:", error);
  } finally {
    await pool.end();
    logger.info("Connection pool closed.");
  }
}

main();
