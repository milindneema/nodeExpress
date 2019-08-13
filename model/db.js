const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    port:'3306',
    user:'root',
    password:'root',
    database:'mail',
});

con.connect((err)=>{
    if (err) throw err;
    else{
        console.log("Connected....");
        
    }
});

module.exports = con;