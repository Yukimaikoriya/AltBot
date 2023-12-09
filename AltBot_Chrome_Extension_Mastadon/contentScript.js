(() => 
{
    console.log("contentScript start");

    var localIdDictionary = {};
    // var idSet = new Set();

    chrome.runtime.onMessage.addListener((obj, sender, response) => 
    {
        console.log("Inside onMessage Listener")

        const {type} = obj;

        if (type === "NEW")
        {
            startDomObserver();
        }

    });

    function generateAltTag() 
    {
        // Your logic to generate alt tag
        console.log("altTagGenerated");
        console.log("Need ML model");
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
                console.log("imgId found locally");
                flag = 0;
                altTag = localIdDictionary[imgId];
                resolve({
                    flag: flag,
                    altTag: altTag,
                });
            } else {
                chrome.storage.local.get([imgId], function (result) {
                    if (result.hasOwnProperty(imgId)) {
                        console.log("imgId found in chrome storage");
                        flag = 1;
                        altTag = result[imgId];
                        localSet.add(imgId);
                    } else {
                        console.log("Image Id found nowhere");
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

    function handleMutations(mutations) 
    {
        mutations.forEach(async function (mutation) 
        {
            console.log("Mutation detected: ", mutation.type);
            if (mutation.type === "childList")
            {
                var newImagesContainers = document.getElementsByClassName("media-gallery__item-thumbnail");
                for (var i = 0; i < newImagesContainers.length; i++) 
                {
                    var imgContainer = newImagesContainers[i];
                    var imgUniqueId = getUniqueImgId(imgContainer);

                    // var {flag, altTag} = await getImgStatus(imgUniqueId);
                    // console.log(flag, altTag, "BRUH");


                    // if (flag == 0)  // found in local = do nothing
                    // {
                    //     // TODO
                    // }
                    // else if (flag == 1) // found in chromeStorage = reuse altTag
                    // {

                    // }
                    // else    // Run ML model and store in chromeStorage
                    // {

                    // }
                    altTag = generateAltTag();
                    populateAltTitleTags(imgContainer.children, altTag);
                    addAltButtonOnImg(imgContainer.parentElement)
                }
            }
            
            
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
        return currentTime

    }
    

    startDomObserver();
})();
