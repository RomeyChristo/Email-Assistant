# Email Assistant for the Visually Challenged

An Email assistant for the Visually challenged people which has speech recognition and speech synthesis. The web application recognizes voice commands for interacting with the application. It can format the mail, fix grammar and add punctuation.
## Setup
1. Install Python 2.7 or use Anaconda
2. Download the files and extract it in a local directory
3. Open punctuation folder>models folder and use the readme.txt to find the link to download the models
4. Open grammar folder and use the readme to find the link to download language tool. Extract the contents in the grammar folder.
5. Make sure to use Mailjet or any other service to get login, password, and smtp server address. Insert it in line 47 of play_with_model.py

## Installation
1. Run the server_start.bat
2. Open punctuation folder and run play_with_model.py ( supports only python 2.7)
4. Open grammar folder and run start_langtool.bat
5. Open Chrome browser and go to localhost:8000
6. Follow the instructions on the screen

## How to use
Say, 
READ INSTRUCTIONS to listen to the instructions.
MAIL FROM followed by your/sender's name. CLEAR FROM NAME to erase sender's address.
MAIL TO followed by receiver's address. CLEAR TO ADDRESS to erase receiver's address.
STARTfollowed by the email content.
CARBON COPY followed by cc address. CLEAR CC to erase cc address.
BCC followed by bcc address. CLEAR BCC to erase bcc address.
READ MAIL to listen to the mail. CLEAR MAIL to erase the content.
Recitation of content after each command will be done for self clarification
