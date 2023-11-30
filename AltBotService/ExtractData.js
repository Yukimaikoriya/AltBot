const mysql = require("mysql2"); // Need to change
const util = require("util");

// Create a MySQL connection

/**
 * Establishes a MySQL database connection.
 * @type {mysql.Connection}
 */
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '',
});

// let read_data

const query = util.promisify(con.query).bind(con);

/**
 * Asynchronously retrieves data from the 'Images' table in the MySQL database.
 * @async
 * @function getDataFromDatabase
 * @returns {Promise<Array>} A promise that resolves to the array of data retrieved from the 'Images' table.
 * @throws {Error} Throws an error if there is an issue in executing the query or connecting to the database.
 */
async function getDataFromDatabase() {
  try {
    const sql = "SELECT * FROM Images";
    const result = await query(sql);
    console.log("Data Read:");
    con.end();
    return result;
  } catch (error) {
    console.error("Error:", error);
    con.end();
    throw error;
  }
}

module.exports = getDataFromDatabase;
