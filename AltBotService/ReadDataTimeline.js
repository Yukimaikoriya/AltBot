const Mastodon = require("mastodon-api");
const ENV = require("dotenv");
const winston = require("winston");

ENV.config();

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

/**
 * Logs the start of the Read Timeline Bot.
 */
logger.info("Read Timeline Bot Started");

/**
 * Initializes and configures the Mastodon API client.
 * @type {Mastodon}
 * @param {Object} config - The configuration object for Mastodon API.
 * @param {string} config.client_key - Client Key obtained from Mastodon.
 * @param {string} config.client_secret - Client Secret obtained from Mastodon.
 * @param {string} config.access_token - Access Token for authenticating with the Mastodon API.
 * @param {number} config.timeout_ms - Timeout for API requests in milliseconds.
 * @param {string} config.api_url - Base URL for the Mastodon API.
 */
const M = new Mastodon({
  client_key: process.env.CLIENT_KEY,
  client_secret: process.env.CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  timeout_ms: parseInt(process.env.TIMEOUT_MS, 10),
  api_url: process.env.API_URL,
});

/**
 * Asynchronously retrieves a list of images from the home timeline
 * where the images have no existing descriptions.
 *
 * @async
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each containing 'imageUrl' and 'imageId' for images without descriptions.
 * @throws {Error} Throws an error if fetching the home timeline fails.
 */
const getImageList = async () => {
  const imageList = [];

  try {
    const resp = await M.get("timelines/home", {});
    if (resp.data.length !== 0) {
      for (const toot of resp.data) {
        let post_id = toot["id"];
        let user_id = toot.account["id"];
        if (toot.media_attachments.length !== 0) {
          toot.media_attachments.forEach((val) => {
            if (val.description === null) {
              const { url: imageUrl, id: imageId } = val; // Using object destructuring
              imageList.push({ imageUrl, imageId, post_id, user_id }); // Using property shorthand
            }
          });
        }
      }
    }

    return imageList;
  } catch (error) {
    logger.error("Error fetching home timeline:", error);
    throw error;
  }
};

// Logging the start of the image list retrieval
logger.info("Fetching image list from the home timeline...");

getImageList()
  .then((imageList) => {
    logger.info("Image list fetched successfully:", imageList);
  })
  .catch((error) => {
    logger.error("Error fetching image list:", error);
  });

module.exports = getImageList;
