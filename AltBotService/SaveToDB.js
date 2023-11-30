// DATABASE altbot_test_database
const getImageList = require("./ReadDataTimeline");
const mysql = require("mysql2"); // Need to change

/**
 * Establishes a connection to the MySQL database.
 * @type {mysql.Connection}
 */
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'onkar123',
  database: 'altbot_test_database',
});

// const url = 'https://www.youtube.com/results?search_query=mysql+js'
// const id = '3'

/**
 * Retrieves a list of images and inserts each into the MySQL database.
 * The function fetches image data using `getImageList`, then iterates over
 * this data to store each image's details in the database.
 * 
 * @function
 */
getImageList()
  .then((imageList) => {
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");

      imageList.forEach(({ imageUrl, imageId }) => {
        const flag = 0;
        const sql = `INSERT INTO Images (image_id, image_url, flag) VALUES ('${imageId}', '${imageUrl}' , '${flag}')`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });

      con.end((error) => {
        if (error) {
          console.error("Error closing MySQL connection:", error);
          return;
        }

        console.log("MySQL connection closed.");
      });
    });
  })
  .catch((error) => {
    console.error("Error in database.js:", error);
  });
