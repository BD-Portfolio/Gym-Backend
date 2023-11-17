const express = require('express'),
      auth = require('../middlewares/auth'),
      validation = require('../validations/messagevalidation'),
      queries = require('../database/messagequeries'),
      router = express.Router();




// router to add new message by the admin for all the users( global message)
router.post('/addmessage', auth, async (req, res) => {
    title = req.body.title;
    message = req.body.message;
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let date = day  +' '+ month  + ' ' + year;
    try{    
        const result = validation.validateMessage(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot add new message", result: result.error.details[0].message });
        else{
            res.status(200).json({ code: 200, message: "message added succesfully.", result: await queries.addMessage(title, date, message)});             
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot add new message", result: error.sqlMessage })
    }
})


// router to delete message by id from ( global messages )
router.delete('/deletemessage/:id', auth, async (req, res) => {
    try {
        id = req.params.id;
        res.status(200).json({ code: 200, message: "message deleted succesfully.", result: await queries.deleteMessage(id)});   
    } catch (error) {
        res.status(404).json({ code: 404, message: "Cannot delete message", result: error.sqlMessage })
    }  
})


// router to get all the messages ( global message ) 
router.get('/getallmessages', auth, async (req, res) =>{
    try{    
        var result = await queries.getAllMessages();
        res.status(200).json({ code: 200, message: "All messages retrieved succesfully.", result: result });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all messages", result: error.sqlMessage })
    }
})


// router to get total no. of messages in application ( global message)
router.get('/messagecount', auth,  async (req, res) => {
    try{    
        const result = await queries.messageCount();
            res.status(200).json({ code: 200, message: "messages count retrieved", result: result[0].total 
            });           
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot count no. of messages", result: error.sqlMessage })
    }
})


// router to add message for single user
router.post('/addmessageofsingleuser/:user_id', auth, async (req, res) => {
    user_id = req.params.user_id;
    title = req.body.title;
    message = req.body.message;
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let date = day  +' '+ month  + ' ' + year;
    try{    
        const result = validation.validateSingleUserMessage(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot add new message", result: result.error.details[0].message });
        else{
            res.status(200).json({ code: 200, message: "message added succesfully.", result: await queries.addSingleUserMessage(title, date, message, user_id)});             
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot add new message", result: error.sqlMessage })
    }
})


// router to get messages of single user
router.get('/getsingleusermessages/:id', auth, async (req, res) =>{
    try{    
        id = req.params.id;
        var result = await queries.getAllSingleUserMessages(id);
        res.status(200).json({ code: 200, message: "All messages retrieved succesfully.", result: result });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all messages", result: error.sqlMessage })
    }
})


// router to delete message of single user
router.delete('/deletemessageofsingleuser/:uid/:mid', auth, async (req, res) => {
    try {
        uid = req.params.uid;
        mid = req.params.mid;
        res.status(200).json({ code: 200, message: "message deleted succesfully.", result: await queries.deleteSingleUserMessage(mid, uid) });   
    } catch (error) {
        res.status(404).json({ code: 404, message: "Cannot delete message", result: error.sqlMessage })
    }  
})


// router to add message for multiple user
router.post('/addmessageofmultipleuser', auth, async (req, res) => {
    title = req.body.title;
    date = req.body.date;
    message = req.body.message;
    user_id = req.body.user_id;
    try{    
        const result = validation.validateMultipleUserMessage(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot add new message to multiple users", result: result.error.details[0].message });
        else{
            for(i=0; i<user_id.length; i++){
                value = await queries.addSingleUserMessage(title, date, message, user_id[i].id);
            }
            res.status(200).json({ code: 200, message: "message added succesfully for all users.", result: "Message added to all" + user_id.length + "users"});             
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot add new message for multiple users", result: error.sqlMessage })
    }
})


// router to get last 3 messages ( global message ) for the message alert
router.get('/getlastmessages', auth, async (req, res) =>{
    try{    
        var result = await queries.getLastMessages();
        res.status(200).json({ code: 200, message: "All 3 messages retrieved succesfully.", result: result });
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot retrieve all 3 messages", result: error.sqlMessage })
    }
})

module.exports = router;