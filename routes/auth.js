var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var template = require('../lib/template.js');

var authData = {
    email: 'bonwook.koo@patterntech.co.kr',
    password: '0816',
    nickname: 'bonuk'
}

router.get('/login', function(request, response){
    var title = 'login';
    var list = template.list(request.list);
    var html = template.html(title, list, `<form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p>
            <input type="password" name="pwd" placeholder="password"></p>
        </p>
        <p>
            <input type="submit" value="login">
        </p>
    </form>`, '');
    response.send(html);
})

router.post('/login_process', function(request, response){
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    if(email === authData.email && password === authData.password){
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        request.session.save(function(){
            response.redirect(`/`);             
        });
    } else {
        response.send('who?');
    }
})

router.get('/logout', function(request, response){
    request.session.destroy(function(err){
        response.redirect('/');
    })
})

module.exports = router;