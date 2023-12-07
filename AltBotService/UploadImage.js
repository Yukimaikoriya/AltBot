const Mastodon = require("mastodon-api");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const winston = require("winston");

/* global process */

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

logger.info("Image Bot Started");

const ENV = require("dotenv");
ENV.config();

/**
 * Initializes and configures the Mastodon API client.
 * @type {Mastodon}
 */
const M = new Mastodon({
  client_key: process.env.CLIENT_KEY,
  client_secret: process.env.CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  timeout_ms: parseInt(process.env.TIMEOUT_MS, 10),
  api_url: process.env.API_URL,
});

const ServerAddress = process.env.SERVER_ADDRESS;
const folderPath = process.env.FOLDER_PATH; // Replace with your actual folder path

/**
 * Reads files from the specified folder and posts them to Mastodon.
 * For each image file, it sends a request to an ML model endpoint to generate an ALT tag,
 * then uploads the image to Mastodon with the generated ALT tag.
 *
 * @param {string} folderPath - The path to the folder containing image files.
 */
fs.readdir(folderPath, (err, files) => {
  if (err) {
    logger.error("Error reading folder:", err);
    return;
  }

  logger.info(`Found ${files.length} files in the folder.`);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
      logger.info(`Processing file: ${file}`);

      // Call ML model here to pass real description (ALT Tag)
      const fileData = fs.readFileSync(filePath, { encoding: "base64" });
      axios
        .post(`${ServerAddress}/alt_model_endpoint`, { file: fileData })
        .then((response) => {
          logger.info("ML Model response:", response.data);

          M.post("media", {
            file: fs.createReadStream(filePath),
            description: JSON.stringify(response.data.alt_tag),
          })
            .then((resp) => {
              const id = resp.data.id;
              logger.info(`Media uploaded successfully with ID: ${id}`);

              // Post a status for each uploaded image
              M.post("statuses", { status: "#ALTBOT", media_ids: [id] })
                .then(() => {
                  logger.info("Status posted successfully.");
                })
                .catch((statusError) => {
                  logger.error("Error posting status:", statusError);
                });
            })
            .catch((uploadError) => {
              logger.error("Error uploading media:", uploadError);
            });
        })
        .catch((modelError) => {
          logger.error("Error from ML model:", modelError);
        });
    }
  });
});
