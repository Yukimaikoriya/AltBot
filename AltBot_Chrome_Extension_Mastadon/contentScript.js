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

    
    // Uses hosted api to generate AltTag
    // async function generateAltTag(imageUrl) 
    // {
    //     const BASE_URL = 'https://yuuu.pythonanywhere.com/';
      
    //     const url = new URL(BASE_URL);
    //     tmpCntr += 1;
    //     url.searchParams.append('input', imageUrl);
      
    //     try 
    //     {
    //         const response = await fetch(url);
    //         if (!response.ok) 
    //         {
    //             console.error("HTTP error! Status: ",response.status);
    //         }
    //         const data = await response.json();
    //         return data['text'];
    //     } catch (error) 
    //     {
    //         console.error('Error:', error.message);
    //         //   throw error;
    //         return "Error Generating AltTag";
        
    //     }
    // }

    
    async function generateAltTag(imageUrl) {
      const BASE_URL = 'https://yuuu.pythonanywhere.com/';
      const username = 'your_username';
      const password = 'your_password';
      
      tmpCntr += 1;

      try {
        const response = await fetch(BASE_URL, {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Basic ' + btoa(username + ":" + password),
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ input: imageUrl }),
        });
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data['text'];
      } catch (error) {
        console.error('Error:', error.message);
        return "Error Generating AltTag";
        
      }
    }

    // async function generateAltTag(imageUrl) 
    // {
    //     return "TMPPPAltText" + getCurrentTime();
    // }

    
    // function getCurrentTime()
    // {
    //     // Create a new Date object
    //     var currentDate = new Date();

    //     // Get the current time
    //     var currentTime = currentDate.toLocaleTimeString();

    //     // Display the current time
    //     // console.log("Current time: " + currentTime);
    //     return currentTime;

    // }

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

        return {
            imgUniqueId:fileNameWithoutExtension,
            imageUrl: imageUrl
        };
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
            
            console.log(localIdDictionary[imgId] !== undefined, localIdDictionary[imgId], localIdDictionary[imgId], imgId)
            if (localIdDictionary[imgId] !== undefined) {
                
                console.log("imgId found locally", imgId);
                console.log(localIdDictionary);
                flag = 0;
                // altTag = localIdDictionary[imgId] + " Came from local storage " + tmpCntr;
                altTag = localIdDictionary[imgId]
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
                        altTag = JSON.parse(result[imgId]);
                    } else {
                        console.log("Image Id found nowhere ", imgId);
                        if (localIdDictionary[imgId] !== undefined) // Checking again due to domObserver 
                                                                    // calling handleMutations multiple
                                                                    // times parallelly
                        {
                            console.log("But found in Local now");
                            flag = 0;
                            altTag = localIdDictionary[imgId] + " (local backup)"
                        }
                        else
                        {
                            console.log(localIdDictionary);
                            flag = 2;
                        }
                        
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
            // console.log("Mutation detected: ", mutation.type);
            if (mutation.type === "childList")
            {
                var newImagesContainers = document.getElementsByClassName("media-gallery__item-thumbnail");
                for (var i = 0; i < newImagesContainers.length; i++) 
                {
                    var imgContainer = newImagesContainers[i];
                    var {imgUniqueId, imageUrl} = getUniqueImgId(imgContainer);
                    console.log("NEW LOGGGG", imageUrl)

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
                        altTag = await generateAltTag(imageUrl);
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

    // startDomObserver();
})();
