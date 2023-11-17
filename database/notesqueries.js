const connection = require('./connection')

let obj = {}

// Method to add new note in the database
obj.addNote = (status, note, writer_id) => {
    return new Promise( (resolve, reject) => {
        connection.query('insert into notes (status, note, writer_id) values(?,?,?)',[status, note, writer_id],(err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}


// Method to get all the notes from database
obj.getNotes = () => {
    return new Promise( (resolve, reject) => {
        connection.query('select A.first_name, A.last_name, N.status, N.note FROM admin AS A INNER JOIN notes AS N ON A.id = N.writer_id order by N.id DESC', function(err, data){
            if(err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = obj;
