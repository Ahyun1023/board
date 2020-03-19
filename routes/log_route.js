const moment = require('moment');
const alert = require('alert-node');
const crypto = require('crypto');

const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const signUp = (req, res)=>{
    let createTime = moment().format("YYYY-MM-DD HH:mm:ss");

    let users = {
        "id": req.body.id || req.query.id,
        "password": req.body.password || req.query.password,
        "name": req.body.name || req.query.name,
        "createdTime": createTime
    }

    let password_check = req.body.password_check || req.query.password_check;

    if(users.password != password_check){
        alert('잘못된 비밀번호입니다.');
    }

    connection.query('SELECT id FROM users;', users, (err, results)=>{
        if(err){
            console.log(err);
        }
        else{
            for(let i=0; i<results.length; i++){
                if(users.id == results[i].id){
                    alert('이미 존재하는 아이디입니다.');
                    break;
                }

                else{
                    users.password = crypto.createHash('sha256').update(users.password).digest('hex');

                    connection.query('INSERT INTO users SET ?;', users, (err)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h1>회원가입 성공</h1>');
                            res.write('<a href="../public/login.html">로그인 화면으로 가기</a>');
                            res.end();
                        }
                    })
                    break;
                }
            }
        }
    })
}

const logout = (req, res)=>{
    if(req && req.session && req.session.logined){
        req.session.destroy(()=>{
            res.redirect('/public/login.html');
        });
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

const signOut = (req, res) =>{
    if(req && req.session && req.session.logined){
        password = crypto.createHash('sha256').update(req.body.password).digest('hex');

        connection.query('SELECT password FROM users WHERE id = ?;', req.session.user_id, (err, results)=>{
            if(err){
                console.log(err);
            } else{
                if(password == results[0].password){
                    connection.query('DELETE FROM users WHERE id = ?;', req.session.user_id, (err)=>{
                        if(err){
                            console.log(err);
                        } else{
                            req.session.destroy(()=>{
                                alert('회원 탈퇴되었습니다.');
                                res.redirect('/public/login.html');
                            })
                        }
                    });
                } else{
                    alert('비밀번호 틀림');
                    res.redirect('/public/signOut.html');
                }
            }
        })
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

module.exports.signUp = signUp;
module.exports.signOut = signOut;
module.exports.logout = logout;