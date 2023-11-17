const express = require('express'),
      auth = require('../middlewares/auth'),
      exercisequeries = require('../database/exercisequeries'),
      validation = require('../validations/setsvalidation'),
      queries = require('../database/setsqueries'),
      router = express.Router();


// router to add new sets to exercise by the admin
// id is exercise_id
router.post('/addsets/:id', auth, async (req, res) => {
    data = req.body.data;  
    tpr = req.body.tpr;  
    id = req.params.id;
    try{ 
        const result = validation.validateSets(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot add new sets", result: result.error.details[0].message });
        else{
            const check = validation.validateAllSets(data);
            if(check == false)
                res.status(400).json({ code: 400, message: "Cannot add new sets", result: "All fields are mandatory to fill." });    
            else{
                for(i=0; i<data.length; i++){
                    value = await queries.addSets(id, data[i].sets, data[i].reps, data[i].reset);
                }
                ans = await exercisequeries.updateExerciseTpr(id, tpr);
                res.status(200).json({ code: 200, message: "Sets added succesfully.", result: 'All the ' + data.length +' sets added.' });
            }             
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot add new sets", result: error.sqlMessage })
    }
})


// router to get all sets of exercise by exercise id 
// id is exercise_id
router.get('/getexercisesets/:id', auth, async (req, res) =>{
    id = req.params.id;
    try{    
        var result = await queries.getSets(id);
        res.status(200).json({ code: 200, message: "All sets retrieved succesfully.", result: result });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all sets", result: error.sqlMessage })
    }
})


// router to delete particular set by set id of specific exercise
router.delete('/deleteset/:id', auth, async (req, res) => {
    try {
        id = req.params.id;
        res.status(200).json({ code: 200, message: "set deleted succesfully.", result: await queries.deleteSet(id)});   
    } catch (error) {
        res.status(404).json({ code: 404, message: "Cannot delete set", result: error.sqlMessage })
    }  
})

module.exports = router;