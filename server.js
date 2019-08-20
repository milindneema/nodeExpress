const express = require('express');
const con = require('./model/db');
const mysql = require('mysql');
const session = require('express-session');
//creating expresss ap
const app =express();
//create and start server  
app.listen(3000,()=>{
    console.log("SERVER STARTED.....");
    
});

//to serve static files
app.use(session({secret:"1234567"}));
app.use(express.static('public'));


//config view engine
var  path = require('path');                    //solution for doutes of servers
app.set('views',path.join(__dirname,'views'));  //setting location
app.set('view engine','hbs');                   //setting extention

// caching disabled for every route
app.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store,must-revalidate,max-stale=0, post-check=0, pre-check=0');
    next();
});

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

 app.get('/send',(request,responce)=>{
    responce.render('send');
});

 app.get('/home',(request,responce)=>{
    responce.render('home');
});


app.post('/sendreq',(request,responce)=>{
    var rec=request.body.remail;
    var sub=request.body.subject;
    var msg=request.body.message;
    sql = "insert into mail(sender,receiver,subject,message) values(?,?,?,?)"
    var input = [request.session.userid,rec,sub,msg];
    sql = mysql.format(sql,input);
    con.query(sql,(err)=>{
        if (err) throw err;
        else{
            request.render('send',{msg:"Message Sent"});
        }
    });
    
});

app.get('/delete',(request,responce)=>{
    var mid = request.query.mid;
    var sql = "delete from mail where mid ="+mid;
    con.query(sql,(err)=>{
        if(err) throw err;
        else{
          var sql="select * from employee";
          con.query(sql,(err,result)=>{
            if(err) throw err;
            else
            response.render('inbox',{data:result,msg:"Data Deleted"}); //1) extention 2) location
        });
    }

        });
      
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
            request.session.userid=userid;        
             //responce.render('index',{msg:'login success'});
        responce.render('home',{user:request.session.userid});
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
    con.query(sql, function (err1) {
        if (err1) throw err1;
        else{
            responce.render('index',{msg:'Registration successful'});
        }    
    });

});

app.get('/inbox',(request,responce)=>{
    var sql = "select * from mail where receiver = ?;";
    var input = [userid];
    sql = mysql.format(sql,input);
    con.query(sql, function (err1,result) {
        if (err1) throw err1;
        else{
            console.log(result);
            
        responce.render('inbox',{data:result});
        }
});
});

app.get('/logout',(request,response)=>{
    request.session.destroy();
    response.render('index');
    });

app.use(function(req,res){
    res.status(404);
    res.render('404',{title: '404: Requested Page not found'});
});

// app.get('/hello',(request,responce)=>{
//     responce.end("<h1>hello node js</h1>");
// });