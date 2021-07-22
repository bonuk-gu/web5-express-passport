const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var FileStore = require('session-file-store')(session)

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
  }))

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
