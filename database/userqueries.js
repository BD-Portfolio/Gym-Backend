const connection = require('./connection');
const { resolve } = require('path');

let obj = {}

// Method to register user by admin into database
obj.registerUser = (first_name, last_name, gender, dob, address, mobile, zip_code, phone, country, email, activated,image) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into users (first_name, last_name, gender, dob, address, mobile, zip_code, phone, country, email, activated, image)values(?,?,?,?,?,?,?,?,?,?,?,?)',[first_name, last_name, gender, dob, address, mobile, zip_code, phone, country, email, activated, image],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to count no. of users in application
obj.userCount = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select count(*) as total from users', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}

// Method to get all users name and image from database
obj.specificUserDetails = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select first_name, last_name, image from users', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}

// Method to get all users details according to page no. from database
obj.userDetailsByPageNo = (start_index) => {
    return new Promise( (resolve, reject) => {                                                       //9
        connection.query('select id, first_name, last_name, dob, activated from users order by id asc limit ?, 9', [(start_index - 1)], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get particular user details by id from database
obj.userDetailsById = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from users where id = ?', [id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


//Method to update status of user by the admin
obj.updateStatus = (id, status) => {
    return new Promise( (resolve, reject) => {
        connection.query('update users set activated = ? where id = ?', [status, id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
} 


//Method to search user by first_name or last_name 
obj.findUser = (name) => {
    return new Promise( (resolve, reject) => {
        connection.query("SELECT U1.* FROM users AS U1 WHERE (concat(U1.first_name,' ',U1.last_name) like ? ? ? or concat(U1.last_name,' ',U1.first_name) like ? ? ?)", ['%', name, '%', '%', name, '%'], function(err, data){    
            if(err) reject(err);
            else resolve(data);
        })
    })
}


module.exports = obj;
