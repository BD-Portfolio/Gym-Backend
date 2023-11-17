const connection = require('./connection')

let obj = {}


// Method to add new exercise by admin into database
obj.addExercise = (name, description, ppr, pps, tpr, image, video) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into exercises (name, description, image, video, ppr, pps, tpr)values(?,?,?,?,?,?,?)',[name, description, image, video, ppr, pps, tpr],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


//Method to search exercise by name
obj.findExercise = (name) => {
    return new Promise( (resolve, reject) => {
        connection.query('SELECT E1.* FROM exercises AS E1 WHERE E1.name LIKE ? ? ?',['%',name,'%'], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get all exercise names and images from database
obj.exerciseSpecificDetails = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select id, name, image from exercises', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get particular exercise details by id from database
obj.exerciseDetailsById = (id) => {
    return new Promise( (resolve, reject) => {
        connection.query('select * from exercises where id = ?', [id], function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}



// Method to update exercise by admin into database
obj.updateExercise = (id, name, description, ppr, pps) => {
    return new Promise( (resolve, reject) => {
            connection.query('update exercises set name = ?, description = ?, ppr = ?, pps = ? where id = ?',[name, description, ppr, pps, id],(err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
    })
}



// Method to update exercise by admin into database
obj.updateExerciseTpr = (id, tpr) => {
    return new Promise( (resolve, reject) => {
            connection.query('update exercises set tpr = ? where id = ?',[tpr, id],(err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
    })
}

// Method to update image by admin into database
obj.updateExerciseImage = (id, image) => {
    return new Promise( (resolve, reject) => {
            connection.query('update exercises set image = ? where id = ?',[image, id],(err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
    })
}


// Method to update video by admin into database
obj.updateExerciseVideo = (id, video) => {
    return new Promise( (resolve, reject) => {
            connection.query('update exercises set video = ? where id = ?',[video, id],(err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
    })
}

module.exports = obj;
