// const fs = require("fs");
// const path = require("path");
// const updateFlagInDatabase = require("./updateFlagInDatabase");
// const ENV = require("dotenv");
// ENV.config();
// const folderPath = process.env.FOLDER_PATH;

// /**
//  * Reads files from the specified folder, deletes each file, and sets the Flag attribute to 1 in the database.
//  */
// function updateDatabaseAndDeleteImages() {
//   fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       console.error("Error reading folder:", err);
//       return;
//     }

//     files.forEach((file) => {
//       const filePath = path.join(folderPath, file);

//       if (
//         fs.statSync(filePath).isFile() &&
//         /\.(jpg|jpeg|png|gif)$/i.test(file)
//       ) {
//         // Filename corresponds to the image_id in the database
//         const filenameWithoutExtension = path.parse(file).name;
//         updateFlagInDatabase(filenameWithoutExtension)
//           .then(() => {
//             console.log(`Updated file: ${filePath}`);
//           })
//           .catch((error) => {
//             console.error(
//               `Error updating database and deleting file: ${filePath}`,
//               error
//             );
//           });
//         fs.unlinkSync(filePath); // Delete the file
//         console.log(`Deleted file: ${filePath}`);
//       }
//     });
//   });
// }

// // Run the function
// updateDatabaseAndDeleteImages();

const fs = require("fs");
const path = require("path");
const ENV = require("dotenv");
ENV.config();

const folderPath = process.env.FOLDER_PATH;

/**
 * Deletes files from the specified folder.
 */
function deleteFiles() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      if (
        fs.statSync(filePath).isFile() &&
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      ) {
        fs.unlinkSync(filePath); // Delete the file
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });
}

// Run the function
deleteFiles();
