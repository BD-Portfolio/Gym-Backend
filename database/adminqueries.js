const connection = require('./connection');

let obj = {}

// Method to register admin into database
obj.registerAdmin = (first_name, last_name,email, phone, bio, password) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into admin (first_name, last_name,email, phone, bio, password)values(?,?,?,?,?,?)',[first_name, last_name,email, phone, bio, password],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to check login details of admin
obj.checkLogin = (email) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from admin where email = ?', [email], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to count no. of admins in application
obj.adminCount = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select count(*) as total from admin', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get particular admin details by id from database
obj.adminDetailsById = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from admin where id = ?', [id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to update admin details in database
obj.updateAdminDetails = (id, first_name, last_name,email, phone, bio) => {
    return new Promise( (resolve, reject) => {
        connection.query('update admin set first_name = ?, last_name = ?, email = ?, phone = ?, bio = ? where id = ?', [first_name, last_name, email, phone, bio, id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}



// Method to update admin password in database
obj.updateAdminPassword = (id, password) => {
    return new Promise( (resolve, reject) => {
        connection.query('update admin set password = ? where id = ?', [password, id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = obj;
