const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

var authData = {
    email: 'bonwook.koo@patterntech.co.kr',
    password: '0816',
    nickname: 'bonuk'
}

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

// 로그인 성공시 passport.use에서 done의 두 번재 인자가 serializeUser의 콜백 함수의 첫번째 인자로
// serializeUser 로그인이 성공했을 시 성공한 사실을 session-file-store에 저장하는 기능, 로그인에 성공하면 딱 한번 실행
passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.email);
});

// 로그인에 성공한 후 각각의 페이지에 방문할 때 마다 로그인한 사용자인지 아닌지에 대한 체크를 하는 기능
passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    done(null, authData); // done의 두 번째 인자에 있는 데이터가 request의 'user' 객체로 전달되도록 되어 있음
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd',
    },
    function(username, password, done) {
        console.log('LocalStrategy', username, password);
        if(username === authData.email){
            console.log(1);
            if(password === authData.password) {
                console.log(2);
                return done(null, authData);
            } else {
                console.log(3);
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        } else {
            console.log(4);
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
    }
));

app.post('/auth/login_process', 
    passport.authenticate('local', { failureRedirect: '/auth/login' }), (req, res) => {
        req.session.save( () => { res.redirect('/') })
    }
);

app.get('*', function(request, response, next){
    fs.readdir('./data', function(error, filelist){
        request.list = filelist;
        next();
    });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
    res.status(404).send('404 Not Found');
})

app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Error!!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
