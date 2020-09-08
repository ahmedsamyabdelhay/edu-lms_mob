To create app icon and splash screen:

 1. create the required files:
    - splash.png 2730 x 2730
    - icon.png 1024 x 1024
    - icon-foreground.png 1024 x 1024
    - icon-background.png 1024 x 1024
    - login_logo.png 512 x ( height <= 300)

 2. put created files in rootfolder/resources as follow:
    - splash.png & icon.png in /rootfolder/resources
    - icon-foreground.png & icon-background.png in /rootfolder/resources/android
    - splash.png & login_logo.png in src/assets/img

 3. open terminal in rootfolder/resources
 4. execute command: 'ionic cordova resources'
    NOTE: if error 'cordova -res is not the path' shows up, follow the installation instructions with the error


To change status bar color:
in src/config.json > change the values of both statusbarbgios, statusbarbgandroid
NOTE: make sure it is the same color as $toolbar variable in /syncology/colors.js

To change app info like name and id:
in src/config.json & rootfolder/config.xml
