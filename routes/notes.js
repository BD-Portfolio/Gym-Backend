const express = require('express'),
      auth = require('../middlewares/auth'),
      validation = require('../validations/notesvalidation'),
      queries = require('../database/notesqueries'),
      router = express.Router();


// router to add new note by the admin
router.post('/addnote', auth, async (req, res) => {
    status = req.body.status;
    note = req.body.note;
    writer_id = req.admin.id;
    try{    
        const result = validation.validateNote(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot add new note", result: result.error.details[0].message });
        else{
            res.status(200).json({ code: 200, message: "Note added succesfully.", result: await queries.addNote(status, note, writer_id)});             
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot add new note", result: error.sqlMessage })
    }
})


// router to get all the notes 
router.get('/getallnotes', auth, async (req, res) =>{
    try{    
        var result = await queries.getNotes();
        res.status(200).json({ code: 200, message: "All notes retrieved succesfully.", result: result });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all notes", result: error.sqlMessage })
    }
})


module.exports = router;