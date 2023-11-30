const ENV = require("dotenv");
ENV.config();
const Mastodon = require("mastodon-api");
// const fs = require('fs')

console.log("Text Bot Started");

const M = new Mastodon({
  client_key: process.env.CLIENT_KEY,
  client_secret: process.env.CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

const params = {
  status: "Test Message-3",
};

M.post("statuses", params, (error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});
