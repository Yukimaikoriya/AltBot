const Mastodon = require('mastodon-api');
const fs = require("fs")
const path = require('path');

console.log("Image Bot Started");

const M = new Mastodon({
  client_key: '',
  client_secret: '',
  access_token: '',
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

const folderPath = 'OutputImages/'; // Replace with your actual folder path

// Read the files in the folder
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (fs.statSync(filePath).isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {

      // Call ML model here to pass real description(ALT Tag), also after uploading is sucessfull, set the bool flag to 1

      M.post('media', { file: fs.createReadStream(filePath), description: `Test Description-2` })
        .then((resp) => {
          const id = resp.data.id;
          // Post a status for each uploaded image
          M.post('statuses', { status: `Test Status-2`, media_ids: [id] });
        })
        .catch((uploadError) => {
          console.error('Error uploading media:', uploadError);
        });
    }
  });
});
