(() => 
{
    console.log("contentScript start");

    var localIdDictionary = {};
    var tmpCntr = 0;
    // var idSet = new Set();

    chrome.runtime.onMessage.addListener((obj, sender, response) => 
    {
        console.log("Inside onMessage Listener");

        const {type} = obj;

        if (type === "NEW")
        {
            startDomObserver();
        }

    });

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function generateAltTag() 
    {
        // Your logic to generate alt tag
        console.log("altTagGenerated");

        tmpCntr += 1;
        console.error(tmpCntr);
        await setTimeout(function() {
            console.error("TimeOUT done");
        }, 5000);

        return getCurrentTime();
    }

    function populateAltTitleTags(images, altTag) 
    {
        console.log("Inside populateAltTags");
        
        var img = images[0];    // Mastadon HTML will always only have a single img element in the <a> tag.
                                // This is also true, when there are multiple images in a single post
                                // Hence no need of a loop.
        console.log(img);

        // Check if the image already has an alt tag
        if (!img.alt || img.alt.trim() === "") 
        {
            // If not, generate alt tag and assign it
            img.alt = altTag;
            img.title = altTag;
        }
    }

    function addAltButtonOnImg(currentElement)
    {
        console.log("Inside add alt button");
        // Check if the span is present inside the alt tag div
        var hasSpan = currentElement.querySelector('.media-gallery__item__badges .media-gallery__gifv__label');

        // If the span is not present, add it
        if (!hasSpan) {
            var divElement = currentElement.querySelector('.media-gallery__item__badges');

            var span = document.createElement('span');
            span.className = 'media-gallery__gifv__label';
            span.innerText = 'ALT';

            divElement.appendChild(span);
        }
    }

    function getUniqueImgId(imgContainer)
    {
        console.log("Get Unique Id");
        var imageUrl = imgContainer.href;

        // Split the URL by '/'
        var parts = imageUrl.split('/');

        // Get the last part, which is the file name
        var fileNameWithExtension = parts.pop();

        // Split the file name by '.'
        var fileNameParts = fileNameWithExtension.split('.');

        // Get the part before the file extension
        var fileNameWithoutExtension = fileNameParts[0];

        return fileNameWithoutExtension;
    }

    function getImgStatus(imgId)
    {
        // Flags: Meaning of the flag
        // 0: found in local = do nothing
        // 1: found in chromeStorage = reuse altTag
        // 2: Run ML model and store in chromeStorage

        // Check if the ID is present in the object
        return new Promise((resolve) => {
            var flag = -1;
            var altTag = "";
    
            if (localIdDictionary.hasOwnProperty(imgId)) {
                console.log("imgId found locally", imgId);
                console.log(localIdDictionary);
                flag = 0;
                altTag = localIdDictionary[imgId] + " Came from local storage " + tmpCntr;
                resolve({
                    flag: flag,
                    altTag: altTag,
                });
            } else {
                chrome.storage.local.get([imgId], function (result) {
                    if (result.hasOwnProperty(imgId)) {
                        console.log("imgId found in chrome storage", imgId);
                        console.log(localIdDictionary);
                        flag = 1;
                        altTag = JSON.parse(result[imgId]) + " Came from chrome.local storage";
                    } else {
                        console.log("Image Id found nowhere ", imgId);
                        console.log(localIdDictionary);
                        flag = 2;
                    }
    
                    resolve({
                        flag: flag,
                        altTag: altTag,
                    });
                });
            }
        });
    }

    async function handleMutations(mutations) 
    {
        await mutations.forEach(async function (mutation) 
        {
            // console.log("Mutation detected: ", mutation.type);
            if (mutation.type === "childList")
            {
                var newImagesContainers = document.getElementsByClassName("media-gallery__item-thumbnail");
                for (var i = 0; i < newImagesContainers.length; i++) 
                {
                    var imgContainer = newImagesContainers[i];
                    var imgUniqueId = getUniqueImgId(imgContainer);

                    var {flag, altTag} = await getImgStatus(imgUniqueId);
                    console.log(flag, altTag, "BRUH");


                    if (flag == 0)  // found in local = do nothing
                    {
                        populateAltTitleTags(imgContainer.children, altTag);
                        addAltButtonOnImg(imgContainer.parentElement);
                    }
                    else if (flag == 1) // found in chromeStorage = reuse altTag
                    {
                        populateAltTitleTags(imgContainer.children, altTag);
                        addAltButtonOnImg(imgContainer.parentElement);
                        saveAltInLocal(imgUniqueId, altTag);
                    }
                    else    // Run ML model and store in chromeStorage
                    {
                        altTag = await generateAltTag();
                        populateAltTitleTags(imgContainer.children, altTag);
                        addAltButtonOnImg(imgContainer.parentElement);
                        saveAltInChromeStorage(imgUniqueId, altTag)
                        .then(() => {
                            // Data is successfully stored, perform actions here
                            console.log('Data stored successfully');
                        })
                        .catch((error) => {
                            // Handle the error if storage fails
                            console.error('Error storing data:', error);
                        });
                        saveAltInLocal(imgUniqueId, altTag);
                    }
                    
                }
            }
            
            
        });
    }
    
    function saveAltInLocal(imgUniqueId, altTag)
    {
        localIdDictionary[imgUniqueId] = altTag;
        console.log("Saved in Local");
    }

    function saveAltInChromeStorage(imgUniqueId, altTag) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({
                [imgUniqueId]: JSON.stringify(altTag)
            }, function () {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                } else {
                    resolve();
                }
            });
        });
    }

    function startDomObserver()
    {
        var observer = new MutationObserver(handleMutations);
        var targetNode = document.body; // You can adjust this based on your actual structure
        var config = { childList: true, subtree: true, attributes: true };
        observer.observe(targetNode, config);
    }

    function getCurrentTime()
    {
        // Create a new Date object
        var currentDate = new Date();

        // Get the current time
        var currentTime = currentDate.toLocaleTimeString();

        // Display the current time
        // console.log("Current time: " + currentTime);
        return currentTime;

    }
    

    // startDomObserver();
})();
