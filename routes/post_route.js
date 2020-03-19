const moment = require('moment');
const alert = require('alert-node');

let post_id = '';

const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const post_update_page = (req, res)=>{
    go_post_update(res);
}

const go_main_page = (req, res)=>{
    go_main(req.session.user_name, res);
}

const show_post = (req, res)=>{
    if(req && req.session && req.session.logined){
        post_id = req.params.id;
        connection.query('SELECT * FROM post WHERE id = ?;', post_id, (err, results)=>{
            if(err){
                console.log(err);
            } else{
                connection.query('SELECT * FROM comment WHERE id = ? ORDER BY comment_id DESC;', post_id, (err, results2)=>{
                    if(err){
                        console.log(err);
                    } else{
                        connection.query('UPDATE post SET view = view + 1 WHERE id = ?;', post_id, (err)=>{
                            if(err){
                                console.log(err);
                            } else{
                                res.render('post', {post: results, name: req.session.user_name, comment: results2, moment: moment});
                            }
                        })
                    }
                })
            }
        })
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

const write_post = (req, res)=>{
    if(req && req.session && req.session.logined){
        let file = req.file;
        let post = {
            title: req.body.title,
            content: req.body.content,
            name: req.session.user_name,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            view: 0,
            photo: ''
        };

        if(post.title == '' || post.content == ''){
            alert('제목 혹은 본문이 작성되지 않았습니다.');
            res.redirect('/public/write_post.html');
        } else{
            if(file){
                let mimetype = file.mimetype;
                if(mimetype == 'image/jpeg' || mimetype == 'image/png'){
                    let originalname = file.originalname;
                    post.photo = '/uploads/' + originalname;
                    success_post(post, req, res);
                } else{
                    alert('png 혹은 jpeg 형태의 파일만 업로드 가능합니다.');
                    res.redirect('/public/write_post.html');

                }
            } else{
                success_post(post, req, res);
            }
        }
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

const post_update = (req, res)=>{
    let post = {
        title: req.body.title,
        content: req.body.content,
        id: post_id
    };

    if(post.title == '' || post.content == ''){
        alert('제목 혹은 본문이 작성되지 않았습니다.');
        go_post_update(res);
    } else{
        update_success(post, req, res);
    }
}

const delete_post = (req, res)=>{
    connection.query('DELETE FROM post WHERE id = ?;', post_id, (err)=>{
        if(err){
            console.log(err);
        } else{
            go_main(req.session.user_name, res);
        }
    })
}

function success_post(post, req, res){
    connection.query('INSERT INTO post SET ?;', post, (err)=>{
        if(err){
            console.log(err);
        } else{
            go_main(req.session.user_name, res);
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

function go_post_update(res){
    connection.query('SELECT * FROM post WHERE id = ?;', post_id, (err, results)=>{
        if(err){
            console.log(err);
        } else{
            res.render('post_update', {results: results});
        }
    })
}

function update_success(post ,req, res){
    connection.query('UPDATE post SET title = ?, content = ?, photo = ? WHERE id = ?;', [post.title, post.content, post.photo, post.id], (err)=>{
        if(err){
            console.log(err);
        } else{
            connection.query('SELECT * FROM post WHERE id = ?;', post_id, (err, results)=>{
                if(err){
                    console.log(err);
                } else{
                    connection.query('SELECT * FROM comment WHERE id = ? ORDER BY comment_id DESC;', post_id, (err, results2)=>{
                        if(err){
                            console.log(err);
                        } else{
                            res.render('post', {post: results, name: req.session.user_name, comment: results2, moment: moment});
                        }
                    });
                }
            });
        }
    });
}

module.exports.post_update_page = post_update_page;
module.exports.go_main_page = go_main_page;
module.exports.show_post = show_post;
module.exports.write_post = write_post;
module.exports.post_update = post_update;
module.exports.delete_post = delete_post;