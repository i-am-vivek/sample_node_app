var http=require("http")
, express=require("express")// a framework. to minimalize our work
, app=express()// initiate framwork
, stylus=require("stylus")// for compiling css file
, jade=require("jade")// template engine
, mongoskin=require("mongoskin")//db driver
, router = require('./router')
, db = mongoskin.db('mongodb://localhost:27017/old_crew', {safe:true}) // create db instance
, bodyParser=require('body-parser') //parsing body
, nib = require('nib')
, session = require('express-session')
,multer  = require('multer')
,upload = multer({ dest: __dirname + '/public/uploads' })
,ObjectID = mongoskin.ObjectID
;
var login=function(req,res){
		data={};
		data.title="Old Crew";
		data.action="Login";
		res.render("frontend/login",data);
	};
app.use(session({
    secret: "vivek",
    name: "vivek",
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(function(req, res, next) {
  req.db=db;
  req.ObjectID=ObjectID;
  next();
});
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set(bodyParser.json());//get query string as json
app.use(bodyParser.urlencoded({ extended: true }));//encoding url
app.set('views', __dirname + '/views');//set view path. all view files will be stored in this folder
app.set('view engine', 'jade'); //initiate view engine into framework
app.use(express.static(__dirname + '/public'));//setting static path as public folder. here we put files that are needed view files.
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));//inserting stylus middlware into framwork and setting css folder.this wil compile the css files
app.listen(3000);
app.get('/',function(req,res){res.redirect("/profile");});
app.get('/login',router.login);// when query string has login parameter, index function that is in router will be called
app.get('/loginp',router.loginp);// when query string has login parameter, index function that is in router will be called
app.post('/login',router.loginpost);
app.get('/register',router.register);// when query string has register parameter, index function that is in router will be called
app.post('/register',router.registerpost);
app.post('/checkusername',router.checkusername);
app.get('/profile',router.profile);
app.get('/logout',function(req,res){res.redirect("/profile");req.session.destroy();});
app.get('/getUserData',router.getUserData);
app.get('/getToDoData',router.getToDoData);
app.post('/deleteToDoData',router.deleteToDoData);
app.post('/getToDoData',router.saveToDoData);
app.post('/saveUserData', upload.single('user_image_file'),router.saveUserData);
app.get('/getAlbumData',router.getAlbumData);
app.post('/saveAlbumData', upload.single('image'),router.saveAlbumData);


