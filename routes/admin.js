const express = require('express'),
      auth = require('../middlewares/auth'),
      queries = require('../database/adminqueries'),
      userqueries = require('../database/userqueries'),
      encryption = require('../utilities/encryption'),
      validation = require('../validations/adminvalidations'),
      router = express.Router();


// router to handle register request of admin
router.post('/register', async (req, res) => {
    const {first_name, last_name, email, phone, bio, password} = req.body.first_name;
    
    try{    
        const result = validation.validateAdminRegistration(req.body);
        if(result.error)
            res.status(400).json({ code: 400, message: "Cannot register admin", result: result.error.details[0].message });
        else{
            password = await encryption.hashPassword(password);
            res.status(200).json({ code: 200, message: "Admin registered succesfully.", result: await queries.registerAdmin(first_name, last_name, email, phone, bio, password)});             
        }
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot register admin", result: error.sqlMessage })
    }
})


// router to handle login request of admin
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const check  = validation.validateAdminLogin(req.body);
    try {
        if(check.error)
            res.status(400).json({ code : 400, message : "Email id or password is wrong", result : check.error.details[0].message });
        else{
            const data = await queries.checkLogin(email);
            if(data.length == 0)
                res.status(400).json({ code : 400, message : "Unregistered mail id", result : "Mail id is not registered" });                
            else{
                rehash = await encryption.decryptPassword(password, data[0].password);
                if(!rehash){
                    res.status(400).json({ code : 400, message : "Incorrect password", result : "Invalid password" });
                }else{
                    const token = await encryption.generateJWT( data[0].id, data[0].first_name, data[0].last_name, data[0].email, data[0].phone, data[0].bio);
                    res.header('x-auth-token',token).status(200).json({ code: 200, message: "Login succesfully", token: token});
                }
            } 
        } 
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot login", result: error.sqlMessage })
    }
    
})


// router to get total no. of admins in application
router.get('/admincount', auth, async (req, res) => {
    try{    
        const result = await queries.adminCount();
            res.status(200).json({ code: 200, message: "Admin count retrieved", result: result[0].total 
            });           
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot count no. of admins", result: error.sqlMessage })
    }
})


// router to get total no. of app users including admins
router.get('/appuserscount', auth, async (req, res) => {
    try{    
        const admins = await queries.adminCount();
        const users = await userqueries.userCount();
            res.status(200).json({ code: 200, message: "app users count retrieved", result: (admins[0].total + users[0].total) });           
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot count no. of appusers", result: error.sqlMessage })
    }
})


// router to get admin details by id   
router.get('/admindetails', auth, async (req,res) =>{
    try{
        id = req.admin.id;
        const result = await queries.adminDetailsById(id);
        res.status(200).json({ code: 200, message: "Details of particular admin retrieved", result: result });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get details of admin", result: error.sqlMessage })
    }
})


// router to get name  of admin who is logged in 
router.get('/adminname', auth, async (req,res) =>{
    try{
        first_name = req.admin.first_name;
        last_name = req.admin.last_name;
        res.status(200).json({ code: 200, message: "Name of admin retrieved.", result: first_name +' '+ last_name });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get name of admin", result: "Admin not logged in." })
    }
})


// router to update details of admin
router.put('/updateadmindetails', auth, async (req, res) => {
    const {first_name, last_name, email, phone, bio} = req.body;
    id = req.admin.id;
    try{
        check = validation.validateAdminDetailsUpdate(req.body);
        if(check.error)
            res.status(400).json({ code : 400, message : "Cannot update details of admin", result : check.error.details[0].message });
        else{
            const result = await queries.updateAdminDetails(id, first_name, last_name,email, phone, bio);
            res.status(200).json({ code: 200, message: "Details of admin updated", result: result });
        }   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot update details of admin", result: error.sqlMessage })
    }
})



// router to change the password of admin
router.put('/changepassword', auth, async (req, res) => {
    const {old_password ,new_password, confirm_password} = req.body;
    id = req.admin.id;
    try{
        check = validation.validatePasswordChange(req.body);
        if(check.error)
            res.status(400).json({ code : 400, message : "Cannot change password of admin", result : check.error.details[0].message });
        else{
            const value = await queries.adminDetailsById(id);
            checking = await encryption.decryptPassword(old_password, value[0].password);
            if( checking == true){
                if( new_password != confirm_password)
                    res.status(400).json({ code: 400, message: "Cannot chnage password of admin", result: "new password and confirm password doesnot match." })
                else{
                    password = await encryption.hashPassword(new_password);
                    const result = await queries.updateAdminPassword(id, password);
                    res.status(200).json({ code: 200, message: "Password of admin changed", result: result });
                }
            }else
                res.status(400).json({ code: 400, message: "Cannot change password of admin", result: "old password is not correct." })  
        }   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot change password of admin", result: error.sqlMessage })
    }
})




module.exports = router;