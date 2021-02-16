This is a web application which helps soccer fanatics create soccer groups to network and play together. 

How to run application:

Do not use my 'package-lock.json' & 'package.json' files since the versions may be outdated. Instead follow this instructions to download your own json files. First, open your command line and find your folder directory. Download express, nodemon, body parser, and mysql using the node package manager (npm). This is how you download them in the command line:

npm install express mysql body-parser

After you download them, check your package json file to see if the dependencies were successfully downloaded. In order to run your server using nodemon make sure you type 'nodemon <filename.js>' in the command line. For example, mine would look like this:

nodemon app.js

Express helps to run EJS files and nodemon restarts the server every time you modify the files. Body parser is a middleware function which helps to access the requested data from client. You have to download these dependencies else you will have issues.

