# Open data spectrum-assignments
Open data project to increase transparency and understanding of telecommunications networks

## Project setup
 - Check out all the code in the spectrum-assignments project
 
  ```
  git clone https://github.com/open-telecom-data/spectrum-assignments.git
  cd spectrum-assignments
  ```
  
- Copy the html code for spectrum-chart to your Web server root and set permissions
 
```
 cp -rv spectrum-chart <WWW-ROOT>
 sudo chown -R www-data:www-data <WWW-ROOT/spectrum-chart
 sudo chmod -R 775  <WWW-ROOT>/spectrum-chart
 ```
 
- Copy the html code for the sqlite database and PHP backend to your Web server root and set permissions
  
 ```
  cp -rv spectrumedit-php <WWW-ROOT>
  sudo chown -R www-data:www-data <WWW-ROOT>/spectrumedit-php
  sudo chmod -R 775  <WWW-ROOT>/spectrumedit-php  
 ```

- Follow the Readme in spectrum-assignments/spectrumedit-vue to compile and build the Vue.js code

## Usage
 
-   To edit spectrum data navigate to

 ```
http://<Your-server>/spectrum-data
```  
> Once you have completed your edits press the "Export CSV Files" button*

-  To view the spectrum data navigate to

 ```
http://<Your-server>/spectrum-chart
``` 
