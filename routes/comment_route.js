const moment = require('moment');
const alert = require('alert-node');

const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();

const write_comment = (req, res)=>{
    let comment = {
        id: post_id,
        name: req.session.user_name,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        content: req.body.content
    }

    if(comment.content == ''){
        alert('댓글을 입력해주세요');
        refresh_post(req, res);
        
    } else{
        connection.query('INSERT INTO comment SET ?;', comment, (err)=>{
            if(err){
                console.log(err);
            } else{
                refresh_post(req, res);
            }
        })
    }    
}

function refresh_post(req, res){
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
            })
        }
    })
}

module.exports.write_comment = write_comment;