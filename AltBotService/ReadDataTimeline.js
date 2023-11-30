const Mastodon = require("mastodon-api");
// const fs = require('fs')
// const ENV = require("dotenv");
// ENV.config();

/**
 * Logs the start of the Read Timeline Bot.
 */
console.log("Read Timeline Bot Started");

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
  client_key: 'A3ulj2cnqDLDPp9IgFFqNzDjsiQTxyoFZudSOH8JDHQ',
  client_secret: 'cnrT89bsyzMRzUvOBABoc_lGW0PtEwkul6x0W-tLxOs',
  access_token: 'KwImt6uz6GWDCUi4Rn2hpJgaMVx-b8JSiHxmwX_T21Y',
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
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
      for (let i = 0; i < resp.data.length; i++) {
        const toot = resp.data[i];
        if (toot.media_attachments.length !== 0) {
          toot.media_attachments.forEach((val, index) => {
            if (val.description === null) {
              const { url: imageUrl, id: imageId } = val; // Using object destructuring
              imageList.push({ imageUrl, imageId }); // Using property shorthand
            }
          });
        }
      }
    }
    console.log(imageList);
    return imageList;
  } catch (error) {
    console.error("Error fetching home timeline:", error);
    throw error;
  }
};
getImageList();
module.exports = getImageList;
