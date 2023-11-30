const mysql = require("mysql2"); // Need to change
const util = require("util");

// Create a MySQL connection

/**
 * Establishes a MySQL database connection.
 * @type {mysql.Connection}
 */
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "altbot_test_database",
});

// let read_data

// con.connect(function(err) {
//     if (err) throw err;
//     else {console.log("Connected!");}

//     var sql = `SELECT * FROM Images`;
//     con.query(sql, function (err, result, fields) {
//         if (err) throw err;
//         console.log("Data Read");
//         read_data = result;
//         // console.log(read_data);
//         });

//     console.log(read_data)

//     con.end((error) => {
//     if (error) {
//         console.error('Error closing MySQL connection:', error);
//         return;
//     }
//     else {console.log('MySQL connection closed.');}
//     });
// });

// Promisify the query function for async/await usage
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
    throw error;
  }
}

module.exports = getDataFromDatabase;
