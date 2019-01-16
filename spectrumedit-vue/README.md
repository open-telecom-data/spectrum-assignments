 # Vue.js Project for Editing Spectrum data 
 
 ## Project setup
 
 1. Modify the phpURL in the ./components/common.vue file to point to your PHP server providing access the the SQLite database
 2. Install all the required components with the following command
 ```
 npm install
 ```
 
 ### Compiles and hot-reloads for development
 ```
 npm run serve
 ```
 Folllowing this you will be able to access the site at http://<server>:8080/spectrum-data
 ### Compiles and minifies for production
 ```
 npm run build
 ```
 
 ### Prepare server folder
 Note this setup is designed to be installed in <WWW_PATH>/spectrum-data
 ```
 cp -rv dist/* <WWW_PATH>/spectrum-data
 cp .htaccess <WWW_PATH>/spectrum-data
 ```
 Following this you will be able to access the site at http://<WWW_PATH>/spectrum-data
 
 
 ### Customize configuration
 See [Configuration Reference](https://cli.vuejs.org/config/).
