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

//mail api 
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fornodeapi@gmail.com',
    pass: 'focusonone'
  }
});

// //config view engine
// var  path = require('path');                    //solution for doutes of servers
// app.set('views',path.join(__dirname,'views'));  //setting location
// app.set('view engine','hbs');                   //setting extention

var hbs = require('express-handlebars');
app.engine('hbs',hbs({
    extname : 'hbs',
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname+'/views/layouts/',
}));
app.set('view engine','hbs')

// caching disabled for every route
app.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store,must-revalidate,max-stale=0, post-check=0, pre-check=0');
    next();
});

const redirect = (req,res,next)=>{
    if(!req.session.userid){
        res.render('index');
    }else{
        next();
    }
}
//first page has no name
//get method will run the app

var user;
var pic;

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

 app.get('/send',redirect,(request,responce)=>{
    responce.render('send',{user:user,img:pic});
});
app.get('/update',redirect,(request,responce)=>{
    var id = request.query.empid;
    var sql = "select * from mail where mid=?;"
    var input = [id];
    sql = mysql.format(sql,input);
    con.query(sql,(err,result)=>{
        if (err) throw err;
        else{
    responce.render('update',{data:result,user:user,img:pic});
        }
});

});

 app.get('/home',redirect,(request,responce)=>{
    console.log(pic);
    responce.render('home',{user:user,img:pic});
    
    
});

app.get('/change',redirect,(request,responce)=>{
    responce.render('change',{user:user,img:pic});
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
            responce.render('send',{msg:"Message Sent",user:user,img:pic});
        }
    });
    
});

app.get('/delete',(request,responce)=>{
    var mid = request.query.empid;      
    //empid is variable declared in view where delete button is created..
    var sql = "delete from mail where mid ="+mid;
    con.query(sql,(err)=>{
        if(err) throw err;
        else{
          var sql="select * from mail where receiver = ?;";
          var input = [request.session.userid];
          sql = mysql.format(sql,input);
          con.query(sql,(err,result)=>{
            if(err) throw err;
            else
            responce.render('inbox',{data:result,msg:"Data Deleted",user:user,img:pic}); //1) extention 2) location
        });
    }

        });
      
});

app.post('/updatedata',(request,responce)=>{
    var mid = request.query.empid;
    var sub=request.body.subject;
    var msg=request.body.message;      
    //empid is variable declared in view where delete button is created..
    var sql = "update mail set subject=?,message=? where mid=?;";
    var input =[sub,msg,mid];
    sql = mysql.format(sql,input);
    con.query(sql,(err)=>{
        if(err) throw err;
        else{
          var sql="select * from mail where sender = ?;";
          var input = [request.session.userid];
          sql = mysql.format(sql,input);
          con.query(sql,(err,result)=>{
            if(err) throw err;
            else
            responce.render('sent',{data:result,msg:"Data updated",user:user,img:pic}); //1) extention 2) location
        });
    }

        });
      
});
app.post('/changepass',(request,responce)=>{
    var npass = request.body.new;
    var ncpass = request.body.new1;
    var old = request.body.old;
    if(npass==ncpass){
    var sql = "update account set password=? where emailid=? and password=?";
    var input = [npass,request.session.userid,old];
    sql = mysql.format(sql,input);
    con.query(sql,(err)=>{
        if (err) throw err;
        else{
            var mailOptions = {
                from: 'fornodeapi@gmail.com',
                to: request.session.userid,
                subject: 'account details',
                text: 'Hello '+user+" your updated password is "+npass,
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            responce.render('home',{msg:"Password change and Mail sent",user:user,img:pic});
        }
    });
    }
    else{
        responce.render('change',{msg:"new password  doesnot match",user:user,img:pic})
    }
});

app.post('/logincheck',(request,responce)=>{
    var userid = request.body.uid;
    var pass = request.body.pwd;
    var sql = "select * from account where emailid=? and password=?"
    var input = [userid,pass];
    sql = mysql.format(sql,input);
    con.query(sql,(err,result)=>{
        if (err) throw err;
        else if(result.length>0){
            request.session.userid=userid;        
            user = result[0].name;
            pic = result[0].img;
             //responce.render('index',{msg:'login success'});
        responce.render('home',{user:user,img:pic});
    } else
   responce.render('index',{msg:'login fail'});
        
    })
   
});
//for file uploading
const upload=require('express-fileupload');
app.use(upload());

app.post('/register',(request,responce)=>{
    console.log(request.files);
    if(request.files)
    {
    var name = request.body.name;
    var userid = request.body.uid;
    var pass = request.body.pwd;
    var random =Math.random().toString(36).slice(-8);

    var alldata = request.files.img;
    var filename = alldata.name;
    var altfname = random+'_'+filename;
    alldata.mv('./public/upload/'+altfname,(err)=>{
        if (err) throw err;
        else{
            var sql = "insert into account(name,emailid,password,img) values(?,?,?,?);";
            var input = [name,userid,pass,altfname];
            sql = mysql.format(sql,input);
            con.query(sql, function (err1) {
                if (err1) throw err1;
                else{
                    responce.render('index',{msg1:'Registration successful and file Uploaded'});
                }    
            });
        }
    });
   
}
});

app.get('/inbox',redirect,(request,responce)=>{
    var sql = "select * from mail where receiver = ?;";
    var input = [request.session.userid];
    sql = mysql.format(sql,input);
    con.query(sql, function (err1,result) {
        if (err1) throw err1;
        else{
        responce.render('inbox',{data:result,user:user,img:pic});
        }
});
});

app.get('/sent',redirect,(request,responce)=>{
    var sql = "select * from mail where sender = ?;";
    var input = [request.session.userid];
    sql = mysql.format(sql,input);
    con.query(sql, function (err1,result) {
        if (err1) throw err1;
        else{
        responce.render('sent',{data:result,user:user,img:pic});
        }
});
});

app.get('/logout',(request,response)=>{
    request.session.destroy();
    response.render('index');
    });


// Always put in last of every file
app.use(function(req,res){
    res.status(404);
    res.render('404',{title: '404: Requested Page not found'});
});

// app.get('/hello',(request,responce)=>{
//     responce.end("<h1>hello node js</h1>");
// });