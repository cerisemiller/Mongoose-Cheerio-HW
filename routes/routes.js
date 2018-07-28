var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require("bluebird");

var result = [];

mongoose.Promise = Promise;

var Articles = require("../models/model-articles.js");
var Comments =require("../models/model-notes.js");

var url = "https://www.coindesk.com/";
router.get('/', function(req, res){
  res.render('articles-index');
});
router.get('/articles', function(req, res){
    request(url, function(error, response, html) {  
        var $ = cheerio.load(html);   

$(".article").each(function(i, element) {
        var title = $(element).find('.picture').find("a").attr("title");
        var imgLink = $(element).find('.picture').find("a").find("img").attr("src");
        var storyLink = $(element).find(".post-info").find("a").attr("href");
        var summary = $(element).find(".post-info").find("p").text();
        summary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        if(summary===''){
          return;
        }else{
        result[i] = ({ 
        id:i,
        title: title,
        imgLink: imgLink,
        storyLink: storyLink,
        summary: summary
      }); 
      }
  });
res.render('articles-index',{articles:result});  
}); 
});
router.post('/save/:id', function(req, res){
    article = result[req.params.id];
      console.log(article);
    Articles.findOne({'title': article.title}, function(err, articleRecord) {
        if(err) {
          console.log(err);
        } else {
          if(articleRecord == null) {
            Articles.create(article, function(err, record) {
              if(err) throw err;
              console.log("article successfully added");
            });
          } else {
            console.log("article not added");
          }         
        }
      });
 res.render('articles-index',{articles:result});
 });
router.get('/articlesaved', function(req, res){
  Articles.find().sort({ createdAt: -1 }).exec(function(err, data) { 
    if(err) throw err;
    res.render('notes-index',{articles:data});
  });
});

router.get('/comments/:id', function(req, res){
  Comments.find({'articleId': req.params.id}).exec(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.json(data);
    } 
  });
});
router.get('/delete/:id', function(req, res){
  Articles.remove({'_id': req.params.id}).exec(function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/articlesaved');
    } 
  });
});

router.post('/addcomment/:id', function(req, res){
  console.log(req.body);
  Comments.create({
    articleId: req.params.id,
    comment: req.body.comment
  }, function(err, docs){    
    if(err){
      console.log(err);     
    } else {
      console.log("New Comment Added");
    }
    res.redirect('/articlesaved');
  });
});

router.get('/deletecomment/:id', function(req, res){
  console.log(req.params.id)
  Comments.remove({'_id': req.params.id}).exec(function(err, data){
    if(err){
      console.log(err);
    } else {
      console.log("Comment deleted");
    }
    res.redirect('/articlesaved');
  })
});

module.exports = router;