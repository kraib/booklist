require('dotenv').config();

require('regenerator/runtime');


const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Jimp = require('jimp');
const compression = require('compression');


const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

const multer  = require('multer');


app.use(compression());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
app.use(session({ secret: 'adam_booklist', saveUninitialized: true, resave: true }));

app.use('/static/', express.static(__dirname + '/static/'));
app.use('/node_modules/', express.static(__dirname + '/node_modules/'));
app.use('/react-redux/', express.static(__dirname + '/react-redux/'));
app.use('/utils/', express.static(__dirname + '/utils/'));
app.use('/uploads/', express.static(__dirname + '/uploads/'));


//const easyControllers = require('easy-express-controllers').easyControllers;
//easyControllers.createAllControllers(app, { fileTest: f => !/-es6.js$/.test(f) }, {__dirname: './node-dest'});

app.get('/', browseToReactRedux);
app.get('/books', browseToReactRedux);
app.get('/login', browseToReactRedux);
app.get('/subjects', browseToReactRedux);
app.get('/settings', browseToReactRedux);
app.get('/scan', browseToReactRedux);
app.get('/home', browseToReactRedux);
app.get('/view', browseToReactRedux);
app.get('/react-redux', browseToReactRedux);

function browseToReactRedux(request, response){
    if (!!request.user) {
        response.cookie('logged_in', 'true', { maxAge: 900000 });
    } else {
        response.clearCookie('logged_in');
    }
    response.sendFile(path.join(__dirname + '/react-redux/default.htm'));
}

app.get('/favicon.ico', function (request, response) {
    response.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.post('/react-redux/login', function(req, response) {
    // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
    response.cookie('logged_in', 'true', { maxAge: 900000 });
    response.cookie('userId', req.user.id, { maxAge: 900000 });
    if (req.body.rememberme == 1) {
        response.cookie('remember_me', req.user.token, {path: '/', httpOnly: true, maxAge: rememberMeExpiration });
    }
    response.send(req.user);
});

app.post('/react-redux/logout', function(req, response){
    response.clearCookie('remember_me');
    response.clearCookie('userId');
    req.logout();
    response.send({});
});



app.get('/activate', browseToReactRedux);


process.on('uncaughtException', error);
process.on('unhandledRejection', error);
process.on('exit', shutdown);
process.on('SIGINT', shutdown);

function shutdown(){
    process.exit();
}

function error(err){
    try{
        console.log(err)

        logger.log('exception', err);
    } catch(e) { }
}

Promise.resolve(true).then(() => {
    app.listen(process.env.PORT || 3000);
});