# AltBot

## About
<p class="has-line-data" data-line-start="0" data-line-end="1">Project ALtBot is our final project submission as a part of the course in CSE 210, instructed by Professor Thomas Powell.</p>
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



## Instructions to Run

Each folder's readme explains their respective steps to run.


#### A project by: Shreyas, Niraj, Onkar, Jash, Jay, Eddie, Andrew, Xuanyu