/* eslint-disable quotes */
// require('./discord_bot');

const Express = require('express');
const server = Express();


// const routes = require('./Server_Routing');


const indexController = require('./controller/index');
const aboutController = require('./controller/aboutPage');
const createPostController = require('./controller/createPost');
server.set('views', './views');
server.set('view engine', 'ejs');
server.use(Express.static('./public'));

server.get('/', indexController);
server.get('/about', aboutController);
server.get('/newpost', createPostController);

// server.use('/', routes);

server.listen((process.env.PORT || 8000), () => {
	console.log('Server udah nyala dan jalan....');
});
