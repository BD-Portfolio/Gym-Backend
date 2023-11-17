const path = require('path'),
      express = require('express'),
      multer = require('multer'),
      picture = require('../services/storage'),
      auth = require('../middlewares/auth'),
      store = require('../services/clearstorage'),
      queries = require('../database/userqueries'),
      encryption = require('../utilities/encryption'),
      validation = require('../validations/uservalidations'),
      router = express.Router();

// Initiating multer to store data in disk
//********************************************************************************************//
 var upload = multer({ storage: picture })
//********************************************************************************************//


// router to add users by the admin
router.post('/register', auth, async (req, res) => {
    first_name = req.body.first_name;
    last_name = req.body.last_name;
    gender = req.body.gender;
    dob = req.body.dob;
    address = req.body.address;
    mobile = req.body.mobile;
    zip_code = req.body.zip_code;
    phone = req.body.phone;
    country = req.body.country;
    email = req.body.email;
    activated = 0;
    image= req.body.image || null;
    filepath = req.body.filepath || null;
    try{    
        const result = validation.validateUserRegistration(req.body);
        if(result.error){
            if(filepath && filepath != '' && filepath != null)
                store.deleteImage(filepath);
            res.status(400).json({ code: 400, message: "Cannot add user", result: result.error.details[0].message });
        }else{
            if(dob[4]=='/' && dob[7]=='/' ){
                res.status(200).json({ code: 200, message: "User added succesfully.", result: await queries.registerUser(first_name, last_name, gender, dob, address, mobile, zip_code, phone, country, email, activated, image)});
            }else{
                store.deleteImage(filepath);
                res.status(400).json({ code: 400, message: "Cannot add user", result: "Date of Birth is not in format YYYY/MM/DD" });    
            }             
        }
    }catch (error) {
        if(filepath && filepath != '' && filepath != null)
            store.deleteImage(filepath);
        res.status(404).json({ code: 404, message: "Cannot add user", result: error.sqlMessage })
    }
})


// router to add profile pic of user by admin
router.post('/uploadprofilepic', upload.single('image'), auth , async (req, res) =>{
    try {
        const file = req.file;
        if (!file) {
            image = null;
            res.status(200).json({ code: 200, message: "Image uploaded successfully", result: image, fpath: image});
        }else {
            ext = path.extname(file.originalname);
            if (ext == '.png' || ext == '.jpg' ){
                var image = "http://localhost:3000/api/get/" + file.path;
                res.status(200).json({ code: 200, message: "Image uploaded successfully", result: image, fpath : file.path});
            }else{
                store.deleteImage(file.path);
                res.status(400).json({ code: 400, message: "Image cannot be uploaded", result: "Image file is not jpg or png." });    
            }
        }
    } catch (error) {
        store.deleteImage(file.path);
        res.status(404).json({ code: 404, message: "Cannot add profile pic", result: error.sqlMessage })   
    }
})


// router to get total no. of users in application
router.get('/usercount', auth, async (req, res) => {
    try{    
        const result = await queries.userCount();
            res.status(200).json({ code: 200, message: "users count retrieved", result: result[0].total 
            });           
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot count no. of users", result: error.sqlMessage })
    }
})


// router to get name and image of all the users   
router.get('/specificuserdetails', auth, async (req,res) =>{
    try{
        const result = await queries.specificUserDetails();
        res.status(200).json({ code: 200, message: "specific details of users retrieved", result: result });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get details of users", result: error.sqlMessage })
    }
})


// router to get all details of all the users by page no.   
router.get('/alluserdetails/:page_no', async (req,res) =>{
    try{
        page_no = req.params.page_no;
        start_index = (page_no * 9) - 8;
        const result = await queries.userDetailsByPageNo(start_index);
        res.status(200).json({ code: 200, message: "Details of users retrieved", result: result });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get details of users", result: error.sqlMessage })
    }
})


// router to get user details by id   
router.get('/userdetails/:id', auth, async (req,res) =>{
    try{
        id = req.params.id;
        const result = await queries.userDetailsById(id);
        console.log('user----',result);
        res.status(200).json({ code: 200, message: "Details of particular user retrieved", result: result });   
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot get details of user", result: error.sqlMessage })
    }
})


//router to update user status by id by the admin
router.put('/updateuserstatus/:id', auth, async (req, res) => {
    try{
        id = req.params.id;
        activated = req.body.activated;
        const check = validation.validateStatusOfUser(req.body);
        if(check.error){
            res.status(400).json({ code: 400, message: "Cannot update status", result: result.error.details[0].message });
        }else{
            const result = await queries.updateStatus(id, activated);
            res.status(200).json({ code: 200, message: "Status of user updated successfully", result: result }); 
        }
           
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot update status of user", result: error.sqlMessage })
    }
})


// router to search user 
router.post('/searchuser', auth, async (req,res) => {
    name = req.body.name;
    try{
        res.status(200).json({ code: 200, message: "User found successfully", result: await queries.findUser(name) });  
    }catch(error){
        res.status(404).json({ code: 404, message: "Cannot find such user", result: error.sqlMessage })
    }
})



// router to get total no. of pages required to represent users in application
router.get('/userpages', async (req, res) => {
    try{    
        const result = await queries.userCount();
        res.status(200).json({ code: 200, message: "Total no. of user pages retrieved", result: Math.ceil(result[0].total/9) });          
    }catch (error) {
        res.status(404).json({ code: 404, message: "Cannot count total no. of user pages", result: error.sqlMessage })
    }
})


module.exports = router;