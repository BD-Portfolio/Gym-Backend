const connection = require('./connection');

let obj = {}

// Method to add exercises in training in due to new program in the database
obj.addTraining = (program_id, exercise_id) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into training (program_id, exercise_id) values (?, ?)',[program_id, exercise_id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to delete exercise from  program in the database
obj.deleteExercisefromTraining = (pid, eid) => {
    return new Promise( (resolve, reject) => {
        connection.query('delete from training where program_id = ? and exercise_id = ?',[pid, eid],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get all trainings of user from the database
obj.getAllTrainings = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from user_programs where user_id = ?',[id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = obj;
