# Email Assistant for the Visually Challenged

An Email assistant for the Visually challenged people which has speech recognition and speech synthesis. The web application recognizes voice commands for interacting with the application. It can format the mail, fix grammar and add punctuation.
## Setup
1. Install Python 2.7 or use Anaconda 
2. Install Java SE
3. Download the files and extract it in a local directory
4. Run the installation.bat and wait for the modules to be installed
5. Open punctuation folder>models folder and use the readme.txt to find the link to download the models
6. Open grammar folder and use the readme to find the link to download language tool. Extract the contents in the grammar folder.
7. Make sure to use Mailjet or any other service to get login, password, and smtp server address. Insert it in line 47 of play_with_model.py

## Run
1. Run the server_start.bat
2. Open punctuation folder and run play_with_model.py ( application works only on python 2.7 )
4. Open grammar folder and run start_langtool.bat
5. Open Chrome browser and go to localhost:8000
6. Follow the instructions on the screen

## How to use
Say, <br/>
Point</b> for full stop</br>
<b>Smiley face</b> to get a smiley face</br>
<b>At the rate of</b> to get @ symbol</br>
<b>Read Mail</b> to listen to the mail.<br>
<b>Delete Mail</b> to delete the mail content. </br>
<i>Recitation of content after each command will be done for self clarification</i>
