/* eslint-disable quotes */
// require('./discord_bot');
require('dotenv').config();
const Express = require('express');
const bodyParser = require('body-parser');
const server = Express();
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const auth = require('./middleware/auth');
const redirIfAuth = require('./middleware/redirectIfAuthenticated');

// Env var consts
const mongo_url = process.env.MONGO_URL;
// const routes = require('./Server_Routing');

// Mongoose connect init
mongoose.connect(mongo_url, { useNewUrlParser: true })
	.then(() => { console.log('Connected to MongoDB'); })
	.catch(err => { console.error('Something went wrong', err); });

const mongoStore = connectMongo(expressSession);

// GET Controller
const indexController = require('./controller/index');
const aboutController = require('./controller/aboutPage');
const createPostController = require('./controller/createPost');
const blogPostRouteController = require('./controller/blogRoute');
const editPostController = require('./controller/editPost');
const loginController = require('./controller/login');
const registerController = require('./controller/register');

// POST Controller
const storePostController = require('./controller/post/createPost');
const updatePostController = require('./controller/post/editPost');
const registerUserController = require('./controller/post/registerUser');
const loginUserController = require('./controller/post/login');

// Server Set block
server.set('views', './views');
server.set('view engine', 'ejs');

// Server use block
server.use(Express.static('./public'));
server.use(bodyParser.urlencoded({ extended : true }));
server.use(fileUpload());
server.use(expressSession({
	secret : 'iAms0G00d',
	store : new mongoStore({ mongooseConnection : mongoose.connection }),
}));
// server.use('/', routes);

// Server get request block
server.get('/', indexController);
server.get('/about', aboutController);
server.get('/newpost', auth, createPostController);
server.get('/blog/*', blogPostRouteController);
server.get('/login', redirIfAuth, loginController);
server.get('/register', redirIfAuth, registerController);

// Server post request block
server.post('/newpost', storePostController);
server.post('/editpost', editPostController);
server.post('/updatepost', updatePostController);
server.post('/register', redirIfAuth, registerUserController);
server.post('/login', redirIfAuth, loginUserController);


server.listen((process.env.PORT || 8000), () => {
	console.log('Server udah nyala dan jalan....');
});
