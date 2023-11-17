const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'infinity'
});

connection.connect(function(err){
    if(err)
        console.log('Cannot connect to mysql...');
    else
        console.log('Connected to mysql...');
})

module.exports = connection;