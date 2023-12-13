#### AltBot Chrome Extension

We created a AltBot Chrome Extension using Manifest V3 specially for the website "Mastodon.social". Our extension adds new alt text to the images directly into the HTML DOM if the original creators did't provide with one.

##### File Structure

`manifest.json` provide information about our extension

`background.json` Act as the background **service_worker**. If we are navigating mastodon home page, it will trigger our extension functionality.

`popup.html & popup.js & popup.css & utils.js` A simple popup window indicating if our extension is working.

`contentScript.js` Main functionality. Details are shown below.

##

##### Functionality

Before exploring the functionalities, let first take a look at mastodon home page structure. When we scrolling on the page back and forth, the DOM structure actively changes. Only the posts visible on the webpage will own the classs name `media-gallery__item-thumbnail`. Our DOM observer, that actively monitors on these changes, will process the alt text fetching/generation for these visible images.

If an image has a alt text, than there will be a `<span>` element inside the `<div class="media-gallery__item__badges">` section for alt text display right after the image element. Our work add such elements for those posted images missing alt text.

Our extension mainly consists of two parts, alt text generation & storage.

- For alt text generation, we host a flask API for alt text generation in _pythonanywhere_ in the cloud. We integrate the huggingface inference API to fetch alt text through HTTP requests (Demo Python File stored inside the ML_api folder).

- To more efficiently retrieving generated alt text, we use two storages: a `local storage` remains active until the page is refreshed or offline and `chrome.storage.local` where storage remained until the extension is removed. We represent each image with its unique image id that is assigned (can be parsed through its `href`) by mastodon and store it with the generated alt text in the two storages.

  For an unseen image, we generate the alt text from our API and then store it to both chrome storage and local one. Otherwise, we will directly get it from local storage if available or fetch from chrome storage. We believe that it guarantees a faster access speed instead of making the identical query again and again.

##### Known Limitation/Bug

The generate alt text api gets called 100s of times due to how the DOMObserver works. (No time to fix!)
