/* eslint-disable quotes */
require('./discord_bot');
require('dotenv').config();
const Express = require('express');
const bodyParser = require('body-parser');
const server = Express();
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

// Env var consts
const mongo_url = process.env.MONGO_URL;
const routes = require('./Server_Routing');

// Mongoose connect init
mongoose.connect(mongo_url, { useNewUrlParser: true })
	.then(() => { console.log('Connected to MongoDB'); })
	.catch(err => { console.error('Something went wrong', err); });


// Constant Block
const indexController = require('./controller/index');
const aboutController = require('./controller/aboutPage');
const createPostController = require('./controller/createPost');
const storePostController = require('./controller/post/createPost');

// Server Set block
server.set('views', './views');
server.set('view engine', 'ejs');

// Server use block
server.use(Express.static('./public'));
server.use(bodyParser.urlencoded({ extended : true }));
server.use(fileUpload());
server.use('/', routes);

// Server get request block
server.get('/', indexController);
server.get('/about', aboutController);
server.get('/newpost', createPostController);

// Server post request block
server.post('/newpost', storePostController);


server.listen((process.env.PORT || 8000), () => {
	console.log('Server udah nyala dan jalan....');
});
