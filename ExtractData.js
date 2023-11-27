const mysql = require('mysql2') // Need to change
const util = require('util')

// Create a MySQL connection

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'altbot_test_database'
})

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

const query = util.promisify(con.query).bind(con)

async function getDataFromDatabase () {
  try {
    const sql = 'SELECT * FROM Images'
    const result = await query(sql)

    console.log('Data Read:')
    con.end()
    return result
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

module.exports = getDataFromDatabase
