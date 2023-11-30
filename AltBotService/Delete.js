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
