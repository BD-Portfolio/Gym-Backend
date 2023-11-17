const express = require('express'),
      auth = require('../middlewares/auth'),
      validation = require('../validations/programvalidation'),
      queries = require('../database/programqueries'),
      trainingqueries = require('../database/trainingqueries'),
      router = express.Router();

// router to create new program by the admin
router.post('/newprogram/:uid', auth, async (req, res) => {
    uid = req.params.uid;
    name = req.body.name;
    exercise_ids = req.body.exercise_ids;
    try{    
        const result = validation.validateCreateExercise(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot add new program", result: result.error.details[0].message });
        else{
            const value = await queries.addProgram(name);
            if(value.affectedRows == 1){
                const value1 = await queries.getProgram(name);
                for(i=0; i<exercise_ids.length; i++){
                    check = await trainingqueries.addTraining(value1[0].id, exercise_ids[i]);
                } 
                var done = queries.insertInUserPrograms(uid, value1[0].id);
                res.status(200).json({ code: 200, message: "Program added succesfully.", result: "New program added."});
            }else{
                res.status(400).json({ code: 400, message: "Cannot add new program due to training details problem.", result: "Cannot add new program." });
            }    
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot add new program", result: error.sqlMessage })
    }
})


// router to get all the exercises with details within a training in a program
// id is program id
router.get('/getallexercisesoftraining/:id', auth, async (req, res) =>{
    id = req.params.id;
    array1 = [];
    try{            
        var result = await queries.getProgramById(id);
        var result_1 = await queries.getTrainingExercises(id);
        for(i=0; i<result_1.length; i++){
            var result_2 = await queries.getExercisesById(result_1[i].exercise_id);
            var result_3 = await queries.getExercisesSetsById(result_1[i].exercise_id);
            var data = { 'program' : result[0], 'training' : result_1[i], 'exercise' : result_2[0], 'sets' : result_3};
            array1.push(data);
        } 
        res.status(200).json({ code: 200, message: "All training exercises retrieved succesfully.", result: array1 });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all exercises", result: error.sqlMessage })
    }
})

// Router to update name of training that is changing program name
// id is program id
router.put('/changeprogramname/:id', auth, async (req, res) => {
    name = req.body.name;
    id = req.params.id;
    try{      
        if(name == null || name == '' || name == undefined){
            res.status(404).json({ code: 404, message: "Cannot change program name.", result: "Name cannot be null or empty or undefined." });
        }
        else{
            res.status(200).json({ code: 200, message: "Program name changed succesfully.", result: await queries.changeProgramName(id, name) });
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot change program name.", result: error.sqlMessage });
    }
})

// Router to delete exercise from training of particular user
router.delete('/deleteexercisefromprogram/:pid/:eid', auth, async (req, res) => {
    pid = req.params.pid;
    eid = req.params.eid;
    try{      
        res.status(200).json({ code: 200, message: "Exercise from program deleted succesfully.", result : await trainingqueries.deleteExercisefromTraining(pid, eid) });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot delete exercise from program.", result: error.sqlMessage });
    }
    
})

// Router to get all the programs of particular user
// id is user id
router.get('/getalltrainingofuser/:id', auth, async (req, res) =>{
    id = req.params.id;
    array2 = [];
    
    try{            
        
        var value = await trainingqueries.getAllTrainings(id);
        for(j=0; j<value.length; j++){
            var result = await queries.getProgramById(value[j].program_id);
            var result_1 = await queries.getTrainingExercises(value[j].program_id);
            array1 = [];
            for(i=0; i<result_1.length; i++){
                var result_2 = await queries.getExercisesById(result_1[i].exercise_id);
                var result_3 = await queries.getExercisesSetsById(result_1[i].exercise_id);
                var data = { 'program' : result[0], 'training' : result_1[i], 'exercise' : result_2[0], 'sets' : result_3};
                var output = { 'Training' : data };
                array1.push(output);
            }
            array2.push(array1);
        }
        res.status(200).json({ code: 200, message: "All training exercises retrieved succesfully.", result: array2 });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all exercises", result: error.sqlMessage })
    }
})
module.exports = router;