const Mastodon = require('mastodon-api');
const fs = require("fs")

console.log("Read Timeline Bot Started");

const M = new Mastodon({
  client_key: '',
  client_secret: '',
  access_token: '',
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});
const getImageList = async () => {
    var imageList = [];
  
    try {
      const resp = await M.get('timelines/home', {});
      if (resp.data.length != 0) {
        for (let i = 0; i < resp.data.length; i++) {
          const toot = resp.data[i];
          if (toot.media_attachments.length != 0) {
            toot.media_attachments.map((val, index) => {
              if (val.description != null) {
                let image_url = val.url;
                let image_id = val.id;
                imageList.push({ imageUrl: image_url, imageId: image_id });
              }
            });
          }
        }
      }
      return imageList;
    } catch (error) {
      console.error('Error fetching home timeline:', error);
      throw error;
    }
  };
  
module.exports = getImageList;