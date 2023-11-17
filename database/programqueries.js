const connection = require('./connection');

let obj = {}

// Method to add new program in the database
obj.addProgram = (name) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into programs (name) values (?)',[name],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get program details from the database
obj.getProgram = (name) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from programs where name = ?',[name],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get program name using program id from the database
obj.getProgramById = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from programs where id = ?',[id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to get training details using program id from the database
obj.getTrainingExercises = (program_id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from training where program_id = ?',[program_id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get particular exercise of training  using  exercise id from the database
obj.getExercisesById = (exercise_id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from exercises where id = ?',[exercise_id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to get all sets of exercise using  exercise id from the database
obj.getExercisesSetsById = (exercise_id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from sets where exercise_id = ?',[exercise_id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}



// Method to change the program name in the database
obj.changeProgramName = (id, name) => {
    return new Promise( (resolve, reject) => {
        connection.query('update programs set name = ? where id = ?',[name, id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to insert program in user catalog in the database
obj.insertInUserPrograms = (uid, pid) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into user_programs (user_id, program_id) values (?, ?)',[uid, pid],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}




module.exports = obj;
