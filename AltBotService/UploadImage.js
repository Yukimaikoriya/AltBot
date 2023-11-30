const Mastodon = require("mastodon-api");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
console.log("Image Bot Started");

const ENV = require("dotenv");
ENV.config();

/**
 * Initializes and configures the Mastodon API client.
 * @type {Mastodon}
 */

const M = new Mastodon({
  client_key: '',
  client_secret: '',
  access_token: '',
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

const ServerAddress = "http://127.0.0.1:5001";
const folderPath = "./OutputImages/"; // Replace with your actual folder path

//let alt_tag = [];

/**
 * Reads files from the specified folder and posts them to Mastodon.
 * For each image file, it sends a request to an ML model endpoint to generate an ALT tag,
 * then uploads the image to Mastodon with the generated ALT tag.
 */
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Error reading folder:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
      // Call ML model here to pass real description(ALT Tag), also after uploading is sucessfull, set the bool flag to 1
      const fileData = fs.readFileSync(filePath, { encoding: "base64" });
      axios
        .post(`${ServerAddress}/alt_model_endpoint`, { file: fileData })
        .then((response) => {
          M.post("media", {
            file: fs.createReadStream(filePath),
            description: JSON.stringify(response.data.alt_tag),
          })
            .then((resp) => {
              const id = resp.data.id;
              // Post a status for each uploaded image
              M.post("statuses", { status: "#ALTBOT", media_ids: [id] });
            })
            .catch((uploadError) => {
              console.error("Error uploading media:", uploadError);
            });
        })
        .catch((error) => {
          console.error("Error posting request:", error);
        });
    }
  });
});
