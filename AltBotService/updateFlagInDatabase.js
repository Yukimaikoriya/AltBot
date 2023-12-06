const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
const ENV = require("dotenv");
const util = require("util");

ENV.config();

/* global process */

/**
 * Establishes a MySQL database connection.
 * @type {mysql.Connection}
 */
const con = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.USERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASENAME,
});

const query = util.promisify(con.query).bind(con);

/**
 * Reads files from the specified folder and updates the Flag attribute to 1 in the database.
 */
function updateDatabase() {
  const folderPath = process.env.FOLDER_PATH;

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      if (
        fs.statSync(filePath).isFile() &&
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      ) {
        // Filename corresponds to the image_id in the database
        const filenameWithoutExtension = path.parse(file).name;

        try {
          const sql = "UPDATE Images SET Flag = 1 WHERE image_id = ?";
          await query(sql, [filenameWithoutExtension]);
          console.log(`Updated database for file: ${filePath}`);
        } catch (error) {
          console.error(`Error updating database for file: ${filePath}`, error);
        }
      }
    }

    // Close the database connection
    con.end();
  });
}

// Run the function
updateDatabase();
