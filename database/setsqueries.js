const connection = require('./connection')

let obj = {}

// Method to add new sets of particular exercise in the database
obj.addSets = (id, sets, reps, reset) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into sets (set_no, reps, reset, exercise_id) values(?,?,?,?)',[ sets, reps, reset, id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get all the sets of particular exercise by exercise id from database
obj.getSets = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from sets where exercise_id = ? order by id ASC',[id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to delete set of specific exercise by set id from the database
obj.deleteSet = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('delete from sets where id = ?', [id], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


module.exports = obj;
