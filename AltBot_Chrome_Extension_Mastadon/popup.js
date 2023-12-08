import {getCurrentTab} from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    // const queryParameters = activeTab.url.split("?")[1];
    // const urlParameters = new URLSearchParams(queryParameters);

    // const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("mastodon.social/home")) {
        console.log("Correct Page")
    }
    else{
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">NHKKK </div>';
    }
});
