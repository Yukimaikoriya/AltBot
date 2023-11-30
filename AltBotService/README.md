# AltBotService

This is the main mastadon bot that replies to images [todo: based on some condition, hashtag maybe?] with a suggested alt tag for the image while should help screen readers and mastadon's search capability alike.

We are using the publicly available Mastadon API to communicate and transfer data between our ML model and Mastadon.

## Steps to run  


### Step 1
Create MySQl table with name "**Images**" and column names: *image_id, image_url, flag* before running the code.

### Step 2
To directly start the running of the bot, you can execute the **main.sh** bash file.
`./main.sh`

> [!NOTE]
> Incase of error related to permission, make sure to give proper permission by executing `chmod +x main.sh`

### TODO ADD MORE STEPS
of credentials, how to host?, how it runs?


## TESTING
Please GOTO the Test folder for testing specific instructions.
