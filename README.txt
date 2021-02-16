Download express, nodemon, body parser, and mysql in node package manager (npm). Express helps to run EJS files and nodemon restarts the server every time you modify the files. Body parser is a middleware function which helps to access the requested data from client. These dependencies are required. This is how you download them in the command line:

npm install express mysql body-parser

After you download them, check your package json file to see if the dependencies were successfully downloaded. In order to run your server using nodemon make sure you type 'nodemon <filename.js>' in the command line. For example, mine would look like this:

nodemon app.js


