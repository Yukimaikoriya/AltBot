# AltBot

## About
<p class="has-line-data" data-line-start="0" data-line-end="1">Project AltBot is our final project submission as a part of the course in CSE 210, instructed by Professor Thomas Powell.</p>
<p class="has-line-data" data-line-start="4" data-line-end="5">AltBot is a JavaScript-based bot designed for the Fediverse, specifically Mastodon. It automatically generates Alt Text for images, enhancing accessibility for visually impaired users and connecting them with the vibrant, decentralized world of the Fediverse. This innovative tool exemplifies our commitment to inclusive and advanced technology solutions.</p>
<p class="has-line-data" data-line-start="7" data-line-end="8">The project employs the best software engineering practices recommended by David Farley in his book Modern Software Engineering. Our code uses continuous integration to ensure consistent code quality and early detection of conflicts or issues. The code is appropriately modularized, with concerns separated and exhibiting good cohesion. The project opted not to utilize Test-Driven Development to accommodate the brief development period and the team’s inexperience with TDD.</p>


## Folder Structure

- ALTTagMLService  (Web GUI for AltBot)
    - templates
        -  index.html
    - app.py

- AltBotService (Mastadon Bot)
    - Images
    - OutputImages
    - Docs
    - test
        - DownloadImages.test.js
        - ExtractData.test.js
        - README.md
        - ReadDataTimeline.test.js
        - SaveToDB.test.js
        - UploadImage.test.js
    - .gitignore
    - DownloadImages.js
    - ExtractData.js
    - ReadDataTimeline.js
    - SaveToDB.js
    - UploadImage.js
    - jest.config.js
    - main.sh
    - package-lock.json
    - package.json
- Experiment (Standalone Prototypes/Experiementations)
    - ML_Model.py
    - Run_ML_Model.js
    - alt_api.py
    - alt_api_invoke.py
    - bot.js

## Design Structure

#### ALTBotService

##### Data Retrieval

###### ReadDataTimeline.js

We use the mastodon's **home timeline API** to fetch the statuses from the following users. We check the `MediaAttachment` entity to filter the posts with images. If the description doesn't exist for the fetched image, we will store two attributes of each image `id` and `url` in `imageList` that need further alt-text-generation processing. Other modules can retrieve the `imageList` from `getImageList()`.

> `id` The ID of the (image) attachment.
>
> `url`  The location of the original full-size (image) attachment.
>
>  `description`  Alternate text that describes what is in the media attachment, to be used for the visually impaired or when media attachments do not load.



##### Data Storage & Database Structure

###### SaveToDB.js

We store the fetched `imageList` in our database. We use a MySQL database to store the image (`id` & `url`) and a `flag` representing the processed status. The attribute `flag`  is initialized to 0 to indicate unprocessed. The database structure is as follows:

`image_id | image_url | flag`



##### Data Processing

`ExtractData.js`  Fetch records from the database.

`DownloadImages.js `  Download images from their relevant `url` and save them into the given filepaths (`OutputImages` folder).



##### Reuploading with ALT text

###### UploadImages.js

For each image that needs to be uploaded, we perform a POST request using Axios to retrieve the generated alt-text from our machine-learning model endpoint in `app.py`. We use node-mastadon API `M.post(path, [params])` to post a new `#ALTBOT` status with the image attachment with alt-text.

> **media API data parameters**
>
> `file` Image filepath
>
> `descriptoin` Generated alt text
>
> 
>
> **statuses API data parameters** 
>
> `status` "#ALTBOT"
>
> `media_ids[]` Attachment (image) id returned from media API

###### updateFlagInDatabase.js

After successfully uploading an image, we set its `flag ` to 1 in the database.



#### ALTTagMLServive

We make a Web Application with Flask, illustrating how our alt-text generation pipeline works. 


## Instructions to Run

Each folder's readme explains their respective steps to run.


#### A project by: Shreyas, Niraj, Onkar, Jash, Jay, Eddie, Andrew, Xuanyu
