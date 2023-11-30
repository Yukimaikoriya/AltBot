const Mastodon = require("mastodon-api");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
console.log("Image Bot Started");
// const ENV = require("dotenv");
// ENV.config();


const M = new Mastodon({
  client_key: 'A3ulj2cnqDLDPp9IgFFqNzDjsiQTxyoFZudSOH8JDHQ',
  client_secret: 'cnrT89bsyzMRzUvOBABoc_lGW0PtEwkul6x0W-tLxOs',
  access_token: 'KwImt6uz6GWDCUi4Rn2hpJgaMVx-b8JSiHxmwX_T21Y',
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

const ServerAddress = "http://127.0.0.1:5001";
const folderPath = "./OutputImages/"; // Replace with your actual folder path

// Read the files in the folder
let alt_tag = [];
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
