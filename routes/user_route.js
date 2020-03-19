const moment = require('moment');
const alert = require('alert-node');
const crypto = require('crypto')

const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const user_update_page = (req, res)=>{
    if(req && req.session && req.session.logined){
        res.render('user_update', {name: req.session.user_name});
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

const user_update = (req, res)=>{
    let users = {
        name: req.body.name,
        password: req.body.password,
        id: req.session.user_id
    };
    let passwordCheck = req.body.password_check;

    if(users.password != passwordCheck){
        alert('잘못된 비밀번호 입니다.');
        res.render('user_update', {name: req.session.user_name});
    }

    if(users.password == ''){
        users.password = req.session.user_password;
    } else{
        users.password = crypto.createHash('sha256').update(users.password).digest('hex');
    }

    connection.query('UPDATE users SET name=?, password=? WHERE id=?;', [users.name, users.password, users.id], (err)=>{
        if(err){
            console.log(err);
        } else{
            req.session.user_name = users.name;
            go_main(req.session.user_name, res);
        }
    })
}

const login = (req, res)=>{
    let users = {
        id: req.body.id,
        password: req.body.password
    }

    users.password = crypto.createHash('sha256').update(users.password).digest('hex');
    
    connection.query('SELECT * FROM users WHERE id = ? AND password = ?;', [users.id, users.password], (err, results)=>{
        if(err){
            console.log(err);
        }
        else if(results == 0){
            alert("아이디 혹은 비밀번호가 틀렸습니다");
            res.redirect('/public/login.html');
        }
        else{
            if(err){
                console.log(err);
            } else{
                req.session.logined = true;
                req.session.user_id = req.body.id;
                req.session.user_name = results[0].name;
                req.session.user_password = results[0].password;

                go_main(req.session.user_name, res);
            }
        }
    })
}

function go_main(user_name, res){
    connection.query('SELECT * FROM post ORDER BY id DESC', (err, results)=>{
        if(err){
            console.log(err);
        }
        res.render('main', {name: user_name, result: results, moment});
    });
}

module.exports.user_update = user_update;
module.exports.login = login;
module.exports.user_update_page = user_update_page;