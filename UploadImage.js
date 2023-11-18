const Mastodon = require('mastodon-api');
const fs = require("fs")

console.log("Image Bot Started");

const M = new Mastodon({
  client_key: '',
  client_secret: '',
  access_token: '',
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

M.post('media', { file: fs.createReadStream('Images/jiraya.png'), description:"Jiraya from Naruto" }).then(resp => {
    const id = resp.data.id;
    M.post('statuses', { status: '#NarutoOP', media_ids: [id] })
  });
