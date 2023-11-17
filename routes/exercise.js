const express = require('express'),
      path = require('path'),
      multer = require('multer'),
      auth = require('../middlewares/auth'),
      store = require('../services/clearstorage'),
      validation = require('../validations/exercisevalidation'),
      gallery = require('../services/storage'),
      queries = require('../database/exercisequeries'),
      router = express.Router();


// Initiating multer to store data in disk
//********************************************************************************************//
var upload = multer({ storage: gallery });
//********************************************************************************************//



// router to add new exercise by the admin
router.post('/addexercise', auth, async (req, res) => {
    name = req.body.name;
    description = req.body.description;
    ppr = req.body.ppr;
    pps = req.body.pps;
    tpr = "0";
    image = req.body.image || null;
    imagepath = req.body.imagepath || null;
    video = req.body.video || null;
    videopath = req.body.videopath || null;
    try{    
        const result = validation.validateExercise(req.body);
        if(result.error){
            if(imagepath && imagepath != '' && imagepath != null)
                await store.deleteImage(imagepath);
            if(videopath && videopath != '' && videopath != null)
                await store.deleteVideo(videopath);
            res.status(400).json({ code: 400, message: "Cannot add new exercise", result: result.error.details[0].message });
        }else{
            value = await queries.addExercise(name, description, ppr, pps, tpr, image, video);
            res.status(200).json({ code: 200, message: "Exercise added succesfully.", result: value});       
        }
    }catch (error) {
        if(imagepath && imagepath != '' && imagepath != null)
            await store.deleteImage(imagepath);
        if(videopath && videopath != '' && videopath != null)
            await store.deleteVideo(videopath);
        res.status(404).json({ code: 404, message: "Cannot add new exercise", result: error.sqlMessage })
    }
})


// router to add image of the exercise
router.post('/uploadexerciseimage', upload.single('image'), auth, async (req, res) =>{
    const file = req.file;
    try {
        if (!file) {
            image = null;
            res.status(200).json({ code: 200, message: "Image uploaded successfully", result: image, imagepath: image});
        }else {
            ext = path.extname(file.originalname);
            if (ext == '.png' || ext == '.jpg' ){
                var image = "http://localhost:3000/api/get/" + file.path;
                res.status(200).json({ code: 200, message: "Image uploaded successfully", result: image, imagepath : file.path});
            }else{
                store.deleteImage(file.path);
                res.status(400).json({ code: 400, message: "Image cannot be uploaded", result: "Image file is not jpg or png." });    
            }
        }
    } catch (error) {
        store.deleteImage(file.path);
        res.status(404).json({ code: 404, message: "Cannot add exercise image", result: error })   
    }
})


// router to add video of the exercise
router.post('/uploadexercisevideo', upload.single('video'), auth, async (req, res) =>{
    try {
        const file = req.file;
        if (!file) {
            video = null;
            res.status(200).json({ code: 200, message: "Video uploaded successfully", result: video, videopath: video});
        }else {
            ext = path.extname(file.originalname);
            if (ext == '.mp4' || ext == '.3gp' ){
                var video = "http://localhost:3000/api/get/" + file.path;
                res.status(200).json({ code: 200, message: "Video uploaded successfully", result: video, videopath : file.path});
            }else{
                store.deleteVideo(file.path);
                res.status(400).json({ code: 400, message: "Video cannot be uploaded", result: "Video file is not mp4 or 3gp." });    
            }
        }
    } catch (error) {
        store.deleteVideo(file.path);
        res.status(404).json({ code: 404, message: "Cannot add video of exercise", result: error.sqlMessage })   
    }
})



// router to search exercise 
router.post('/searchexercise', auth, async (req,res) => {
    name = req.body.name;
    try{
        res.status(200).json({ code: 200, message: "Exercise found successfully", result: await queries.findExercise(name) });  
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot find such exercise", result: error.sqlMessage })
    }
})



