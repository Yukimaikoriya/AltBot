const getDataFromDatabase = require("./ExtractData");
const fs = require("fs");
const https = require("https");
const winston = require("winston");

// Configure Winston logger
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

/**
 * Fetches data from the database and downloads each image based on the URL provided.
 * Iterates through the dataset and calls downloadImage function for each image URL.
 */
getDataFromDatabase()
  .then((readData) => {
    readData.forEach(({ image_id, image_url, flag }) => {
      downloadImage(image_url, `OutputImages/${image_id}.png`)
        .then((filePath) => {
          logger.info(`Image downloaded successfully: ${filePath}`);
        })
        .catch((error) => {
          logger.error(`Error downloading image: ${error.message}`);
        });
    });
  })
  .catch((error) => {
    // Handle errors from the getDataFromDatabase function
    logger.error(`Error in getDataFromDatabase: ${error.message}`);
  });

/**
 * Downloads an image from a specified URL and saves it to the given filepath.
 *
 * @param {string} url - The URL of the image to be downloaded.
 * @param {string} filepath - The file path where the image will be saved.
 * @returns {Promise<string>} A promise that resolves to the file path if the download is successful, or rejects with an error.
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
}
