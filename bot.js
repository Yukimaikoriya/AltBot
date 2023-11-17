const Mastodon = require('mastodon-api');
const ENV = require("dotenv");
ENV.config();

console.log("Bot Started");

const M = new Mastodon({
  client_key: env.CLIENt_KEY,
  client_secret: env.CLIENT_SECRET,
  access_token: env.ACCESS_TOKEN,
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

const params = {
    status: "Test Message-1"
}

M.post('statuses', params, (error, data) =>{
    if(error){
        console.error(error);
    }else{
        console.log(data);
    }
});

