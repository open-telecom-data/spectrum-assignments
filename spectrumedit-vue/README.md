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
 sudo mkdir <WWW_PATH>/spectrum-data
 cp -rv dist/* <WWW_PATH>/spectrum-data
 ```
 
 For Apache systems
 ```
 cp .htaccess <WWW_PATH>/spectrum-data
 ```
 
 For Ngnix systems add the following to /etc/nginx/nginx.conf
  ```
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```
  
  For all other systems see: [Router Vuejs HTML History Mode](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations) 
  
 
 Following this you will be able to access the site at 
 ```
 http://<WWW_PATH>/spectrum-data
  ```
 
 ### Customize configuration
 See [Configuration Reference](https://cli.vuejs.org/config/).
