const express = require('express');
const con = require('./model/db');
const mysql = require('mysql');
//creating expresss ap
const app =express();
//create and start server  
app.listen(3000,()=>{
    console.log("SERVER STARTED.....");
    
});

//to serve static files
app.use(express.static('public'));


//config view engine
var  path = require('path');                    //solution for doutes of servers
app.set('views',path.join(__dirname,'views'));  //setting location
app.set('view engine','hbs');                   //setting extention

//first page has no name
//get method will run the app

var userid;

//config body parse
const bodyparser =require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));

app.get('/',(request,responce)=>{
    //either
//    responce.end("<h1>form submited by post method</h1>");
//  or
//     //tranfer request to html page
        responce.render('index');
//     // doutes of server //1) extention //2) location
 });

 app.get('/registration',(request,responce)=>{
     responce.render('registration');
 });

 app.get('/home',(request,responce)=>{
    responce.render('home');
});

app.get('/send',(request,responce)=>{
    responce.render('send',{user:userid});
});

app.get('/delete',(request,responce)=>{
    responce.render('delete',{user:userid});
});

app.get('/change',(request,responce)=>{
    responce.render('change',{user:userid});
});

app.post('/logincheck',(request,responce)=>{
    userid = request.body.uid;
    var pass = request.body.pwd;
    var sql = "select * from account where emailid=? and password=?"
    var input = [userid,pass];
    sql = mysql.format(sql,input);
    con.query(sql,(err,result)=>{
        if (err) throw err;
        else if(result.length>0){
             //responce.render('index',{msg:'login success'});
        responce.render('home',{user:userid});
    } else
   responce.render('index',{msg:'login fail'});
        
    })
   
});

app.post('/register',(request,responce)=>{
    var name = request.body.name;
    var userid = request.body.uid;
    var pass = request.body.pwd;
    var sql = "insert into account(name,emailid,password) values(?,?,?);";
    var input = [name,userid,pass];
    sql = mysql.format(sql,input);
    pool.query(sql, function (err1) {
        if (err1) throw err1;
        else{
            responce.render('index',{msg:'Registration successful'});
        }    
    });

});

app.use(function(req,res){
    res.status(404);
    res.render('404',{title: '404: Requested Page not found'});
});

// app.get('/hello',(request,responce)=>{
//     responce.end("<h1>hello node js</h1>");
// });