// router to get id, name and image of all the exercises   
router.get('/exercisespecificdetails', auth, async (req,res) =>{
    try{
        const result = await queries.exerciseSpecificDetails();
        res.status(200).json({ code: 200, message: "specific details of exercises retrieved", result: result });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get specific details of exercises", result: error.sqlMessage })
    }
})


// router to get exercise details by id   
router.get('/exercisedetails/:id', auth, async (req,res) =>{
    try{
        id = req.params.id;
        const result = await queries.exerciseDetailsById(id);
        res.status(200).json({ code: 200, message: "Details of particular exercise retrieved", result: result[0] });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get details of exercise", result: error.sqlMessage })
    }
})



// router to update exercise by the admin
router.post('/updateexercise/:id', auth, async (req, res) => {
    id = req.params.id;
    name = req.body.name;
    description = req.body.description;
    ppr = req.body.ppr;
    pps = req.body.pps;
    try{    
        const result = validation.validateExerciseUpdate(req.body);
        if(result.error){
            res.status(400).json({ code: 400, message: "Cannot update exercise", result: result.error.details[0].message });
        }else{
            value = await queries.updateExercise(id, name, description, ppr, pps);
            res.status(200).json({ code: 200, message: "Exercise updated succesfully.", result: value});       
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot update exercise", result: error.sqlMessage })
    }
})




// router to update image of the exercise
// if image updated then status = 1 else status = 0
router.post('/updateexerciseimage/:id/:status', upload.single('image'), auth, async (req, res) =>{
    id = req.params.id;
    status = req.params.status;
    const file = req.file;
    try {
        if (status == 1){
            if (!file) {
                image = null;
                result = await queries.updateExerciseImage(id ,image);
                res.status(200).json({ code: 200, message: "Image updated successfully", result: result});
            }else {
                ext = path.extname(file.originalname);
                if (ext == '.png' || ext == '.jpg'){
                    var image = "http://localhost:3000/api/get/" + file.path;
                    result = await queries.updateExerciseImage(id ,image);
                    res.status(200).json({ code: 200, message: "Image updated successfully", result: result});
                }else{
                    store.deleteImage(file.path);
                    res.status(400).json({ code: 400, message: "Image cannot be updated", result: "Image file is not jpg or png." });    
                }
            }
        }else{
            res.status(200).json({ code: 200, message: "Since image was not choosed, so image has not been updated.", result: "Previous image is saved."});
        }
    } catch (error) {
        store.deleteImage(file.path);
        res.status(404).json({ code: 404, message: "Cannot update exercise image", result: error })   
    }
})


// router to update video of the exercise
// if video updated then status = 1 else status = 0
router.post('/updateexercisevideo/:id/:status', upload.single('video'), auth, async (req, res) =>{
    id = req.params.id;
    status = req.params.status;
    const file = req.file;
    try {
        if (status == 1){
            if (!file) {
                video = null;
                result = await queries.updateExerciseVideo(id ,video);
                res.status(200).json({ code: 200, message: "Video updated successfully", result: result});
            }else {
                ext = path.extname(file.originalname);
                if (ext == '.mp4' || ext == '.3gp'){
                    var video = "http://localhost:3000/api/get/" + file.path;
                    result = await queries.updateExerciseVideo(id ,video);
                    res.status(200).json({ code: 200, message: "Video updated successfully", result: result});
                }else{
                    store.deleteVideo(file.path);
                    res.status(400).json({ code: 400, message: "Video cannot be updated", result: "Video file is not mp4 or 3gp." });    
                }
            }
        }else{
            res.status(200).json({ code: 200, message: "Since video was not choosed, so video has not been updated.", result: "Previous video is saved."});
        }
    } catch (error) {
        store.deleteVideo(file.path);
        res.status(404).json({ code: 404, message: "Cannot update exercise video", result: error })   
    }
})




module.exports = router;