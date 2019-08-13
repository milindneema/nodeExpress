const express = require('express');
//creating expresss ap
const app =express();
//create and start server  
app.listen(3000,()=>{
    console.log("server stATED.....");
    
});

//to serve static files
app.use(express.static('public'));


//config view engine
var  path = require('path');                    //solution for doutes of servers
app.set('views',path.join(__dirname,'views'));  //setting location
app.set('view engine','hbs');                   //setting extention

//first page has no name
//get method will run the app

//config vody parse
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

app.post('/logincheck',(request,responce)=>{
    var userid = request.body.uid;
    var pass = request.body.pwd;
    if (userid=="admin" && pass=="admin"){
    //responce.render('index',{msg:'login success'});
        responce.render('home');
     } else
    responce.render('index',{msg:'login fail'});
});

app.post('/register',(request,responce)=>{
    var userid = request.body.name;
    var userid = request.body.uid;
    var pass = request.body.pwd;
    if (true)
    responce.render('registration',{msg:'Registration success'});
    // else
    // responce.render('registration',{msg:'Registration fail'});
});



// app.get('/hello',(request,responce)=>{
//     responce.end("<h1>hello node js</h1>");
// });