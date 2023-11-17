const connection = require('./connection')

let obj = {}

// Method to add new message for all the users in the database
obj.addMessage = (title, date, message) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into messages (title, date, message) values(?,?,?)',[title, date, message],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to delete message from the database
obj.deleteMessage = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('delete from messages where id = ?', [id], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get all the messages from database
obj.getAllMessages = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from messages order by id DESC', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to count no. of messages in application
obj.messageCount = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select count(*) as total from messages', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to add new message for the single user in the database
obj.addSingleUserMessage = (title, date, message, user_id) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into single_user_message (title, date, message, user_id) values(?,?,?,?)',[title, date, message, user_id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get all the messages of single user by id from database
obj.getAllSingleUserMessages = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from single_user_message where user_id = ? order by id DESC', [id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to delete message of single user by user id and message id from the database
obj.deleteSingleUserMessage = (mid, uid) => {
    return new Promise( (resolve, reject) => {
        connection.query('delete from single_user_message where id = ? and user_id = ?', [mid, uid], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}



// Method to get last 3 messages from database
obj.getLastMessages = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from messages order by id DESC limit 0,3', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}



module.exports = obj;
