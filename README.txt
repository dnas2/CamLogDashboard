CamLog (github.com/rmc47/CamLog) is amateur radio logging software written by @rmc47 (M0VFC) for use by the Camb-Hams
This project is a dashboard to show basic stats from the CamLog database.

It is in two parts:

Backend contains a PHP script ('writeJson.php') designed to be run at the command line as part of a crontab. 
The only output from this script is a json file.
Before running writeJson.php, ensure you set database credentials and path where you want the json file saved in config.php
Obviously, the user running the PHP script must have write/update access to the json file.
I recommend running the PHP script about every 5 minutes.

The other part is FrontEnd. 
This is an HTML/Javascript site (no server-side scripting) that reads the json file from the backend, and displays the data from in a series of sequential 'slides'.
One of the slides contains simple 'news' text. To edit the news, edit news.php
Each slide is on screen for 12 seconds (5 slides per minute), and the data is reloaded from the json file every five minutes.
Note that this means the display could be up to 10 minutes stale.
