const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const static = require('serve-static');

const multer = require('multer');

const session = require('express-session');
const filestore = require('session-file-store')(session);

const log_routes = require('./routes/log_route');
const search_routes = require('./routes/search_route');
const post_routes = require('./routes/post_route');
const user_routes = require('./routes/user_route');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views, views');

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const storage = multer.diskStorage({
    destination : function(req, file, callback){
        callback(null, 'uploads')
    },
    filename : function(req, file, callback){
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage : storage,
    limits: {
        files : 10,
        fileSize : 1024 * 1024 * 1024
    }
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new filestore()
}));

router = express.Router();
router.route('/login').post(user_routes.login);
router.route('/signUp').post(log_routes.signUp);
router.route('/signOut').post(log_routes.signOut);
router.route('/logout').post(log_routes.logout);
router.route('/main').post(post_routes.go_main_page);
router.route('/update').get(user_routes.user_update_page);
router.route('/update/post/:id').post(post_routes.post_update_page);
router.route('/post/:id').post(post_routes.show_post);
router.route('/search/mypost').post(search_routes.search_mypost);
router.route('/search').get(search_routes.search_post);
router.route('/').post(upload.single('photo'), post_routes.write_post);
router.route('/update').post(user_routes.user_update);
router.route('/update/:id').post(post_routes.post_update);
router.route('/delete_post').post(post_routes.delete_post);
router.route('/comment').post(post_routes.write_comment);
app.use('/', router);

http.createServer(app).listen(app.get('port'), function(){
    console.log('서버 시작, 포트넘버: %d', app.get('port'));
})
