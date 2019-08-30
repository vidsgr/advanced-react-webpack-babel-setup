require('dotenv').config()
const express = require('express');
const path = require('path'); // NEW
// Adapt from MERN-STARTER
const bodyParser = require('body-parser');

const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/main');
const cors = require('cors');
const liveEvents = require('./liveEvents');
const router = require('./router');
/** 
 * Express to acces dist folder created by webpack from ReactJS
*/
const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist'); 
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const db = mongoose.connect(config.database,{useNewUrlParser: true, useCreateIndex: true});

const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};
app.use(express.static(DIST_DIR));
app.get('/api', (req, res) => {
  res.send(mockResponse);
});

app.get('/', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.use(cors());

server = app.listen(port);

const io = require('socket.io').listen(server);
liveEvents(io);

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Import routes to be served
router(app);


