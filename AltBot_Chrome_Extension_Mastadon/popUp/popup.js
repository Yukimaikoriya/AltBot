import {getCurrentTab} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    // const queryParameters = activeTab.url.split("?")[1];
    // const urlParameters = new URLSearchParams(queryParameters);

    // const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("mastodon.social")) {
        console.log("Correct Web Site!")
    }
    else{
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">Not Active Here </div>';
    }
});
