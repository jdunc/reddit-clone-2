var express = require('express');
var path = require('path');
var app = express();
const port = process.env.PORT || 8000;
const comments = require('./routes/comments');
const posts = require('./routes/posts');
const bodyParser = require('body-parser');
// Define the port to run on
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(comments);
app.use(posts);
// Listen for requests
app.listen(port, () => {
  console.log('Listening on port', port);
});
