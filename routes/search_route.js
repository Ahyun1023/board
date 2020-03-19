const moment = require('moment');
const alert = require('alert-node');

const mysql_dbc = require('../DB/db')();
const connection = mysql_dbc.init();


const search_post = (req, res)=>{
    if(req && req.session && req.session.logined){
        let options = req.body.options || req.query.options;
        let search = req.body.search || req.query.search;
        if(options == 'title'){
            connection.query('SELECT * FROM post WHERE title LIKE ?;', ['%' + search + '%'], (err, results)=>{
                if(err){ 
                    console.log(err);
                } else{
                    counts = results.length;
                    res.render('search', {results: results, count: counts, moment});
                }
            })
        } else if(options == 'name'){
            connection.query('SELECT * FROM post WHERE name =?;', search, (err, results)=>{
                if(err){
                    console.log(err);
                } else{
                    counts = results.length;
                    res.render('search', {results: results, count: counts, moment});
                }
            })
        }
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

const search_mypost = (req, res)=>{
    if(req && req.session && req.session.logined){
        connection.query('SELECT * FROM post WHERE name = ?;', req.session.user_name, (err, results)=>{
            if(err){
                console.log(err);
            } else{
                counts = results.length;
                res.render('search', {results: results, count: counts, moment});
            }
        })
    } else{
        alert('로그인되어 있지 않습니다.');
        res.redirect('/public/login.html');
    }
}

module.exports.search_post = search_post;
module.exports.search_mypost = search_mypost;